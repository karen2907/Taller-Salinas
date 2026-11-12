import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Download, 
  Upload, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Layers, 
  X, 
  Plus, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MotoManual } from '../types/workshop';

interface MotorcycleManualsManagerProps {
  manuales: MotoManual[];
  onAddManual: (manual: MotoManual) => void;
  onDeleteManual: (id: string) => void;
  isAdmin: boolean;
  onOpenAdminAuth?: () => void;
}

export const MotorcycleManualsManager: React.FC<MotorcycleManualsManagerProps> = ({
  manuales,
  onAddManual,
  onDeleteManual,
  isAdmin,
  onOpenAdminAuth
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('TODAS');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [selectedManualPreview, setSelectedManualPreview] = useState<MotoManual | null>(null);

  // Modal para subir nuevo manual PDF (exclusivo admin)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formTitulo, setFormTitulo] = useState('');
  const [formMarca, setFormMarca] = useState('Yamaha');
  const [formModelo, setFormModelo] = useState('');
  const [formCilindraje, setFormCilindraje] = useState('150cc');
  const [formAno, setFormAno] = useState('2024');
  const [formCategoria, setFormCategoria] = useState<MotoManual['categoria']>('Taller / Despiece');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formFileSizeMb, setFormFileSizeMb] = useState(2.4);
  const [formPdfUrl, setFormPdfUrl] = useState('');

  // Filtrado reactivo
  const manualesFiltrados = useMemo(() => {
    return manuales.filter(m => {
      const matchSearch = 
        m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMarca = filtroMarca === 'TODAS' || m.marca === filtroMarca;
      const matchCat = filtroCategoria === 'TODAS' || m.categoria === filtroCategoria;

      return matchSearch && matchMarca && matchCat;
    });
  }, [manuales, searchTerm, filtroMarca, filtroCategoria]);

  const marcasDisponibles = useMemo(() => {
    return Array.from(new Set(manuales.map(m => m.marca)));
  }, [manuales]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFileName(file.name);
      setFormFileSizeMb(Number((file.size / (1024 * 1024)).toFixed(1)) || 1.5);
      if (!formTitulo) {
        setFormTitulo(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPdfUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formModelo.trim()) return;

    const nuevoManual: MotoManual = {
      id: `man_${Date.now()}`,
      titulo: formTitulo.trim(),
      marca: formMarca,
      modelo: formModelo.trim(),
      cilindraje: formCilindraje.trim(),
      ano: formAno.trim(),
      categoria: formCategoria,
      tamanoMb: formFileSizeMb,
      fechaSubida: new Date().toISOString().slice(0, 10),
      pdfUrl: formPdfUrl || undefined,
      descripcion: formDescripcion.trim() || `Manual técnico oficial de ${formMarca} ${formModelo} para mantenimiento de taller.`
    };

    onAddManual(nuevoManual);
    setShowUploadModal(false);
    // Limpiar form
    setFormTitulo('');
    setFormModelo('');
    setFormDescripcion('');
    setFormFileName('');
    setFormPdfUrl('');
  };

  return (
    <div className="space-y-4">
      {/* CABECERA DEL MÓDULO */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Biblioteca Técnica de Motocicletas
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
              {manuales.length} Manuales Disponibles
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Manuales de Taller, Despiece y Diagramas Eléctricos en PDF
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Consulte y descargue guías técnicas oficiales de fabricantes para calibración de válvulas, torques de apriete, diagramas de inyección electrónica y despiece completo.
          </p>
        </div>

        <div>
          {isAdmin ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>+ Subir Manual PDF (Dueño / Admin)</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-all"
              title="Iniciar sesión de administrador para cargar manuales PDF"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Subir Manuales (Requiere Rol Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTRADO */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por Marca, Modelo de Moto (ej. Pulsar NS200, Ninja, FZ, Gixxer) o Tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-slate-400 text-[11px]">Marca:</span>
            <select
              value={filtroMarca}
              onChange={(e) => setFiltroMarca(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none"
            >
              <option value="TODAS" className="bg-slate-900 text-white">Todas las Marcas</option>
              {marcasDisponibles.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-slate-400 text-[11px]">Tipo de Manual:</span>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none"
            >
              <option value="TODAS" className="bg-slate-900 text-white">Todas las Categorías</option>
              <option value="Taller / Despiece" className="bg-slate-900 text-white">Taller / Despiece</option>
              <option value="Diagrama Eléctrico" className="bg-slate-900 text-white">Diagrama Eléctrico</option>
              <option value="Inyección Electrónica" className="bg-slate-900 text-white">Inyección Electrónica</option>
              <option value="Manual de Usuario" className="bg-slate-900 text-white">Manual de Usuario</option>
            </select>
          </div>

          {(searchTerm || filtroMarca !== 'TODAS' || filtroCategoria !== 'TODAS') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroMarca('TODAS');
                setFiltroCategoria('TODAS');
              }}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* LISTADO TIPO TARJETAS DE MANUALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {manualesFiltrados.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-slate-400 font-semibold">No se encontraron manuales con ese filtro.</p>
            <p className="text-xs text-slate-500 mt-1">Intenta con otra marca o modelo.</p>
          </div>
        ) : (
          manualesFiltrados.map((man) => (
            <div 
              key={man.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-3 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {man.marca}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {man.cilindraje}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950/70 text-sky-300 border border-sky-800/60 font-semibold">
                      {man.categoria}
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el manual "${man.titulo}"?`)) {
                          onDeleteManual(man.id);
                        }
                      }}
                      title="Eliminar Manual (Admin)"
                      className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {man.titulo}
                </h3>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Modelo: <strong className="text-slate-200">{man.modelo}</strong> ({man.ano})
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                  {man.descripcion}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-500 font-mono">
                  PDF · {man.tamanoMb} MB
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedManualPreview(man)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ver Ficha</span>
                  </button>

                  <button
                    onClick={() => {
                      if (man.pdfUrl) {
                        const link = document.createElement('a');
                        link.href = man.pdfUrl;
                        link.download = `${man.titulo}.pdf`;
                        link.click();
                      } else {
                        alert(`Descargando manual técnico oficial de ${man.marca} ${man.modelo} (${man.tamanoMb} MB)...`);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL PARA SUBIR NUEVO MANUAL (ADMINISTRADOR) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form 
            onSubmit={handleCreateManual}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Subir Nuevo Manual Técnico de Motocicleta (PDF)
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowUploadModal(false)} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Título del Manual *:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Manual de Taller y Despiece Kawasaki Ninja ZX-10R 2024"
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Marca de Moto *:</label>
                  <select 
                    value={formMarca}
                    onChange={(e) => setFormMarca(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Yamaha">Yamaha</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Bajaj">Bajaj</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Honda">Honda</option>
                    <option value="KTM">KTM</option>
                    <option value="AKT">AKT</option>
                    <option value="TVS">TVS</option>
                    <option value="Hero">Hero</option>
                    <option value="Universal">Multimarca / Universal</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Modelo Específico *:</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Pulsar NS200 / FZ 2.0"
                    value={formModelo}
                    onChange={(e) => setFormModelo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Cilindraje:</label>
                  <input 
                    type="text"
                    placeholder="Ej. 200cc / 1000cc"
                    value={formCilindraje}
                    onChange={(e) => setFormCilindraje(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Año / Generación:</label>
                  <input 
                    type="text"
                    placeholder="Ej. 2020 - 2025"
                    value={formAno}
                    onChange={(e) => setFormAno(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Categoría:</label>
                  <select 
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value as MotoManual['categoria'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Taller / Despiece">Taller / Despiece</option>
                    <option value="Diagrama Eléctrico">Diagrama Eléctrico</option>
                    <option value="Inyección Electrónica">Inyección Electrónica</option>
                    <option value="Manual de Usuario">Manual de Usuario</option>
                  </select>
                </div>
              </div>

              {/* Carga de Archivo PDF */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Archivo PDF del Manual:</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer bg-slate-950 transition-colors relative">
                  <input 
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <div className="text-xs text-white font-semibold">
                    {formFileName ? (
                      <span className="text-emerald-400">Archivo cargado: {formFileName} ({formFileSizeMb} MB)</span>
                    ) : (
                      <span>Haga clic para seleccionar el PDF desde su computador</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Formatos admitidos: .PDF de taller, diagramas o escaneos</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Descripción / Notas Técnicas:</label>
                <textarea 
                  rows={2}
                  placeholder="Ej. Contiene torques de culata (45 Nm), holgura de válvulas y esquema de inyección Keihin..."
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
              >
                Guardar y Publicar Manual
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL PREVIEW DE FICHA TÉCNICA */}
      {selectedManualPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Ficha del Manual Técnico</h3>
              </div>
              <button onClick={() => setSelectedManualPreview(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h2 className="text-base font-bold text-white">{selectedManualPreview.titulo}</h2>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold">{selectedManualPreview.marca}</span> · 
                  <span>{selectedManualPreview.modelo}</span> · 
                  <span>{selectedManualPreview.cilindraje}</span> · 
                  <span>Año: {selectedManualPreview.ano}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Contenido Técnico Incluido:</div>
                <p className="text-slate-300 leading-relaxed">{selectedManualPreview.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-400">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                  Categoría: <strong className="text-sky-300 block">{selectedManualPreview.categoria}</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                  Tamaño de archivo: <strong className="text-slate-200 block">{selectedManualPreview.tamanoMb} MB (Formato PDF)</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedManualPreview(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  if (selectedManualPreview.pdfUrl) {
                    const link = document.createElement('a');
                    link.href = selectedManualPreview.pdfUrl;
                    link.download = `${selectedManualPreview.titulo}.pdf`;
                    link.click();
                  } else {
                    alert(`Descargando manual técnico oficial de ${selectedManualPreview.marca} ${selectedManualPreview.modelo}...`);
                  }
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Manual PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
