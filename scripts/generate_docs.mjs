import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const publicWordDir = path.join(rootDir, 'public', 'docs', 'word');
const docsWordDir = path.join(rootDir, 'docs', 'word');

fs.mkdirSync(publicWordDir, { recursive: true });
fs.mkdirSync(docsWordDir, { recursive: true });

const docFiles = [
  {
    id: '01_general',
    filename: '01_DOCUMENTO_PROYECTO_GENERAL.md',
    wordName: '01_Documento_General_del_Proyecto_MotoGestionFX.doc',
    title: 'Documento General del Proyecto: MotoGestión FX',
    subtitle: 'Arquitectura Integral, Módulos Desarrollados y Especificaciones Técnicas',
    badge: 'ARQUITECTURA & ESPECIFICACIONES'
  },
  {
    id: '02_usuario',
    filename: '02_MANUAL_DE_USUARIO.md',
    wordName: '02_Manual_de_Usuario_Funcional_MotoGestionFX.doc',
    title: 'Manual de Usuario Funcional',
    subtitle: 'Perfiles de Acceso, Pantallas y Funcionalidades por Rol',
    badge: 'MANUAL DE USUARIO'
  },
  {
    id: '03_operativo',
    filename: '03_MANUAL_DE_USO.md',
    wordName: '03_Manual_de_Uso_Operativo_Dia_a_Dia.doc',
    title: 'Manual de Uso Operativo (Día a Día)',
    subtitle: 'Procedimientos Estándar Paso a Paso (SOP) para el Taller',
    badge: 'OPERACIÓN DIARIA'
  },
  {
    id: '04_codigo',
    filename: '04_GUIA_DE_CODIGO_MODIFICACIONES.md',
    wordName: '04_Guia_Tecnica_de_Codigo_y_Modificaciones.doc',
    title: 'Guía Técnica de Código y Modificaciones',
    subtitle: 'Desarrollo en Java 17+ / JavaFX 21 - Arquitectura MVC & Patrón DAO',
    badge: 'GUÍA DE DESARROLLO'
  },
  {
    id: '05_instalacion',
    filename: '05_MANUAL_INSTALACION_LOCAL_Y_DESCARGA.md',
    wordName: '05_Manual_de_Instalacion_y_Despliegue_Local.doc',
    title: 'Manual de Instalación y Despliegue Local',
    subtitle: 'De Google AI Studio a los Equipos del Taller en Red LAN',
    badge: 'INSTALACIÓN & DESPLIEGUE'
  },
  {
    id: '06_base_datos',
    filename: '06_MANUAL_BASE_DATOS_ACCESS_Y_NUBE.md',
    wordName: '06_Manual_Conexion_Bases_de_Datos_Access_y_Nube.doc',
    title: 'Manual de Creación y Conexión de Bases de Datos',
    subtitle: 'Microsoft Access, SQLite, PostgreSQL LAN y Bases en la Nube Gratuitas',
    badge: 'BASES DE DATOS & SQL'
  }
];

function markdownToWordHtml(mdContent, docMeta) {
  // Convert markdown to clean Word-compatible HTML
  const lines = mdContent.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeBuffer = '';
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      let tHtml = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 14pt 0; font-size: 10pt; border-color: #cbd5e1;">\n';
      tableRows.forEach((row, idx) => {
        const isHeader = idx === 0;
        tHtml += '  <tr style="' + (isHeader ? 'background-color: #0f172a; color: #ffffff;' : (idx % 2 === 0 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;')) + '">\n';
        row.forEach(cell => {
          if (isHeader) {
            tHtml += `    <th style="padding: 8pt 10pt; text-align: left; font-weight: bold; border: 1pt solid #cbd5e1; color: #ffffff;">${cell}</th>\n`;
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
      html += `<pre style="background-color: #0f172a; color: #38bdf8; padding: 12pt; border-radius: 6pt; font-family: 'Consolas', 'Courier New', monospace; font-size: 9.5pt; line-height: 1.4; border: 1pt solid #1e293b; overflow-x: auto; white-space: pre-wrap;">${escapeHtml(codeBuffer.trimEnd())}</pre>\n`;
      codeBuffer = '';
    }
    inCodeBlock = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check code blocks
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

    // Check tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Check if separator line
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

    // Empty lines
    if (trimmed === '') {
      continue;
    }

    // Dividers
    if (trimmed === '---' || trimmed === '***') {
      html += '<hr style="border: none; border-top: 1.5pt solid #e2e8f0; margin: 18pt 0;" />\n';
      continue;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      html += `<h1 style="color: #0f172a; font-family: 'Calibri', Arial, sans-serif; font-size: 22pt; font-weight: bold; border-bottom: 2pt solid #0284c7; padding-bottom: 6pt; margin-top: 24pt; margin-bottom: 10pt;">${formatInline(trimmed.substring(2))}</h1>\n`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      html += `<h2 style="color: #0369a1; font-family: 'Calibri', Arial, sans-serif; font-size: 16pt; font-weight: bold; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 20pt; margin-bottom: 8pt;">${formatInline(trimmed.substring(3))}</h2>\n`;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      html += `<h3 style="color: #0f172a; font-family: 'Calibri', Arial, sans-serif; font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;">${formatInline(trimmed.substring(4))}</h3>\n`;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      html += `<h4 style="color: #334155; font-family: 'Calibri', Arial, sans-serif; font-size: 11.5pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt;">${formatInline(trimmed.substring(5))}</h4>\n`;
      continue;
    }

    // Bullet lists
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      html += `<li style="margin-left: 20pt; margin-bottom: 4pt; color: #1e293b; line-height: 1.5;">${formatInline(trimmed.substring(2))}</li>\n`;
      continue;
    }

    // Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      html += `<p style="margin-left: 20pt; margin-bottom: 4pt; color: #1e293b; line-height: 1.5;"><strong>${numMatch[1]}.</strong> ${formatInline(numMatch[2])}</p>\n`;
      continue;
    }

    // Blockquotes / Callout notes
    if (trimmed.startsWith('> ')) {
      html += `<div style="background-color: #f0fdf4; border-left: 4pt solid #16a34a; padding: 10pt 14pt; margin: 12pt 0; color: #166534; font-size: 10.5pt;">${formatInline(trimmed.substring(2))}</div>\n`;
      continue;
    }

    // Regular paragraph
    html += `<p style="margin: 6pt 0 10pt 0; color: #1e293b; line-height: 1.6; font-size: 11pt; text-align: justify;">${formatInline(trimmed)}</p>\n`;
  }

  if (inTable) flushTable();
  if (inCodeBlock) flushCode();

  return wrapWordDocument(html, docMeta);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatInline(str) {
  let res = str;
  // Bold + Italic
  res = res.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code
  res = res.replace(/`([^`]+)`/g, '<code style="font-family: \'Consolas\', monospace; background-color: #f1f5f9; color: #0369a1; padding: 1pt 4pt; border-radius: 3pt; font-size: 10pt; border: 1pt solid #e2e8f0;">$1</code>');
  return res;
}

function wrapWordDocument(bodyHtml, meta) {
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${meta.title}</title>
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
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .header-banner {
        background-color: #0f172a !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      table tr th {
        background-color: #0f172a !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
<div class="Section1">
  <div class="header-banner">
    <div class="header-badge">${meta.badge}</div>
    <h1 style="color: #ffffff; margin: 0; font-size: 24pt; font-weight: bold; border: none; padding: 0;">${meta.title}</h1>
    <p style="color: #94a3b8; font-size: 12pt; margin: 6pt 0 0 0;">${meta.subtitle}</p>
    <div style="margin-top: 12pt; font-size: 9.5pt; color: #cbd5e1; border-top: 1pt solid #334155; padding-top: 8pt;">
      <span><strong>Sistema:</strong> MotoGestión FX v2.4.0-PRO</span> &nbsp;|&nbsp;
      <span><strong>Fecha:</strong> Octubre 2026</span> &nbsp;|&nbsp;
      <span><strong>Documento Oficial de Entrega</strong></span>
    </div>
  </div>

  ${bodyHtml}

  <div class="footer-note">
    <p>MotoGestión FX - Sistema Integral para Taller de Motocicletas | Generado oficialmente en formato Word / Imprimible PDF</p>
  </div>
</div>
</body>
</html>`;
}

console.log('Generando documentos Word (.doc) a partir de los archivos Markdown...');

const allDocumentsData = [];
let completeUnifiedHtml = '';

for (const doc of docFiles) {
  const filePath = path.join(docsDir, doc.filename);
  if (fs.existsSync(filePath)) {
    const md = fs.readFileSync(filePath, 'utf8');
    const wordHtml = markdownToWordHtml(md, doc);

    // Save to public/docs/word/ and docs/word/
    fs.writeFileSync(path.join(publicWordDir, doc.wordName), wordHtml, 'utf8');
    fs.writeFileSync(path.join(docsWordDir, doc.wordName), wordHtml, 'utf8');

    console.log(`✓ Creado: ${doc.wordName} (${(wordHtml.length / 1024).toFixed(1)} KB)`);

    allDocumentsData.push({
      ...doc,
      fullMarkdown: md,
      wordHtml: wordHtml
    });

    completeUnifiedHtml += `<div style="page-break-before: always; margin-top: 30pt;">\n${wordHtml}\n</div>\n`;
  } else {
    console.warn(`No se encontró: ${filePath}`);
  }
}

// Generar documento unificado maestro
const masterMeta = {
  title: 'MANUAL MAESTRO Y DOCUMENTACIÓN COMPLETA - MOTOGESTIÓN FX',
  subtitle: 'Compendio Integral de Arquitectura, Manual de Usuario, Operación, Código, Instalación y Bases de Datos',
  badge: 'COMPENDIO MAESTRO COMPLETO'
};
const masterUnifiedDoc = wrapWordDocument(completeUnifiedHtml, masterMeta);
fs.writeFileSync(path.join(publicWordDir, '00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc'), masterUnifiedDoc, 'utf8');
fs.writeFileSync(path.join(docsWordDir, '00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc'), masterUnifiedDoc, 'utf8');
console.log(`✓ Creado Manual Maestro Completo: 00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc (${(masterUnifiedDoc.length / 1024).toFixed(1)} KB)`);

// Ahora actualizar src/data/projectManuals.ts con todo el contenido completo
const tsContent = `export interface ManualDocument {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: 'arquitectura' | 'usuario' | 'operacion' | 'codigo' | 'instalacion' | 'base_datos';
  icono: string;
  descripcionCorta: string;
  nombreArchivo: string;
  nombreWord: string;
  urlWord: string;
  contenido: string;
}

export const MANUAL_MAESTRO_UNIFICADO = {
  nombreArchivo: '00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc',
  urlWord: '/docs/word/00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc',
  titulo: 'Compendio Maestro Unificado (Todos los 6 Documentos)',
  subtitulo: 'Toda la documentación técnica, manuales de usuario y guías en un solo archivo Word / PDF'
};

export const MANUALES_DEL_PROYECTO: ManualDocument[] = [
${allDocumentsData.map((d, index) => {
  return `  {
    id: '${d.id}',
    titulo: '${d.title.replace(/'/g, "\\'")}',
    subtitulo: '${d.subtitle.replace(/'/g, "\\'")}',
    categoria: '${d.id === '01_general' ? 'arquitectura' : d.id === '02_usuario' ? 'usuario' : d.id === '03_operativo' ? 'operacion' : d.id === '04_codigo' ? 'codigo' : d.id === '05_instalacion' ? 'instalacion' : 'base_datos'}',
    icono: '${d.id === '01_general' ? 'Layers' : d.id === '02_usuario' ? 'Users' : d.id === '03_operativo' ? 'ClipboardList' : d.id === '04_codigo' ? 'Code2' : d.id === '05_instalacion' ? 'Download' : 'Database'}',
    descripcionCorta: '${d.subtitle.replace(/'/g, "\\'")}',
    nombreArchivo: '${d.filename}',
    nombreWord: '${d.wordName}',
    urlWord: '/docs/word/${d.wordName}',
    contenido: ${JSON.stringify(d.fullMarkdown)}
  }`;
}).join(',\n')}
];
`;

fs.writeFileSync(path.join(rootDir, 'src', 'data', 'projectManuals.ts'), tsContent, 'utf8');
console.log('✓ Actualizado exitosamente src/data/projectManuals.ts con los textos completos y enlaces Word!');
