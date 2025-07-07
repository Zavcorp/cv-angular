import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { TranslateService , TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-export',
  imports: [TranslateModule],
  templateUrl: './pdf-export.component.html',
  styleUrl: './pdf-export.component.css'
})

export class PdfExportComponent {



  @Input() elementId: string = 'cv-content';
  @Input() cvExportContainer: string = 'cvExportContainer';
  @Input() fileName: string = 'cv-adrianzavaleta.pdf';

  downloadPDF() {
    const element = document.getElementById(this.elementId);
    const exportContainer  = document.getElementById(this.cvExportContainer);

    if (element && exportContainer) {
      // Clonamos el contenido al contenedor oculto
      exportContainer.innerHTML = element.innerHTML;
      exportContainer.classList.remove('d-none');

      // Removemos elementos que no deben aparecer en el PDF
      exportContainer.querySelectorAll('.no-print').forEach(el => el.remove());

      // Añadimos clase al body para fijar layout
      document.body.classList.add('pdf-export-mode');

      // Forzar dimensiones tipo desktop
      exportContainer.style.width = '1200px';
      exportContainer.style.maxWidth = '1200px';
      exportContainer.style.padding = '20px';
      exportContainer.style.background = '#fff';
      exportContainer.style.boxSizing = 'border-box';

      // Mostrar loader
      Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espera un momento',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Capturar la versión fija
      html2canvas(exportContainer, {
        scale: 2,   // mayor calidad
        useCORS: true,
        ignoreElements: (el) => el.classList.contains('no-print')
      }).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = 210;
        const pageHeight = 297;
        const pxPerMm = canvas.width / pageWidth;
        const pageHeightPx = pageHeight * pxPerMm;

        let renderedHeight = 0;
        const totalPages = Math.ceil(canvas.height / pageHeightPx);

        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
          const pageCanvas = document.createElement('canvas');
          const context = pageCanvas.getContext('2d');

          const remainingHeight = canvas.height - renderedHeight;
          const currentPageHeightPx = remainingHeight > pageHeightPx ? pageHeightPx : remainingHeight;

          pageCanvas.width = canvas.width;
          pageCanvas.height = currentPageHeightPx;

          if (context) {
            context.drawImage(
              canvas,
              0,
              renderedHeight,
              canvas.width,
              currentPageHeightPx,
              0,
              0,
              canvas.width,
              currentPageHeightPx
            );

            const imgData = pageCanvas.toDataURL('image/jpeg', 0.9);
            const imgHeight = (pageCanvas.height * pageWidth) / canvas.width;

            if (pageNum > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
          }

          renderedHeight += currentPageHeightPx;
        }

        pdf.save(this.fileName);

        // Restaurar estado
        document.body.classList.remove('pdf-export-mode');
        exportContainer.classList.add('d-none');
        Swal.close();
        Swal.fire('¡Listo!', 'Tu CV se ha descargado correctamente.', 'success');
      });
    }
  }


  downloadPDFSinglePage() {
    const element = document.getElementById(this.elementId);
    if (!element) return;

    Swal.fire({
      title: 'Generando PDF...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Crear iframe temporal
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '1200px';
    iframe.style.height = 'auto';
    iframe.style.visibility = 'hidden';
    iframe.style.zIndex = '9999';

    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Copiar head completo incluyendo CSS y fuentes
    const headHTML = document.head.innerHTML;

    // Clonar el contenido del CV
    const contentHTML = element.outerHTML;

    // Escribir contenido al iframe
    doc.open();
    doc.write(`
      <html>
        <head>${headHTML}
          <style>
            body { margin: 0; padding: 20px; box-sizing: border-box; width: 1200px; background: #fff; }
            .no-print { display: none !important; }
            ul, ol {
              list-style: none !important;
              padding-left: 0 !important;
              margin: 0 0 10px 0;
            }
            li::marker, li::before {
              display: none !important;
              content: '' !important;
            }
            li {
              margin-bottom: 6px;
              border: none !important;
            }
            .list-group-item {
              border: none !important;
            }
            i {
              color: #000 !important;
              border: none !important;
            }
            i.bi {
              color: #fff !important;
            }
          </style>
        </head>
        <body>${contentHTML}</body>
      </html>
    `);
    doc.close();

    // Esperar que iframe cargue estilos
    iframe.onload = () => {
      const iframeBody = doc.body;

      html2canvas(iframeBody, {
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const pxPerMm = canvas.width / pageWidth;
        const pageHeightPx = pageHeight * pxPerMm;

        let renderedHeight = 0;
        let pageCount = Math.ceil(canvas.height / pageHeightPx);

        for (let i = 0; i < pageCount; i++) {
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pageHeightPx, canvas.height - renderedHeight);

          const context = pageCanvas.getContext('2d');
          context!.drawImage(
            canvas,
            0, renderedHeight,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          );

          const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const imgHeight = (pageCanvas.height * pageWidth) / canvas.width;

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

          renderedHeight += pageCanvas.height;
        }

        pdf.save(this.fileName);

        // Limpiar iframe y loader
        document.body.removeChild(iframe);
        Swal.close();
        Swal.fire('¡Listo!', 'Tu CV se ha descargado correctamente.', 'success');
      });
    };
  }

}

