import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  GitBranch, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  HardDrive, 
  FolderGit2, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCode, 
  Zap, 
  Play, 
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  Monitor,
  Laptop
} from 'lucide-react';

interface AutoUpdaterPipelineProps {
  currentAppVersion: string;
  onApplyNewVersion: (newVersion: string, releaseNotes: string) => void;
  onOpenDocModal?: () => void;
}

interface SimulatedRelease {
  version: string;
  tag: string;
  title: string;
  date: string;
  sizeMb: number;
  hashSha512: string;
  features: string[];
  isSecurityHotfix: boolean;
}

const DISPONIBLES_EN_GITHUB: SimulatedRelease[] = [
  {
    version: '1.1.0',
    tag: 'v1.1.0',
    title: 'Actualización de Alto Rendimiento & 45 Nuevos Repuestos Deportivos',
    date: '28 Octubre 2026',
    sizeMb: 14.8,
    hashSha512: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855...',
    features: [
      'Nuevos repuestos de motor y pistones forjados para Kawasaki Ninja y Yamaha MT-09',
      'Optimización de carga del Diagrama HD de la motocicleta (renderizado 40% más rápido)',
      'Soporte para múltiples terminales en red LAN con reconexión automática HikariCP',
      'Exportación directa de facturas y cotizaciones en PDF'
    ],
    isSecurityHotfix: false
  },
  {
    version: '1.2.0',
    tag: 'v1.2.0',
    title: 'Módulo Fiscal Electrónico DIAN & Sincronización Nube Neon.tech',
    date: 'Noviembre 2026',
    sizeMb: 18.2,
    hashSha512: 'a6f9c8928374d619284719284719283748291029384756102938475610293847...',
    features: [
      'Integración con Facturación Electrónica DIAN / SAT con código QR y CUFE',
      'Sincronización multi-sucursal en la nube con PostgreSQL Serverless (Neon)',
      'Control de mecánicos por comisiones y horas de trabajo en bahía',
      'Alertas automáticas de mantenimiento por kilometraje a WhatsApp de clientes'
    ],
    isSecurityHotfix: false
  },
  {
    version: '1.0.1-HOTFIX',
    tag: 'v1.0.1',
    title: 'Parche Crítico de Seguridad en Bloqueo de Stock Concurrente',
    date: 'Octubre 2026',
    sizeMb: 4.2,
    hashSha512: '99bf72384a837264839201948572019384756102938475610293847561029384...',
    features: [
      'Bloqueo atómico SELECT FOR UPDATE en ventas simultáneas de mostrador y caja',
      'Corrección en cálculo de IVA redondeado a 2 decimales',
      'Actualización del driver JDBC a PostgreSQL 42.7.2'
    ],
    isSecurityHotfix: true
  }
];

export const AutoUpdaterPipeline: React.FC<AutoUpdaterPipelineProps> = ({
  currentAppVersion,
  onApplyNewVersion,
  onOpenDocModal
}) => {
  const [activeTab, setActiveTab] = useState<'simulador' | 'arquitectura' | 'github_actions' | 'electron_code' | 'archivos'>('simulador');
  const [selectedRelease, setSelectedRelease] = useState<SimulatedRelease>(DISPONIBLES_EN_GITHUB[0]);
  
  // Estados del ciclo de actualización interactiva
  const [updatePhase, setUpdatePhase] = useState<'idle' | 'checking' | 'found' | 'downloading' | 'verifying' | 'ready' | 'installing' | 'finished'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('3.8 MB/s');
  const [downloadedMb, setDownloadedMb] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Manejo de copia al portapapeles
  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Simulación del ciclo de actualización completo
  const handleStartUpdateSimulation = () => {
    setUpdatePhase('checking');
    setDownloadProgress(0);
    setDownloadedMb(0);

    // 1. Verificando en GitHub Releases
    setTimeout(() => {
      setUpdatePhase('found');

      // 2. Iniciando descarga
      setTimeout(() => {
        setUpdatePhase('downloading');
      }, 1200);
    }, 1500);
  };

  // Efecto para la barra de progreso de descarga animada
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (updatePhase === 'downloading') {
      interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUpdatePhase('verifying');
            // Verificando SHA-512
            setTimeout(() => {
              setUpdatePhase('ready');
            }, 1200);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 12) + 8;
          const currentMb = Number(((next / 100) * selectedRelease.sizeMb).toFixed(1));
          setDownloadedMb(Math.min(selectedRelease.sizeMb, currentMb));
          return Math.min(100, next);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [updatePhase, selectedRelease]);

  // Aplicar actualización (Reiniciar app)
  const handleApplyUpdate = () => {
    setUpdatePhase('installing');
    setTimeout(() => {
      onApplyNewVersion(selectedRelease.version, selectedRelease.features.join(' | '));
      setUpdatePhase('finished');
      setTimeout(() => {
        setUpdatePhase('idle');
      }, 2500);
    }, 1800);
  };

  // Reset del simulador
  const handleResetSimulation = () => {
    setUpdatePhase('idle');
    setDownloadProgress(0);
    setDownloadedMb(0);
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior Explicativo para Sustentación */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                Módulo CI/CD para Sustentación Académica
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Versión Local: v{currentAppVersion}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Despliegue de Ejecutables (.EXE) & Auto-Actualización Automática
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Demuestra al profesor cómo el código fuente se versiona en <strong>GitHub</strong>, cómo <strong>GitHub Actions</strong> compila el instalador <code className="text-indigo-300 bg-indigo-950/80 px-1 py-0.5 rounded text-xs">.exe</code> en la nube, y cómo las computadoras del taller <strong>se actualizan solas</strong> sin necesidad de reinstalar manualmente.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenDocModal && (
              <button
                onClick={onOpenDocModal}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center gap-2 shadow-sm"
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                Ver Manual 07 (.DOC / PDF)
              </button>
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <FolderGit2 className="w-4 h-4" />
              GitHub Releases
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-800/80 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'simulador'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-indigo-300" />
            1. Simulador en Vivo para el Profesor
          </button>

          <button
            onClick={() => setActiveTab('arquitectura')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'arquitectura'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            2. Diagrama de Arquitectura CI/CD
          </button>

          <button
            onClick={() => setActiveTab('github_actions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'github_actions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-300" />
            3. GitHub Actions (.yml)
          </button>

          <button
            onClick={() => setActiveTab('electron_code')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'electron_code'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-300" />
            4. Código Auto-Updater (.EXE / Java)
          </button>

          <button
            onClick={() => setActiveTab('archivos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'archivos'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            5. Descargar Archivos Listos
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: SIMULADOR EN VIVO */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel Izquierdo: Selección del Release de GitHub */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-indigo-400" />
                  Paso 1: Seleccionar Versión a Lanzar en GitHub
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Repo: motogestion-fx
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Elige qué versión simularás que el desarrollador publicó en <strong>GitHub Releases</strong> con una etiqueta <code className="text-amber-300 font-mono">git tag</code>:
              </p>

              <div className="space-y-2.5">
                {DISPONIBLES_EN_GITHUB.map(rel => {
                  const isSelected = selectedRelease.version === rel.version;
                  const isAlreadyInstalled = rel.version === currentAppVersion;
                  return (
                    <div
                      key={rel.version}
                      onClick={() => {
                        if (updatePhase === 'idle') {
                          setSelectedRelease(rel);
                        }
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/40' 
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                      } ${updatePhase !== 'idle' ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                            rel.isSecurityHotfix 
                              ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}>
                            {rel.tag}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {rel.title}
                          </span>
                        </div>
                        {isAlreadyInstalled && (
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 shrink-0">
                            Instalada
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 line-clamp-2">
                        {rel.features[0]}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                        <span>Peso .EXE: {rel.sizeMb} MB</span>
                        <span>{rel.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón de Lanzamiento de Orden */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={handleStartUpdateSimulation}
                  disabled={updatePhase !== 'idle'}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    updatePhase === 'idle'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Simular "git push" y Publicar en GitHub Releases
                </button>

                {updatePhase !== 'idle' && (
                  <button
                    onClick={handleResetSimulation}
                    className="w-full py-2 px-3 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reiniciar Simulador
                  </button>
                )}
              </div>
            </div>

            {/* Info de Seguridad Criptográfica */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                Seguridad Criptográfica SHA-512
              </div>
              <p className="text-slate-400 text-[11px]">
                El instalador de Windows nunca ejecuta una actualización sin comprobar la firma hash generada en GitHub:
              </p>
              <div className="font-mono text-[10px] bg-slate-950 p-2 rounded-lg text-slate-400 break-all border border-slate-800">
                {selectedRelease.hashSha512}
              </div>
            </div>
          </div>

          {/* Panel Derecho: Monitor de la Terminal Cliente (El PC del Cajero/Taller) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Pantalla del PC del Taller / Estación Cliente
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Simulación en tiempo real del proceso que ve el cajero en Windows
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                    Proceso: MotoGestion.exe
                  </span>
                </div>
              </div>

              {/* Consola Interactiva del Proceso */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3 min-h-[300px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-slate-500 text-[11px] flex items-center justify-between border-b border-slate-900 pb-1">
                    <span>[TERMINAL: TERM-01 (Caja & Mostrador)]</span>
                    <span>SO: Windows 11 x64</span>
                  </div>

                  <div className="text-slate-300">
                    <span className="text-emerald-400 font-bold">✔</span> Sistema MotoGestión FX ejecutándose en versión: <span className="text-indigo-300 font-bold">v{currentAppVersion}</span>
                  </div>

                  {updatePhase === 'idle' && (
                    <div className="text-slate-400 italic text-[11px] pt-4">
                      Esperando orden de actualización o temporizador periódico de GitHub Releases...
                      <br />
                      <span className="text-slate-500">Presiona el botón de la izquierda para simular el envío de una nueva versión.</span>
                    </div>
                  )}

                  {updatePhase === 'checking' && (
                    <div className="text-sky-300 animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      [autoUpdater] Consultando https://api.github.com/repos/usuario/motogestion-fx/releases/latest...
                    </div>
                  )}

                  {(updatePhase === 'found' || updatePhase === 'downloading' || updatePhase === 'verifying' || updatePhase === 'ready' || updatePhase === 'installing' || updatePhase === 'finished') && (
                    <div className="text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      [autoUpdater] ¡Nueva versión detectada! Remota: <strong className="text-white">{selectedRelease.tag}</strong> {'>'} Local: <strong>v{currentAppVersion}</strong>
                    </div>
                  )}

                  {(updatePhase === 'downloading' || updatePhase === 'verifying' || updatePhase === 'ready' || updatePhase === 'installing' || updatePhase === 'finished') && (
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="flex items-center gap-1.5 text-indigo-300">
                          <Download className="w-3.5 h-3.5 animate-bounce" />
                          Descargando paquete diferencial ({downloadedMb} MB / {selectedRelease.sizeMb} MB)
                        </span>
                        <span className="text-slate-400">{downloadSpeed} • {downloadProgress}%</span>
                      </div>

                      {/* Barra de Progreso */}
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {(updatePhase === 'verifying' || updatePhase === 'ready' || updatePhase === 'installing' || updatePhase === 'finished') && (
                    <div className="text-amber-300 flex items-center gap-2 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      [autoUpdater] Verificando suma criptográfica SHA-512... <span className="text-emerald-400 font-bold">¡HASH VÁLIDO!</span>
                    </div>
                  )}

                  {updatePhase === 'ready' && (
                    <div className="bg-indigo-950/60 border border-indigo-500/50 rounded-xl p-3 text-white space-y-2 mt-2 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          ¡Actualización descargada y lista para instalar!
                        </span>
                        <span className="text-[10px] font-mono bg-indigo-900 px-2 py-0.5 rounded text-indigo-200">
                          {selectedRelease.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">
                        La actualización se aplicará al reiniciar. La base de datos y clientes se conservan al 100%.
                      </p>
                    </div>
                  )}

                  {updatePhase === 'installing' && (
                    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-center space-y-2 mt-2">
                      <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                      <div className="text-xs font-bold text-white">Reemplazando binarios de Windows (Inno Setup / NSIS)...</div>
                      <div className="text-[11px] text-slate-400">Reiniciando MotoGestión FX en 2 segundos...</div>
                    </div>
                  )}

                  {updatePhase === 'finished' && (
                    <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-4 text-center space-y-2 mt-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-white">¡Actualización Exitosa a la versión {selectedRelease.tag}!</div>
                      <div className="text-[11px] text-slate-300">Todos los repuestos, ventas y configuraciones permanecen intactos.</div>
                    </div>
                  )}
                </div>

                {/* Acciones en la Terminal Cliente */}
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500">
                    Motor: <span className="text-slate-400">electron-updater 6.1.7</span>
                  </div>

                  {updatePhase === 'ready' && (
                    <button
                      onClick={handleApplyUpdate}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5 animate-pulse"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Reiniciar e Instalar Ahora
                    </button>
                  )}
                </div>
              </div>

              {/* Novedades del Release */}
              <div className="mt-4 bg-slate-800/40 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Registro de Cambios (Changelog de la versión {selectedRelease.tag}):
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedRelease.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: DIAGRAMA DE ARQUITECTURA */}
      {activeTab === 'arquitectura' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Arquitectura del Pipeline de Entrega Continua (CI/CD)
            </h3>
            <p className="text-xs text-slate-400">
              Esta es la explicación formal del flujo que puedes presentar en la diapositiva o sustentación ante el docente:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Paso 1 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Desarrollo & GitHub</h4>
              <p className="text-xs text-slate-300">
                El programador modifica el código (nuevos repuestos, cambio de IVA o correcciones) y crea una etiqueta de versión:
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800">
                git tag v1.1.0<br/>
                git push origin --tags
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-500/30">
                2
              </div>
              <h4 className="text-sm font-bold text-white">GitHub Actions (CI/CD)</h4>
              <p className="text-xs text-slate-300">
                Un servidor virtual en la nube de GitHub (Windows Runner) se enciende automáticamente, compila la app y genera el instalador:
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-sky-300 border border-slate-800">
                MotoGestion-Setup-1.1.0.exe<br/>
                latest.yml (Hash SHA-512)
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm border border-purple-500/30">
                3
              </div>
              <h4 className="text-sm font-bold text-white">GitHub Releases</h4>
              <p className="text-xs text-slate-300">
                Actúa como el repositorio seguro de distribución global gratuito (CDN). Almacena los binarios y el registro de cambios (Changelog).
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-purple-300 border border-slate-800">
                API pública HTTPS<br/>
                /releases/latest
              </div>
            </div>

            {/* Paso 4 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                4
              </div>
              <h4 className="text-sm font-bold text-white">Equipos del Taller</h4>
              <p className="text-xs text-slate-300">
                El ejecutable instalado en cada PC consulta periódicamente la API, descarga en segundo plano y se auto-actualiza con 1 clic.
              </p>
              <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-emerald-300 border border-slate-800">
                autoUpdater.checkForUpdates()<br/>
                quitAndInstall()
              </div>
            </div>
          </div>

          {/* Tabla comparativa para responder al profesor */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Pregunta Frecuente del Profesor: "¿Por qué los datos no se borran al actualizar?"
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Directorio de Ejecutables (Se actualiza):</span>
                <code className="text-slate-300 font-mono text-[11px] bg-slate-950 p-1 rounded block mb-2">
                  C:\Users\Usuario\AppData\Local\Programs\MotoGestion\
                </code>
                <p className="text-slate-400 text-[11px]">
                  Contiene los archivos <code className="text-slate-300 font-mono">.exe</code>, librerías gráficas y código compilado. Solo esta carpeta se reemplaza con la nueva versión.
                </p>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Directorio de Datos & Configuración (Se protege):</span>
                <code className="text-slate-300 font-mono text-[11px] bg-slate-950 p-1 rounded block mb-2">
                  C:\Users\Usuario\AppData\Roaming\MotoGestion\ o Base de Datos Nube
                </code>
                <p className="text-slate-400 text-[11px]">
                  Contiene las ventas del día, el archivo SQLite o la cadena de conexión a Neon/Supabase, el logo del taller y las contraseñas. <strong>Nunca se toca ni se borra.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: ARCHIVO GITHUB ACTIONS */}
      {activeTab === 'github_actions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                Flujo de Integración Continua: .github/workflows/build-and-release.yml
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Copia este archivo en tu repositorio de GitHub para que compile el instalador automáticamente.
              </p>
            </div>
            <button
              onClick={() => handleCopy('workflow', GITHUB_WORKFLOW_YML)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              {copiedKey === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'workflow' ? '¡Copiado!' : 'Copiar YAML'}
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed">
            {GITHUB_WORKFLOW_YML}
          </pre>
        </div>
      )}

      {/* PESTAÑA 4: CÓDIGO AUTO-UPDATER */}
      {activeTab === 'electron_code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                Código de Escucha de Eventos en Windows (electron/main.js)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestiona la búsqueda periódica, descarga en segundo plano y el evento quitAndInstall()
              </p>
            </div>
            <button
              onClick={() => handleCopy('electron_code', ELECTRON_AUTOUPDATER_JS)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              {copiedKey === 'electron_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'electron_code' ? '¡Copiado!' : 'Copiar JS'}
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
            {ELECTRON_AUTOUPDATER_JS}
          </pre>
        </div>
      )}

      {/* PESTAÑA 5: DESCARGAR ARCHIVOS LISTOS */}
      {activeTab === 'archivos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              Paquete de Archivos de Configuración para tu Proyecto
            </h3>
            <p className="text-xs text-slate-400">
              Descarga o copia los archivos que necesitas agregar en tu proyecto para activar la auto-actualización en tu computador:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <FileCode className="w-4 h-4" />
                1. .github/workflows/release.yml
              </div>
              <p className="text-[11px] text-slate-400">
                Compilador en la nube para GitHub Actions cuando hagas un tag de versión.
              </p>
              <button
                onClick={() => downloadTextFile('build-and-release.yml', GITHUB_WORKFLOW_YML)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar .yml
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <FileCode className="w-4 h-4" />
                2. electron-builder.yml
              </div>
              <p className="text-[11px] text-slate-400">
                Configuración del instalador .exe de Windows y conexión a tu repositorio GitHub.
              </p>
              <button
                onClick={() => downloadTextFile('electron-builder.yml', ELECTRON_BUILDER_YML)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar builder.yml
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <FileCode className="w-4 h-4" />
                3. electron/main.js
              </div>
              <p className="text-[11px] text-slate-400">
                Manejador de eventos de actualización en segundo plano con autoUpdater.
              </p>
              <button
                onClick={() => downloadTextFile('main-autoupdate.js', ELECTRON_AUTOUPDATER_JS)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar main.js
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Función auxiliar para descargar archivos generados
function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Códigos predefinidos
const GITHUB_WORKFLOW_YML = `# Archivo: .github/workflows/build-and-release.yml
# Automatización CI/CD para compilar MotoGestión FX y publicar instalador .EXE

name: Compilar y Publicar MotoGestión FX en Windows

on:
  push:
    tags:
      - 'v*' # Se ejecuta al hacer git push con etiquetas v1.0.1, v1.1.0, etc.

jobs:
  build-windows:
    runs-on: windows-latest

    steps:
      - name: 1. Descargar Código Fuente del Repositorio
        uses: actions/checkout@v4

      - name: 2. Configurar Entorno Node.js 20 LTS
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: 3. Instalar Dependencias del Proyecto
        run: npm ci

      - name: 4. Compilar Frontend de la Aplicación
        run: npm run build

      - name: 5. Compilar Instalador .EXE y Publicar en GitHub Releases
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: npx electron-builder --win --publish always
`;

const ELECTRON_BUILDER_YML = `# Archivo: electron-builder.yml
appId: com.mototaller.motogestion
productName: MotoGestion FX
copyright: "Copyright © 2026 MotoGestión Taller"

directories:
  output: dist-electron

# Publicador oficial en GitHub Releases
publish:
  provider: github
  owner: TU_USUARIO_GITHUB
  repo: motogestion-app
  releaseType: release

win:
  target:
    - target: nsis
      arch:
        - x64
  icon: public/favicon.ico

nsis:
  oneClick: true
  perMachine: false
  allowToChangeInstallationDirectory: false
  deleteAppDataOnUninstall: false
`;

const ELECTRON_AUTOUPDATER_JS = `// Archivo: electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// Configuración del actualizador
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'MotoGestión FX - Sistema de Taller',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  // Verificar actualizaciones al iniciar en producción
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
}

// Eventos enviados a la interfaz de usuario (React)
autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('updater-event', { status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('updater-event', { status: 'available', version: info.version });
});

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('updater-progress', {
    percent: Math.round(progressObj.percent),
    bytesPerSecond: progressObj.bytesPerSecond
  });
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('updater-event', { status: 'downloaded', version: info.version });
});

// Orden de instalación solicitada por el usuario
ipcMain.on('aplicar-actualizacion', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);
`;
