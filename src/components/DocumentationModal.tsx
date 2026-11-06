import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  Check, 
  Copy, 
  Search, 
  FileCode, 
  Layers, 
  Users, 
  ClipboardList, 
  Code2, 
  Database,
  ExternalLink,
  BookOpen,
  Sparkles,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { MANUALES_DEL_PROYECTO, ManualDocument } from '../data/projectManuals';
import { TallerConfig } from '../types/workshop';
import { 
  downloadAsWordFile, 
  downloadAllManualsAsWord, 
  printDocumentAsPdf, 
  printAllManualsAsPdf,
  markdownToHtml
} from '../utils/documentExport';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tallerConfig?: TallerConfig;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  tallerConfig
}) => {
  const [selectedId, setSelectedId] = useState<string>('01_general');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'formateado' | 'fuente'>('formateado');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredManuals = useMemo(() => {
    if (!searchTerm.trim()) return MANUALES_DEL_PROYECTO;
    const q = searchTerm.toLowerCase();
    return MANUALES_DEL_PROYECTO.filter(
      m => m.titulo.toLowerCase().includes(q) || 
           m.subtitulo.toLowerCase().includes(q) || 
           m.contenido.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const activeManual = useMemo(() => {
    return MANUALES_DEL_PROYECTO.find(m => m.id === selectedId) || MANUALES_DEL_PROYECTO[0];
  }, [selectedId]);

  if (!isOpen) return null;

  const handleCopy = (manual: ManualDocument) => {
    navigator.clipboard.writeText(manual.contenido);
    setCopiedId(manual.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'arquitectura': return <Layers className="w-4 h-4 text-sky-400" />;
      case 'usuario': return <Users className="w-4 h-4 text-emerald-400" />;
      case 'operacion': return <ClipboardList className="w-4 h-4 text-amber-400" />;
      case 'codigo': return <Code2 className="w-4 h-4 text-purple-400" />;
      case 'instalacion': return <Download className="w-4 h-4 text-cyan-400" />;
      case 'base_datos': return <Database className="w-4 h-4 text-rose-400" />;
      case 'despliegue': return <Rocket className="w-4 h-4 text-orange-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Barra Superior del Modal */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Documentación y Manuales Oficiales
                </h2>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[10px] font-bold">
                  Formatos Word (.doc) y PDF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Descargue los 6 documentos de entrega del proyecto en formato Microsoft Word editable o listos para imprimir/guardar en PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botones Maestros de Descarga Completa */}
            <button
              onClick={() => downloadAllManualsAsWord(MANUALES_DEL_PROYECTO, tallerConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md shadow-blue-600/20"
              title="Descargar todos los 6 manuales en un solo archivo de Microsoft Word (.doc)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Descargar TODO en Word</span>
            </button>

            <button
              onClick={() => printAllManualsAsPdf(MANUALES_DEL_PROYECTO, tallerConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md shadow-emerald-600/20"
              title="Abrir compendio completo para imprimir o Guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Guardar TODO en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en manuales (ej. SQLite, Access, instalación, roles)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Vista previa:</span>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-0.5 flex">
              <button
                onClick={() => setViewMode('formateado')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  viewMode === 'formateado' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoja Formateada
              </button>
              <button
                onClick={() => setViewMode('fuente')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  viewMode === 'fuente' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Markdown Fuente
              </button>
            </div>
          </div>
        </div>

        {/* Cuerpo del Modal Dividido en 2 Columnas */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Columna Izquierda: Lista de los 6 Documentos */}
          <div className="md:col-span-5 bg-slate-950/60 p-3 sm:p-4 border-r border-slate-800 overflow-y-auto space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Documentos de Entrega ({filteredManuals.length})
            </span>

            {filteredManuals.map((m: ManualDocument, idx: number) => {
              const isSelected = activeManual.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                        {getIcon(m.categoria)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">
                          {idx + 1}. {m.titulo}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {m.subtitulo}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-blue-400 rotate-90' : 'text-slate-600'}`} />
                  </div>

                  {/* Acciones Rápidas directas en cada tarjeta */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <span className="text-[9.5pt] font-mono text-slate-500">
                      {m.nombreWord}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAsWordFile(m.nombreWord, m.titulo, m.subtitulo, m.contenido, tallerConfig);
                        }}
                        className="px-2 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Descargar este manual en Word (.doc)"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Word</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          printDocumentAsPdf(m.titulo, m.subtitulo, m.contenido, tallerConfig);
                        }}
                        className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                        title="Guardar o imprimir este manual como PDF"
                      >
                        <Printer className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Visor de Documento Activo */}
          <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between overflow-hidden bg-slate-900">
            {/* Encabezado del visor */}
            <div className="pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {activeManual.nombreWord}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {activeManual.titulo}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeManual.subtitulo}
                </p>
              </div>

              {/* Botones de Exportación Directa */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadAsWordFile(activeManual.nombreWord, activeManual.titulo, activeManual.subtitulo, activeManual.contenido, tallerConfig)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                  title="Descargar archivo .doc compatible con Microsoft Word"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Descargar Word (.doc)</span>
                </button>

                <button
                  onClick={() => printDocumentAsPdf(activeManual.titulo, activeManual.subtitulo, activeManual.contenido, tallerConfig)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                  title="Guardar como PDF o Imprimir"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Guardar en PDF</span>
                </button>

                <button
                  onClick={() => handleCopy(activeManual)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-700"
                  title="Copiar contenido"
                >
                  {copiedId === activeManual.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Contenido Visual del Documento */}
            <div className="flex-1 min-h-0 overflow-y-auto my-3 pr-2 scrollbar-thin">
              {viewMode === 'formateado' ? (
                <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-inner font-sans text-xs leading-relaxed max-w-3xl mx-auto selection:bg-blue-200">
                  <div className="border-b-2 border-sky-600 pb-3 mb-5">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                      MotoGestión FX v2.4.0 · Documento Oficial
                    </span>
                    <h1 className="text-xl font-bold text-slate-900 mt-1">
                      {activeManual.titulo}
                    </h1>
                    <p className="text-xs text-slate-600">
                      {activeManual.subtitulo}
                    </p>
                  </div>

                  <div 
                    className="prose prose-sm max-w-none text-slate-800"
                    dangerouslySetInnerHTML={{ 
                      __html: markdownToHtml(activeManual.contenido) 
                    }} 
                  />
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {activeManual.contenido}
                </div>
              )}
            </div>

            {/* Pie del visor */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Listo para abrir en Microsoft Word, Google Docs o exportar a PDF de alta resolución.</span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                6 de 6 Documentos Disponibles
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
