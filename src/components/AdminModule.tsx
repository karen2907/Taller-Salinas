import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Building2, 
  Image as ImageIcon, 
  Upload, 
  Sliders, 
  Layers, 
  Code2, 
  Database, 
  Server, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  DollarSign, 
  FileText, 
  Percent, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Crosshair, 
  HelpCircle,
  HardDrive,
  Cloud,
  CheckCircle2,
  Trash2,
  Plus,
  BookOpen,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Copy,
  Search,
  FileCode,
  FileDown,
  LogOut,
  ChevronRight,
  ExternalLink,
  Printer,
  Rocket
} from 'lucide-react';
import { TallerConfig, TerminalLAN, Repuesto, Proveedor, MovimientoKardex } from '../types/workshop';
import { JavaArchitectureExplorer } from './JavaArchitectureExplorer';
import { AutoUpdaterPipeline } from './AutoUpdaterPipeline';
import { MANUALES_DEL_PROYECTO, ManualDocument } from '../data/projectManuals';
import { 
  downloadAsWordFile, 
  downloadAllManualsAsWord, 
  printDocumentAsPdf, 
  printAllManualsAsPdf, 
  markdownToHtml 
} from '../utils/documentExport';

interface AdminModuleProps {
  tallerConfig: TallerConfig;
  onSaveConfig: (nuevaConfig: TallerConfig) => void;
  terminales: TerminalLAN[];
  setTerminales: React.Dispatch<React.SetStateAction<TerminalLAN[]>>;
  repuestos: Repuesto[];
  proveedores: Proveedor[];
  kardex: MovimientoKardex[];
  onResetFactoryData?: () => void;
  onLogoutAdmin?: () => void;
  currentAppVersion?: string;
  onApplyNewVersion?: (version: string, notes: string) => void;
  onOpenDocModal?: () => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  tallerConfig,
  onSaveConfig,
  terminales,
  setTerminales,
  repuestos,
  proveedores,
  kardex,
  onResetFactoryData,
  onLogoutAdmin,
  currentAppVersion = '1.0.0',
  onApplyNewVersion,
  onOpenDocModal
}) => {
  const [activeSection, setActiveSection] = useState<'compania' | 'diagrama' | 'modulos' | 'codigo_sql' | 'documentacion' | 'kpis' | 'autoupdate'>('compania');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showAdminPass, setShowAdminPass] = useState<boolean>(false);

  // Estados locales para documentación interactiva
  const [selectedManualId, setSelectedManualId] = useState<string>('doc_proyecto_general');
  const [searchManualText, setSearchManualText] = useState<string>('');
  const [copiedManualId, setCopiedManualId] = useState<string | null>(null);

  // Estados locales para la configuración de compañía y taller
  const [formConfig, setFormConfig] = useState<TallerConfig>({
    ...tallerConfig,
    adminPassword: tallerConfig.adminPassword || 'admin123',
    diagrama: tallerConfig.diagrama || {
      mostrarLineasGuia: true,
      modoSiluetaGlow: true,
      sensibilidadRadioClic: 15,
      autoDespliegueRepuestos: true,
      modeloPredeterminado: 'Kawasaki Ninja ZX-10RR Superbike 1000cc'
    },
    modulos: tallerConfig.modulos || {
      inventarioAlertaStockGlobal: 5,
      inventarioPermitirVentaSinStock: false,
      facturacionIvaPorcentaje: 19,
      facturacionPrefijo: 'FV-',
      cotizacionPrefijo: 'COT-',
      cotizacionDiasVigencia: 15,
      terminosCotizacion: 'Esta cotización tiene una vigencia de 15 días calendario. Precios sujetos a variación según disponibilidad de inventario.',
      pieFactura: '¡Gracias por confiar en nosotros! Garantía de repuestos originales: 90 días por defectos de fabricación.',
      dbMotorPredeterminado: 'sqlite'
    }
  });

  // Modal para agregar terminal
  const [newTerminalName, setNewTerminalName] = useState('');
  const [newTerminalIp, setNewTerminalIp] = useState('');
  const [newTerminalRol, setNewTerminalRol] = useState('MECANICO');

  const handleSave = () => {
    onSaveConfig(formConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormConfig(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTerminal = () => {
    if (!newTerminalName.trim() || !newTerminalIp.trim()) return;
    const newTerm: TerminalLAN = {
      id: `TERM-0${terminales.length + 1}`,
      nombre: newTerminalName,
      ip: newTerminalIp,
      rol: newTerminalRol,
      activa: true
    };
    setTerminales(prev => [...prev, newTerm]);
    setNewTerminalName('');
    setNewTerminalIp('');
  };

  const handleRemoveTerminal = (id: string) => {
    if (terminales.length <= 1) return;
    setTerminales(prev => prev.filter(t => t.id !== id));
  };

  // Descarga y copia de manuales
  const handleDownloadManual = (doc: ManualDocument) => {
    const blob = new Blob([doc.contenido], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyManual = (doc: ManualDocument) => {
    navigator.clipboard.writeText(doc.contenido);
    setCopiedManualId(doc.id);
    setTimeout(() => setCopiedManualId(null), 2000);
  };

  // Filtrado de manuales
  const filteredManuales = useMemo(() => {
    if (!searchManualText.trim()) return MANUALES_DEL_PROYECTO;
    const q = searchManualText.toLowerCase();
    return MANUALES_DEL_PROYECTO.filter(m => 
      m.titulo.toLowerCase().includes(q) ||
      m.descripcionCorta.toLowerCase().includes(q) ||
      m.contenido.toLowerCase().includes(q) ||
      m.nombreArchivo.toLowerCase().includes(q)
    );
  }, [searchManualText]);

  const activeManual = useMemo(() => {
    return MANUALES_DEL_PROYECTO.find(m => m.id === selectedManualId) || MANUALES_DEL_PROYECTO[0];
  }, [selectedManualId]);

  const [manualViewMode, setManualViewMode] = useState<'formateado' | 'fuente'>('formateado');

  // Métricas del Sistema
  const valorTotalInventario = repuestos.reduce((acc, r) => acc + (r.precioCosto * r.stockActual), 0);
  const valorVentaInventario = repuestos.reduce((acc, r) => acc + (r.precioVenta * r.stockActual), 0);
  const repuestosBajoStock = repuestos.filter(r => r.stockActual <= r.stockMinimo).length;

  return (
    <div className="space-y-4">
      {/* CABECERA DEL MÓDULO DE ADMINISTRADOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Módulo de Administrador (Autenticado)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Control Maestro y Configuraciones Globales
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Panel de Control y Personalización del Sistema
          </h2>
          <p className="text-xs text-slate-400">
            Configure la identidad de la compañía, logo oficial, diagrama HD, reglas de módulos, red LAN, documentación y código Java/SQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold font-mono">
              <Check className="w-4 h-4" />
              <span>¡Configuración Guardada!</span>
            </div>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Todos los Cambios</span>
          </button>

          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              title="Bloquear sesión de administrador"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800/80 rounded-lg text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Bloquear Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* MENÚ DE PESTAÑAS ADMINISTRATIVAS */}
      <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSection('compania')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'compania'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Compañía, Logo & Seguridad</span>
        </button>

        <button
          onClick={() => setActiveSection('diagrama')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'diagrama'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>Configuración Diagrama Moto HD</span>
        </button>

        <button
          onClick={() => setActiveSection('modulos')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'modulos'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Reglas de Módulos & Red LAN</span>
        </button>

        <button
          onClick={() => setActiveSection('documentacion')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'documentacion'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 border border-emerald-500/20'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Centro de Documentación & Manuales (6)</span>
        </button>

        <button
          onClick={() => setActiveSection('codigo_sql')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'codigo_sql'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Código Java, SQL & DB</span>
        </button>

        <button
          onClick={() => setActiveSection('kpis')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'kpis'
              ? 'bg-purple-500 text-slate-950 shadow-sm'
              : 'text-purple-400 hover:text-purple-300 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Métricas y Auditoría</span>
        </button>

        <button
          onClick={() => setActiveSection('autoupdate')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors ${
            activeSection === 'autoupdate'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 border border-indigo-500/30'
          }`}
        >
          <Rocket className="w-4 h-4 text-indigo-400" />
          <span>Despliegue .EXE & Auto-Updater (GitHub CI/CD)</span>
        </button>
      </div>

      {/* =========================================================================
          SECCIÓN 1: COMPAÑÍA, DATOS FISCALES, LOGO Y CONTRASEÑA DE ADMINISTRADOR
          ========================================================================= */}
      {activeSection === 'compania' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              Identidad Corporativa & Seguridad
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Datos de la Compañía, Logo Oficial y Contraseña Maestra
            </h3>
            <p className="text-xs text-slate-400">
              Estos datos se reflejan automáticamente en el encabezado, cotizaciones, facturas electrónicas y marca de agua del diagrama. Solo el Administrador puede modificarlos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Formulario de Datos */}
            <div className="lg:col-span-8 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Comercial de la Compañía / Taller:</label>
                  <input
                    type="text"
                    value={formConfig.nombre}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                    placeholder="Ej. MOTO RACING PRO SERVICE"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIT / Identificación Fiscal:</label>
                  <input
                    type="text"
                    value={formConfig.nit}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, nit: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="Ej. 900.548.120-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eslogan / Lema del Taller:</label>
                <input
                  type="text"
                  value={formConfig.slogan}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="Ej. Centro Técnico Especializado, Repuestos Multimarca..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfonos de Contacto:</label>
                  <input
                    type="text"
                    value={formConfig.telefono}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, telefono: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="+57 (601) 458-9200 / 312 450 8820"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={formConfig.correo}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, correo: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="contacto@mitaller.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dirección Física del Taller:</label>
                  <input
                    type="text"
                    value={formConfig.direccion}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, direccion: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="Av. Primero de Mayo # 28-40"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ciudad y País:</label>
                  <input
                    type="text"
                    value={formConfig.ciudad}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, ciudad: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="Bogotá D.C., Colombia"
                  />
                </div>
              </div>

              {/* TARJETA DE SEGURIDAD: CONTRASEÑA MAESTRA DE ADMINISTRADOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white font-mono uppercase tracking-wider text-xs">
                      Contraseña Maestra de Administrador
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    Seguridad Activa
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Esta contraseña protege el acceso a este módulo y a la configuración del logo e identidad del taller. Los mecánicos y cajeros no podrán ingresar sin conocerla.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative">
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      value={formConfig.adminPassword || 'admin123'}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, adminPassword: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                      placeholder="Nueva contraseña..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="p-1 text-slate-400 hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2"
                    >
                      {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Clave predeterminada: <code className="text-amber-400 font-mono">admin123</code>. Cámbiela aquí y presione <em>Guardar Todos los Cambios</em>.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formConfig.logoMarcaAgua}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, logoMarcaAgua: e.target.checked }))}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                  />
                  <span className="text-slate-300">Mostrar Logo como Marca de Agua de fondo en el Diagrama y Cotizaciones</span>
                </label>
              </div>
            </div>

            {/* Administrador de Logo */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase font-mono text-[11px] block mb-2">
                  Vista Previa del Logo Actual
                </span>
                <div className="w-full aspect-square rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-4 relative group">
                  {formConfig.logoUrl ? (
                    <img
                      src={formConfig.logoUrl}
                      alt="Logo del Taller"
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-slate-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                      <span>Sin Logo Asignado</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cargar Archivo de Imagen:</label>
                  <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer border border-slate-700 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Seleccionar desde PC (PNG / JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">O Pegar URL Directa de Imagen:</label>
                  <input
                    type="text"
                    value={formConfig.logoUrl}
                    onChange={(e) => setFormConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                    placeholder="https://..."
                  />
                </div>

                {formConfig.logoUrl && (
                  <button
                    onClick={() => setFormConfig(prev => ({ ...prev, logoUrl: '' }))}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Quitar logo actual</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 2: CONFIGURACIÓN DEL DIAGRAMA INTERACTIVO MOTO HD
          ========================================================================= */}
      {activeSection === 'diagrama' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              Sensibilidad & Visualización
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Parámetros del Diagrama Técnico de la Moto
            </h3>
            <p className="text-xs text-slate-400">
              Personalice la tolerancia de clic sobre la imagen, el brillo de siluetas y el comportamiento de filtrado automático.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <span>Interacción Visual y Guías</span>
              </h4>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.diagrama?.mostrarLineasGuia}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      diagrama: { ...prev.diagrama!, mostrarLineasGuia: e.target.checked }
                    }))}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block">Mostrar Líneas Guía y Dianas Pulsantes</span>
                    <span className="text-slate-400 text-[11px]">
                      Dibuja las líneas que conectan cada pieza física con su etiqueta técnica sobre la moto.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.diagrama?.modoSiluetaGlow}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      diagrama: { ...prev.diagrama!, modoSiluetaGlow: e.target.checked }
                    }))}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block">Efecto Glow Verde Lima al Pasar el Mouse</span>
                    <span className="text-slate-400 text-[11px]">
                      Ilumina el polígono de la pieza al pasar el cursor para confirmar la zona que se va a cliquear.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formConfig.diagrama?.autoDespliegueRepuestos}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      diagrama: { ...prev.diagrama!, autoDespliegueRepuestos: e.target.checked }
                    }))}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block">Despliegue Automático de Repuestos al Clic</span>
                    <span className="text-slate-400 text-[11px]">
                      Al hacer clic en cualquier parte de la moto, expande de inmediato la sección inferior con los repuestos compatibles.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Calibración de Clics y Modelo Base</span>
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300 font-semibold">Tolerancia de Proximidad de Clic:</label>
                    <span className="font-mono text-amber-400 font-bold">{formConfig.diagrama?.sensibilidadRadioClic}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    value={formConfig.diagrama?.sensibilidadRadioClic}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      diagrama: { ...prev.diagrama!, sensibilidadRadioClic: Number(e.target.value) }
                    }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Si el usuario hace clic fuera del polígono exacto, el sistema seleccionará la pieza más cercana dentro de este radio.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Modelo Visual Base de Motocicleta:</label>
                  <input
                    type="text"
                    value={formConfig.diagrama?.modeloPredeterminado}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      diagrama: { ...prev.diagrama!, modeloPredeterminado: e.target.value }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Esquema base fotográfico de referencia con 18 zonas de ingeniería.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 3: REGLAS DE MÓDULOS, FACTURACIÓN, COTIZACIONES Y RED LAN
          ========================================================================= */}
      {activeSection === 'modulos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              Reglas Comerciales & Red Local
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Parámetros de Facturación, Cotizaciones y Terminales LAN
            </h3>
            <p className="text-xs text-slate-400">
              Ajuste los porcentajes tributarios, prefijos consecutivos de comprobantes y las estaciones de trabajo de la red local.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Parámetros de Facturación y Cotización */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Facturación & Proformas Comerciales</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">IVA / Impuesto (%):</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formConfig.modulos?.facturacionIvaPorcentaje}
                      onChange={(e) => setFormConfig(prev => ({
                        ...prev,
                        modulos: { ...prev.modulos!, facturacionIvaPorcentaje: Number(e.target.value) }
                      }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <Percent className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vigencia Cotizaciones (Días):</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formConfig.modulos?.cotizacionDiasVigencia}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      modulos: { ...prev.modulos!, cotizacionDiasVigencia: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prefijo de Factura POS:</label>
                  <input
                    type="text"
                    value={formConfig.modulos?.facturacionPrefijo}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      modulos: { ...prev.modulos!, facturacionPrefijo: e.target.value }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prefijo de Cotización:</label>
                  <input
                    type="text"
                    value={formConfig.modulos?.cotizacionPrefijo}
                    onChange={(e) => setFormConfig(prev => ({
                      ...prev,
                      modulos: { ...prev.modulos!, cotizacionPrefijo: e.target.value }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Términos Legales al Pie de Cotización:</label>
                <textarea
                  rows={2}
                  value={formConfig.modulos?.terminosCotizacion}
                  onChange={(e) => setFormConfig(prev => ({
                    ...prev,
                    modulos: { ...prev.modulos!, terminosCotizacion: e.target.value }
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-amber-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mensaje de Garantía en Factura:</label>
                <textarea
                  rows={2}
                  value={formConfig.modulos?.pieFactura}
                  onChange={(e) => setFormConfig(prev => ({
                    ...prev,
                    modulos: { ...prev.modulos!, pieFactura: e.target.value }
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-amber-500 text-[11px]"
                />
              </div>
            </div>

            {/* Configuración de Terminales de Red LAN */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Estaciones de Trabajo en Red Local (LAN)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {terminales.length} Terminales Activas
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mb-3">
                  Permite identificar qué computadora realiza las cotizaciones, facturas y salidas de inventario en el taller.
                </p>

                {/* Lista de Terminales */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {terminales.map((term) => (
                    <div
                      key={term.id}
                      className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <div>
                          <div className="font-bold text-white text-xs">{term.nombre}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {term.id} · IP: <span className="text-amber-400">{term.ip}</span> · Rol: {term.rol}
                          </div>
                        </div>
                      </div>

                      {terminales.length > 1 && (
                        <button
                          onClick={() => handleRemoveTerminal(term.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Eliminar terminal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario para Añadir Terminal */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-slate-300 font-bold text-[11px] block">Añadir Nueva Terminal al Taller:</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre (ej. Caja 2)"
                    value={newTerminalName}
                    onChange={(e) => setNewTerminalName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="IP LAN (ej. 192.168.1.105)"
                    value={newTerminalIp}
                    onChange={(e) => setNewTerminalIp(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={newTerminalRol}
                    onChange={(e) => setNewTerminalRol(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="MECANICO">MECÁNICO</option>
                    <option value="MOSTRADOR">MOSTRADOR</option>
                    <option value="ALMACEN">ALMACÉN</option>
                    <option value="CAJA">CAJA</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddTerminal}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Terminal LAN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 4: CENTRO DE DOCUMENTACIÓN & MANUALES DEL PROYECTO (6 ENTREGABLES)
          ========================================================================= */}
      {activeSection === 'documentacion' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
          {/* Cabecera Principal con Botones de Descarga en Word y PDF */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Centro de Documentación Oficial & Manuales
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[10px] font-bold">
                  Formatos Word (.doc) y PDF Disponibles
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Biblioteca Técnica y Guías de Operación de MotoGestión FX
              </h3>
              <p className="text-xs text-slate-400">
                Los 6 manuales solicitados para la entrega del proyecto: Arquitectura, Manual de Usuario, Manual de Uso, Guía de Código, Instalación Local y Conexión a Bases de Datos.
              </p>
            </div>

            {/* Botones Maestros de Descarga de Todo el Paquete */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => downloadAllManualsAsWord(MANUALES_DEL_PROYECTO, formConfig)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-blue-600/20"
                title="Descargar todos los 6 manuales unificados en un solo documento de Microsoft Word (.doc)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Descargar TODO en Word</span>
              </button>

              <button
                type="button"
                onClick={() => printAllManualsAsPdf(MANUALES_DEL_PROYECTO, formConfig)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-emerald-600/20"
                title="Abrir compendio completo para imprimir o Guardar como PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Guardar TODO en PDF</span>
              </button>
            </div>
          </div>

          {/* Sub-barra: Buscador y Conmutador de Vista */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchManualText}
                onChange={(e) => setSearchManualText(e.target.value)}
                placeholder="Buscar por palabra clave (SQL, Access, instalación...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Modo de Vista:</span>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-0.5 flex">
                <button
                  type="button"
                  onClick={() => setManualViewMode('formateado')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    manualViewMode === 'formateado' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hoja Formateada (Word / PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setManualViewMode('fuente')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    manualViewMode === 'fuente' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Código Markdown (.md)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Columna Izquierda: Índice de Manuales (Lista Seleccionable) */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Documentos Disponibles ({filteredManuales.length} de {MANUALES_DEL_PROYECTO.length})
              </span>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {filteredManuales.map((manual) => {
                  const isSelected = selectedManualId === manual.id;
                  return (
                    <div
                      key={manual.id}
                      onClick={() => setSelectedManualId(manual.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-sm text-white flex items-center gap-1.5">
                          <FileCode className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                          {manual.titulo}
                        </span>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-blue-400' : 'text-slate-600'}`} />
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {manual.descripcionCorta}
                      </p>
                      
                      {/* Acciones de Descarga Directa en la tarjeta */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1.5 border-t border-slate-800/80">
                        <span className="text-amber-400 font-semibold">{manual.nombreWord}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadAsWordFile(manual.nombreWord, manual.titulo, manual.subtitulo, manual.contenido, formConfig);
                            }}
                            className="px-2 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Descargar este documento en formato Microsoft Word (.doc)"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Word</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              printDocumentAsPdf(manual.titulo, manual.subtitulo, manual.contenido, formConfig);
                            }}
                            className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Guardar o imprimir este documento como PDF"
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
            </div>

            {/* Columna Derecha: Visor de Documento Activo */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                {/* Barra de título del documento seleccionado */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Archivo Word: {activeManual.nombreWord}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {activeManual.titulo}
                    </h4>
                    <p className="text-xs text-slate-400">{activeManual.subtitulo}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => downloadAsWordFile(activeManual.nombreWord, activeManual.titulo, activeManual.subtitulo, activeManual.contenido, formConfig)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                      title="Descargar archivo .doc editable en Microsoft Word"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Descargar Word</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => printDocumentAsPdf(activeManual.titulo, activeManual.subtitulo, activeManual.contenido, formConfig)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                      title="Guardar como PDF o Imprimir"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Guardar en PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyManual(activeManual)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs transition-colors"
                      title="Copiar texto completo al portapapeles"
                    >
                      {copiedManualId === activeManual.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadManual(activeManual)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors"
                      title="Descargar archivo fuente Markdown (.md)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.md</span>
                    </button>
                  </div>
                </div>

                {/* Contenido Renderizado */}
                <div className="mt-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                  {manualViewMode === 'formateado' ? (
                    <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-inner font-sans text-xs leading-relaxed selection:bg-blue-200">
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
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                      {activeManual.contenido}
                    </div>
                  )}
                </div>
              </div>

              {/* Pie informativo de la documentación */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <span>Archivos oficiales almacenados en <code className="text-amber-400 font-mono">/docs/word/</code> y <code className="text-amber-400 font-mono">/docs/*.md</code>.</span>
                <span className="text-blue-400 font-semibold font-mono">Formatos: Microsoft Word (.doc) &bull; PDF &bull; Markdown (.md)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 5: CÓDIGO JAVA, SCRIPTS SQL Y BASES DE DATOS
          ========================================================================= */}
      {activeSection === 'codigo_sql' && (
        <div className="space-y-4">
          <JavaArchitectureExplorer />
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 6: MÉTRICAS Y AUDITORÍA DEL SISTEMA
          ========================================================================= */}
      {activeSection === 'kpis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
          <div>
            <span className="text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
              Salud Operacional & Auditoría
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Métricas Generales del Taller
            </h3>
            <p className="text-xs text-slate-400">
              Resumen en tiempo real del valor del inventario, márgenes comerciales y auditoría de transacciones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-slate-500 font-mono text-[10px] uppercase">Catálogo de Repuestos</div>
              <div className="text-2xl font-black text-white font-mono">{repuestos.length}</div>
              <div className="text-[11px] text-emerald-400 font-mono">
                {repuestos.filter(r => r.stockActual > 0).length} con stock disponible
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-slate-500 font-mono text-[10px] uppercase">Valor Inventario (Costo)</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ${valorTotalInventario.toLocaleString('es-CO')}
              </div>
              <div className="text-[11px] text-slate-400">Capital invertido en bodega</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-slate-500 font-mono text-[10px] uppercase">Valor Estimado en Venta</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                ${valorVentaInventario.toLocaleString('es-CO')}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                Margen proyectado: ${ (valorVentaInventario - valorTotalInventario).toLocaleString('es-CO') }
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-slate-500 font-mono text-[10px] uppercase">Movimientos en Kardex</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">{kardex.length}</div>
              <div className="text-[11px] text-slate-400">Auditorías registradas en tiempo real</div>
            </div>
          </div>

          {/* Restaurar valores de fábrica si es necesario */}
          {onResetFactoryData && (
            <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div>
                <strong className="text-red-400 block font-mono">Zona de Mantenimiento de Datos:</strong>
                <span className="text-slate-400">¿Desea restablecer todos los catálogos y parámetros a los valores iniciales de fábrica?</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('¿Está seguro de que desea reiniciar los datos a la configuración inicial?')) {
                    onResetFactoryData();
                  }
                }}
                className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 rounded-lg font-bold font-mono transition-colors"
              >
                Restablecer a Fábrica
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECCIÓN 7: DESPLIEGUE .EXE, CI/CD GITHUB RELEASES Y AUTO-ACTUALIZADOR
          ========================================================================= */}
      {activeSection === 'autoupdate' && (
        <AutoUpdaterPipeline
          currentAppVersion={currentAppVersion}
          onApplyNewVersion={onApplyNewVersion || (() => {})}
          onOpenDocModal={onOpenDocModal}
        />
      )}
    </div>
  );
};
