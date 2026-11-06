import React, { useState } from 'react';
import { Settings, Image as ImageIcon, Upload, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { TallerConfig } from '../types/workshop';

interface WorkshopBrandingModalProps {
  config: TallerConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevaConfig: TallerConfig) => void;
}

export const WorkshopBrandingModal: React.FC<WorkshopBrandingModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<TallerConfig>(config);

  if (!isOpen) return null;

  // Emblemas predeterminados de alta resolución para talleres
  const PRESET_LOGOS = [
    {
      nombre: 'Pistón & Llaves Racing (Superbike)',
      url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80'
    },
    {
      nombre: 'Taller Naked / Mecánica Pro',
      url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=300&auto=format&fit=crop&q=80'
    },
    {
      nombre: 'Custom Garage & Cafe Racer',
      url: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=300&auto=format&fit=crop&q=80'
    },
    {
      nombre: 'Centro Técnico y Diagnóstico',
      url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=300&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <form 
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden my-6 text-slate-200 text-xs"
      >
        {/* Cabecera */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Settings className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">Personalizar Marca & Logo del Taller</h3>
              <p className="text-[11px] text-slate-400">Configure la identidad visual, marcas de agua y membretes de cotización/facturación.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Vista previa del Logo Actual */}
          <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo Taller" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm truncate">{formData.nombre || 'Mi Taller de Motos'}</div>
              <div className="text-[11px] text-amber-400 truncate">{formData.slogan}</div>
              <div className="text-[10px] text-slate-500 mt-1">Este logo se reflejará en la cabecera, fondo de la moto y documentos oficiales.</div>
            </div>
          </div>

          {/* Opciones de carga de logo */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 block">Subir Logo Propio (PNG, SVG, JPG):</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition-colors font-medium">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Seleccionar imagen del equipo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <span className="text-[11px] text-slate-500">o ingrese una URL directa:</span>
            </div>
            <input
              type="text"
              placeholder="https://ejemplo.com/mi-logo.png"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Emblemas de muestra sugeridos */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">O escoja un emblema sugerido:</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_LOGOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, logoUrl: p.url })}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                    formData.logoUrl === p.url
                      ? 'bg-amber-950/40 border-amber-500 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img src={p.url} alt={p.nombre} className="w-8 h-8 rounded object-cover shrink-0" />
                  <span className="text-[11px] truncate">{p.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Opción de marca de agua en fondo del diagrama */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="font-semibold text-white">Marca de agua en el diagrama interactivo</div>
              <div className="text-[10px] text-slate-400">Muestra el escudo del taller con transparencia elegante en el fondo de la motocicleta.</div>
            </div>
            <input
              type="checkbox"
              checked={formData.logoMarcaAgua}
              onChange={(e) => setFormData({ ...formData, logoMarcaAgua: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Campos de texto del taller */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Nombre Comercial del Taller:</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Lema / Slogan del Taller:</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">NIT / Razón Social:</label>
                <input
                  type="text"
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Teléfonos de Contacto:</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Dirección del Taller:</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ciudad / Municipio:</label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
          >
            Guardar Configuración de Marca
          </button>
        </div>
      </form>
    </div>
  );
};
