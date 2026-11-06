import { TallerConfig } from '../types/workshop';
import { ManualDocument } from '../data/projectManuals';

/**
 * Convierte texto Markdown a HTML enriquecido para Word y PDF
 */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeBuffer = '';
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      let tHtml = '<table border="1" cellpadding="7" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 14pt 0; font-size: 10pt; border-color: #cbd5e1;">\n';
      tableRows.forEach((row, idx) => {
        const isHeader = idx === 0;
        tHtml += '  <tr style="' + (isHeader ? 'background-color: #0f172a; color: #ffffff;' : (idx % 2 === 0 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;')) + '">\n';
        row.forEach(cell => {
          if (isHeader) {
            tHtml += `    <th style="padding: 8pt 10pt; text-align: left; font-weight: bold; border: 1pt solid #cbd5e1; color: #ffffff; background-color: #0f172a;">${cell}</th>\n`;
          } else {
            tHtml += `    <td style="padding: 7pt 10pt; border: 1pt solid #cbd5e1; color: #1e293b;">${cell}</td>\n`;
          }
        });
        tHtml += '  </tr>\n';
      });
      tHtml += '</table>\n';
      html += tHtml;
      tableRows = [];
    }
    inTable = false;
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      html += `<pre style="background-color: #0f172a; color: #38bdf8; padding: 12pt; border-radius: 6pt; font-family: 'Consolas', 'Courier New', monospace; font-size: 9.5pt; line-height: 1.4; border: 1pt solid #1e293b; overflow-x: auto; white-space: pre-wrap; page-break-inside: avoid;">${escapeHtml(codeBuffer.trimEnd())}</pre>\n`;
      codeBuffer = '';
    }
    inCodeBlock = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
      } else {
        if (inTable) flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer += rawLine + '\n';
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        continue;
      }
      const cells = trimmed.split('|').slice(1, -1).map(c => formatInline(c.trim()));
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (trimmed === '') continue;

    if (trimmed === '---' || trimmed === '***') {
      html += '<hr style="border: none; border-top: 1.5pt solid #e2e8f0; margin: 18pt 0;" />\n';
      continue;
    }

    if (trimmed.startsWith('# ')) {
      html += `<h1 style="color: #0f172a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 22pt; font-weight: bold; border-bottom: 2.5pt solid #0284c7; padding-bottom: 6pt; margin-top: 24pt; margin-bottom: 10pt; page-break-after: avoid;">${formatInline(trimmed.substring(2))}</h1>\n`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      html += `<h2 style="color: #0369a1; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 16pt; font-weight: bold; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 20pt; margin-bottom: 8pt; page-break-after: avoid;">${formatInline(trimmed.substring(3))}</h2>\n`;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      html += `<h3 style="color: #0f172a; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; page-break-after: avoid;">${formatInline(trimmed.substring(4))}</h3>\n`;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      html += `<h4 style="color: #334155; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11.5pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt; page-break-after: avoid;">${formatInline(trimmed.substring(5))}</h4>\n`;
      continue;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      html += `<li style="margin-left: 20pt; margin-bottom: 4pt; color: #1e293b; line-height: 1.5;">${formatInline(trimmed.substring(2))}</li>\n`;
      continue;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      html += `<p style="margin-left: 20pt; margin-bottom: 4pt; color: #1e293b; line-height: 1.5;"><strong>${numMatch[1]}.</strong> ${formatInline(numMatch[2])}</p>\n`;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      html += `<div style="background-color: #f0fdf4; border-left: 4pt solid #16a34a; padding: 10pt 14pt; margin: 12pt 0; color: #166534; font-size: 10.5pt; page-break-inside: avoid;">${formatInline(trimmed.substring(2))}</div>\n`;
      continue;
    }

    html += `<p style="margin: 6pt 0 10pt 0; color: #1e293b; line-height: 1.6; font-size: 11pt; text-align: justify;">${formatInline(trimmed)}</p>\n`;
  }

  if (inTable) flushTable();
  if (inCodeBlock) flushCode();

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatInline(str: string): string {
  let res = str;
  res = res.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  res = res.replace(/`([^`]+)`/g, '<code style="font-family: \'Consolas\', monospace; background-color: #f1f5f9; color: #0369a1; padding: 1pt 4pt; border-radius: 3pt; font-size: 10pt; border: 1pt solid #e2e8f0;">$1</code>');
  return res;
}

/**
 * Envuelve el cuerpo HTML con el esquema oficial de Microsoft Word (.doc)
 */
export function wrapWordHtml(bodyHtml: string, title: string, subtitle: string, tallerConfig?: TallerConfig): string {
  const workshopName = tallerConfig?.nombre || 'TALLER DE MOTOCICLETAS';
  const workshopSlogan = tallerConfig?.slogan || 'Servicio Técnico Especializado';

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      background-color: #ffffff;
    }
    .header-banner {
      background-color: #0f172a;
      color: #ffffff;
      padding: 18pt 24pt;
      border-radius: 6pt;
      margin-bottom: 24pt;
      border-bottom: 4pt solid #0284c7;
    }
    .header-badge {
      display: inline-block;
      background-color: #0284c7;
      color: #ffffff;
      font-size: 9pt;
      font-weight: bold;
      padding: 3pt 8pt;
      border-radius: 3pt;
      text-transform: uppercase;
      letter-spacing: 1pt;
      margin-bottom: 8pt;
    }
    .footer-note {
      margin-top: 36pt;
      padding-top: 12pt;
      border-top: 1pt solid #cbd5e1;
      font-size: 9pt;
      color: #64748b;
      text-align: center;
    }
    table {
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
<div class="Section1">
  <div class="header-banner">
    <div class="header-badge">DOCUMENTO OFICIAL DEL SISTEMA</div>
    <h1 style="color: #ffffff; margin: 0; font-size: 24pt; font-weight: bold; border: none; padding: 0;">${escapeHtml(title)}</h1>
    <p style="color: #94a3b8; font-size: 12pt; margin: 6pt 0 0 0;">${escapeHtml(subtitle)}</p>
    <div style="margin-top: 12pt; font-size: 9.5pt; color: #cbd5e1; border-top: 1pt solid #334155; padding-top: 8pt;">
      <span><strong>Taller:</strong> ${escapeHtml(workshopName)} (${escapeHtml(workshopSlogan)})</span> &nbsp;|&nbsp;
      <span><strong>Sistema:</strong> MotoGestión FX v2.4.0</span> &nbsp;|&nbsp;
      <span><strong>Versión Word (.doc)</strong></span>
    </div>
  </div>

  ${bodyHtml}

  <div class="footer-note">
    <p>${escapeHtml(workshopName)} - MotoGestión FX | Documento exportado para edición en Microsoft Word y archivo técnico</p>
  </div>
</div>
</body>
</html>`;
}

/**
 * Descarga directamente un archivo .doc compatible con Microsoft Word
 */
export function downloadAsWordFile(
  filename: string, 
  title: string, 
  subtitle: string, 
  markdown: string, 
  tallerConfig?: TallerConfig
) {
  const bodyHtml = markdownToHtml(markdown);
  const fullWordHtml = wrapWordHtml(bodyHtml, title, subtitle, tallerConfig);

  const cleanFilename = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  const blob = new Blob(['\ufeff', fullWordHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Descarga el compendio unificado de los 6 documentos en un solo archivo Word (.doc)
 */
export function downloadAllManualsAsWord(manuales: ManualDocument[], tallerConfig?: TallerConfig) {
  const workshopName = tallerConfig?.nombre || 'TALLER DE MOTOCICLETAS';
  
  let unifiedBody = `
    <div style="text-align: center; padding: 40pt 20pt 30pt 20pt; page-break-after: always;">
      <h1 style="font-size: 28pt; color: #0f172a; margin-bottom: 10pt; border: none;">COMPENDIO MAESTRO DE DOCUMENTACIÓN Y MANUALES</h1>
      <h2 style="font-size: 18pt; color: #0284c7; font-weight: normal; border: none; margin-bottom: 20pt;">SISTEMA MOTOGESTIÓN FX v2.4.0-PRO</h2>
      <p style="font-size: 13pt; color: #475569; max-width: 600px; margin: 0 auto 30pt auto;">
        Manual de Arquitectura, Manual de Usuario, Manual de Uso Operativo, Guía Técnica de Código Java/SQL, Manual de Instalación Local y Conexión de Bases de Datos Access y Nube.
      </p>
      <div style="background-color: #f1f5f9; padding: 15pt; border-radius: 8pt; display: inline-block; text-align: left; margin: 0 auto;">
        <p style="margin: 3pt 0;"><strong>Empresa / Taller:</strong> ${escapeHtml(workshopName)}</p>
        <p style="margin: 3pt 0;"><strong>Fecha de Edición:</strong> Octubre 2026</p>
        <p style="margin: 3pt 0;"><strong>Plataforma:</strong> Aplicación de Escritorio Java 17+ / JavaFX 21 & Web Multi-Terminal</p>
        <p style="margin: 3pt 0;"><strong>Estado del Software:</strong> Producción / Entregable Oficial</p>
      </div>
    </div>
  `;

  manuales.forEach((manual, index) => {
    const chapterHtml = markdownToHtml(manual.contenido);
    unifiedBody += `
      <div style="page-break-before: always; margin-top: 30pt;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 14pt 18pt; border-radius: 6pt; margin-bottom: 20pt; border-left: 6pt solid #0284c7;">
          <span style="font-size: 9pt; font-weight: bold; color: #38bdf8; text-transform: uppercase;">Capítulo ${index + 1} de ${manuales.length}</span>
          <h2 style="color: #ffffff; margin: 4pt 0 0 0; font-size: 18pt; border: none; padding: 0;">${escapeHtml(manual.titulo)}</h2>
          <p style="color: #94a3b8; margin: 4pt 0 0 0; font-size: 11pt;">${escapeHtml(manual.subtitulo)}</p>
        </div>
        ${chapterHtml}
      </div>
    `;
  });

  const fullWordHtml = wrapWordHtml(
    unifiedBody, 
    'Compendio Maestro de Manuales - MotoGestión FX', 
    'Los 6 Documentos Oficiales en un solo archivo', 
    tallerConfig
  );

  const blob = new Blob(['\ufeff', fullWordHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Abre una ventana limpia para impresión y guardado como PDF nativo
 */
export function printDocumentAsPdf(
  title: string, 
  subtitle: string, 
  markdown: string, 
  tallerConfig?: TallerConfig
) {
  const bodyHtml = markdownToHtml(markdown);
  const workshopName = tallerConfig?.nombre || 'TALLER DE MOTOCICLETAS';
  const workshopSlogan = tallerConfig?.slogan || 'Servicio Técnico Especializado';
  const logoUrl = tallerConfig?.logoUrl || '';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor habilite las ventanas emergentes (popups) para abrir la vista de impresión en PDF.');
    return;
  }

  const printHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)} - PDF</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 15mm 18mm 15mm;
      @bottom-right {
        content: counter(page);
      }
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .print-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .print-header .logo-area {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .print-header img {
      width: 55px;
      height: 55px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }
    .print-header .company-title {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .print-header .company-sub {
      font-size: 9pt;
      color: #64748b;
    }
    .doc-meta-badge {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      font-size: 8.5pt;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .doc-title-block {
      background: #0f172a;
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 6px;
      margin-bottom: 24px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc-title-block h1 {
      margin: 0;
      font-size: 18pt;
      color: #ffffff;
      border: none;
      padding: 0;
    }
    .doc-title-block p {
      margin: 5px 0 0 0;
      font-size: 10.5pt;
      color: #94a3b8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background-color: #0f172a !important;
      color: #ffffff !important;
      font-weight: bold;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    pre {
      background-color: #0f172a !important;
      color: #38bdf8 !important;
      padding: 12px;
      border-radius: 5px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      line-height: 1.4;
      overflow-x: auto;
      white-space: pre-wrap;
      page-break-inside: avoid;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .print-footer {
      margin-top: 40px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 8.5pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .print-action-bar {
      position: sticky;
      top: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .btn-print {
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
    }
    @media print {
      .print-action-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-action-bar">
    <div>
      <strong>Vista de Impresión / Guardar como PDF</strong>
      <span style="color: #64748b; font-size: 12px; margin-left: 8px;">Presione el botón para abrir el diálogo de impresión y elija <em>"Guardar como PDF"</em></span>
    </div>
    <button class="btn-print" onclick="window.print()">
      🖨️ Guardar como PDF / Imprimir
    </button>
  </div>

  <div class="print-header">
    <div class="logo-area">
      ${logoUrl ? `<img src="${logoUrl}" alt="Logo Taller" onerror="this.style.display='none'" />` : ''}
      <div>
        <div class="company-title">${escapeHtml(workshopName)}</div>
        <div class="company-sub">${escapeHtml(workshopSlogan)}</div>
      </div>
    </div>
    <div class="doc-meta-badge">
      Documentación Oficial
    </div>
  </div>

  <div class="doc-title-block">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(subtitle)}</p>
  </div>

  ${bodyHtml}

  <div class="print-footer">
    <span>MotoGestión FX - Sistema Integral para Taller de Motocicletas</span>
    <span>Página Generada para Impresión y Descarga en PDF</span>
  </div>

  <script>
    // Pequeño timeout para permitir la carga de fuentes y estilos antes de llamar al diálogo
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(printHtml);
  printWindow.document.close();
}

/**
 * Imprime todos los 6 manuales unificados en un solo documento PDF
 */
export function printAllManualsAsPdf(manuales: ManualDocument[], tallerConfig?: TallerConfig) {
  const workshopName = tallerConfig?.nombre || 'TALLER DE MOTOCICLETAS';
  const workshopSlogan = tallerConfig?.slogan || 'Servicio Técnico Especializado';
  const logoUrl = tallerConfig?.logoUrl || '';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor habilite las ventanas emergentes (popups) para abrir la vista de impresión.');
    return;
  }

  let unifiedChaptersHtml = '';
  manuales.forEach((m, idx) => {
    const chapterBody = markdownToHtml(m.contenido);
    unifiedChaptersHtml += `
      <div style="page-break-before: always; margin-top: 30px;">
        <div style="background: #0f172a; color: #ffffff; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px; border-left: 5px solid #0284c7; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
          <div style="font-size: 8.5pt; font-weight: bold; color: #38bdf8; text-transform: uppercase;">Capítulo ${idx + 1} de ${manuales.length}</div>
          <h2 style="margin: 3px 0 0 0; font-size: 17pt; color: #ffffff; border: none; padding: 0;">${escapeHtml(m.titulo)}</h2>
          <p style="margin: 3px 0 0 0; font-size: 10pt; color: #94a3b8;">${escapeHtml(m.subtitulo)}</p>
        </div>
        ${chapterBody}
      </div>
    `;
  });

  const printHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Compendio Completo de Manuales - MotoGestión FX</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 15mm 18mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .print-action-bar {
      position: sticky;
      top: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .btn-print {
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background-color: #0f172a !important;
      color: #ffffff !important;
      font-weight: bold;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    pre {
      background-color: #0f172a !important;
      color: #38bdf8 !important;
      padding: 12px;
      border-radius: 5px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      line-height: 1.4;
      overflow-x: auto;
      white-space: pre-wrap;
      page-break-inside: avoid;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      .print-action-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-action-bar">
    <div>
      <strong>Compendio Completo (Todos los 6 Manuales)</strong>
      <span style="color: #64748b; font-size: 12px; margin-left: 8px;">Haga clic en el botón para imprimir o guardar como un solo archivo PDF.</span>
    </div>
    <button class="btn-print" onclick="window.print()">
      🖨️ Guardar Todo como PDF
    </button>
  </div>

  <!-- Portada del Compendio -->
  <div style="text-align: center; padding: 60px 20px 40px 20px; page-break-after: always;">
    ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;" />` : ''}
    <h1 style="font-size: 26pt; color: #0f172a; margin-bottom: 10px; font-weight: 800;">COMPENDIO INTEGRAL DE DOCUMENTACIÓN Y MANUALES</h1>
    <h2 style="font-size: 16pt; color: #0284c7; font-weight: normal; margin-bottom: 25px;">SISTEMA MOTOGESTIÓN FX v2.4.0</h2>
    
    <div style="max-width: 550px; margin: 0 auto 40px auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: left; font-size: 10pt;">
      <p style="margin: 4px 0;"><strong>Empresa / Taller:</strong> ${escapeHtml(workshopName)}</p>
      <p style="margin: 4px 0;"><strong>Eslogan:</strong> ${escapeHtml(workshopSlogan)}</p>
      <p style="margin: 4px 0;"><strong>Arquitectura del Sistema:</strong> Java 17+ / JavaFX 21 (MVC + DAO) + Multi-Terminal LAN</p>
      <p style="margin: 4px 0;"><strong>Fecha de Generación:</strong> Octubre 2026</p>
    </div>

    <div style="max-width: 600px; margin: 0 auto; text-align: left; border-top: 1px solid #cbd5e1; padding-top: 20px;">
      <h3 style="font-size: 13pt; color: #0f172a; margin-bottom: 12px;">Índice General de Capítulos:</h3>
      <ol style="color: #334155; font-size: 10.5pt; line-height: 1.8;">
        ${manuales.map(m => `<li><strong>${escapeHtml(m.titulo)}</strong> - <span style="color: #64748b;">${escapeHtml(m.subtitulo)}</span></li>`).join('')}
      </ol>
    </div>
  </div>

  <!-- Capítulos -->
  ${unifiedChaptersHtml}

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(printHtml);
  printWindow.document.close();
}
