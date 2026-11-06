import React from 'react';
import { 
  Wrench, 
  Layers, 
  ClipboardList, 
  Truck, 
  ShoppingCart, 
  AlertTriangle, 
  Server, 
  Radio, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  HelpCircle,
  LogOut,
  FileText,
  Rocket
} from 'lucide-react';
import { TerminalLAN, TallerConfig } from '../types/workshop';

export type NavTab = 'explorador' | 'inventario' | 'kardex' | 'proveedores' | 'admin' | 'arquitectura';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  cartCount: number;
  lowStockCount: number;
  terminales: TerminalLAN[];
  terminalActual: string;
  setTerminalActual: (id: string) => void;
  onOpenCartMobile: () => void;
  tallerConfig: TallerConfig;
  isAdminAuthenticated: boolean;
  onOpenAdminAuth: () => void;
  onLogoutAdmin: () => void;
  onOpenTerminalInfoModal: () => void;
  onOpenDocumentationModal?: () => void;
  currentAppVersion?: string;
  onOpenAutoUpdater?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  lowStockCount,
  terminales,
  terminalActual,
  setTerminalActual,
  onOpenCartMobile,
  tallerConfig,
  isAdminAuthenticated,
  onOpenAdminAuth,
  onLogoutAdmin,
  onOpenTerminalInfoModal,
  onOpenDocumentationModal,
  currentAppVersion = '1.0.0',
  onOpenAutoUpdater
}) => {
  const handleAdminTabClick = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      onOpenAdminAuth();
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none shadow-md">
      {/* Barra superior de estado de Red LAN */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span className="font-semibold">LAN ACTIVA:</span>
            <span className="text-slate-300">jdbc:postgresql://192.168.1.100:5432/mototaller_db</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-slate-300">
            <Server className="w-3 h-3 text-cyan-400" />
            <span>Pool HikariCP:</span>
            <span className="text-cyan-300 font-mono">15/15 Conexiones</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de Terminal de Trabajo con botón de ayuda para qué sirve */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden sm:inline">Terminal:</span>
            <select 
              value={terminalActual}
              onChange={(e) => setTerminalActual(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
            >
              {terminales.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.nombre} ({term.ip}) - {term.rol}
                </option>
              ))}
            </select>

            <button
              onClick={onOpenTerminalInfoModal}
              title="¿Para qué se usa el Terminal de Trabajo en red local?"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[10px] text-slate-400">¿Para qué sirve?</span>
            </button>

            {/* Acceso rápido a Manuales y Documentos (Word / PDF) */}
            {onOpenDocumentationModal && (
              <button
                onClick={onOpenDocumentationModal}
                title="Descargar o Ver Documentación y Manuales en Word (.doc) o PDF"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/70 hover:bg-blue-900 border border-blue-700/60 text-blue-300 text-xs transition-colors font-medium shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Manuales (Word / PDF)</span>
              </button>
            )}

            {/* Acceso directo al Centro de Actualización & Despliegue CI/CD para el Profesor */}
            {onOpenAutoUpdater && (
              <button
                onClick={onOpenAutoUpdater}
                title="Demostración de Auto-Update CI/CD (.EXE / GitHub Releases)"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 text-xs transition-colors font-medium shadow-sm"
              >
                <Rocket className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="font-mono font-bold text-[11px] text-white">v{currentAppVersion}</span>
                <span className="hidden md:inline text-[10px] text-indigo-300">Auto-Update</span>
              </button>
            )}
          </div>

          {lowStockCount > 0 && (
            <button 
              onClick={() => setActiveTab('inventario')}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded text-xs transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{lowStockCount} Bajo Stock</span>
            </button>
          )}

          {/* Estado de Seguridad del Administrador */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-[11px] font-bold hidden sm:inline">Admin Activo</span>
              <button
                onClick={onLogoutAdmin}
                title="Bloquear sesión de administrador"
                className="ml-1 p-0.5 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminAuth}
              title="Acceso restringido para administrador"
              className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs transition-colors"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Admin (Bloqueado)</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra principal de navegación */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo e Identidad del Taller */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab('explorador')}
        >
          <div className="w-11 h-11 rounded-lg bg-slate-950 border border-slate-700 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden shrink-0 group-hover:border-amber-500 transition-colors">
            {tallerConfig.logoUrl ? (
              <img 
                src={tallerConfig.logoUrl} 
                alt="Logo del Taller" 
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <Wrench className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono uppercase">
                {tallerConfig.nombre}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hidden md:inline">
                JavaFX 21 + JDBC
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{tallerConfig.slogan}</p>
          </div>
        </div>

        {/* Pestañas de Navegación del Sistema */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('explorador')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'explorador'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Diagrama Moto HD</span>
          </button>

          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'inventario'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Inventario & Stock</span>
            {lowStockCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-mono">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kardex')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'kardex'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Kardex de Movimientos</span>
          </button>

          <button
            onClick={() => setActiveTab('proveedores')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'proveedores'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Proveedores & Órdenes</span>
          </button>

          {/* Módulo Administrador Protegido con Contraseña */}
          <button
            onClick={handleAdminTabClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400'
                : isAdminAuthenticated
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 border border-amber-500/40'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border border-slate-700/60'
            }`}
          >
            {isAdminAuthenticated ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400/80" />
            )}
            <span>Módulo Administrador</span>
            {!isAdminAuthenticated && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">PIN</span>
            )}
          </button>
        </nav>

        {/* Acceso directo a Carrito en Móvil */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCartMobile}
            className="relative lg:hidden p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700 hover:bg-slate-750"
            title="Ver Carrito Persistente"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-navegación móvil */}
      <div className="lg:hidden flex overflow-x-auto px-3 py-2 bg-slate-950 gap-2 border-t border-slate-800 text-xs scrollbar-none">
        <button
          onClick={() => setActiveTab('explorador')}
          className={`whitespace-nowrap px-3 py-1 rounded ${
            activeTab === 'explorador' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Diagrama Moto HD
        </button>
        <button
          onClick={() => setActiveTab('inventario')}
          className={`whitespace-nowrap px-3 py-1 rounded ${
            activeTab === 'inventario' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Inventario ({lowStockCount})
        </button>
        <button
          onClick={() => setActiveTab('kardex')}
          className={`whitespace-nowrap px-3 py-1 rounded ${
            activeTab === 'kardex' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Kardex
        </button>
        <button
          onClick={() => setActiveTab('proveedores')}
          className={`whitespace-nowrap px-3 py-1 rounded ${
            activeTab === 'proveedores' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Proveedores
        </button>
        <button
          onClick={handleAdminTabClick}
          className={`whitespace-nowrap px-3 py-1 rounded flex items-center gap-1 ${
            activeTab === 'admin' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400'
          }`}
        >
          {isAdminAuthenticated ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
