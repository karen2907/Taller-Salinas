import React from 'react';
import { 
  Server, 
  Monitor, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Wrench, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  X,
  Cpu,
  Database
} from 'lucide-react';
import { TerminalLAN } from '../types/workshop';

interface TerminalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminales: TerminalLAN[];
  terminalActual: string;
}

export const TerminalInfoModal: React.FC<TerminalInfoModalProps> = ({
  isOpen,
  onClose,
  terminales,
  terminalActual
}) => {
  if (!isOpen) return null;

  const currentTerm = terminales.find(t => t.id === terminalActual) || terminales[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>¿Para qué se usa el "Terminal de Trabajo"?</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Red Local LAN
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Arquitectura multi-equipo para talleres de motocicletas con concurrencia en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Explicativo */}
        <div className="p-6 space-y-5 overflow-y-auto text-sm text-slate-300 scrollbar-thin">
          {/* Tarjeta de Terminal Seleccionada Actualmente */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <p className="text-xs font-mono text-emerald-400 uppercase font-semibold">Terminal Activa en esta Sesión:</p>
                <p className="text-sm font-bold text-white">{currentTerm.nombre} ({currentTerm.id})</p>
                <p className="text-xs text-slate-400 font-mono">IP Asignada: {currentTerm.ip} · Rol: {currentTerm.rol}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              CONECTADO
            </span>
          </div>

          {/* Explicación de Propósito y Casos de Uso */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              1. Propósito en un Taller de Motos Real
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              En un taller de motocicletas mediano o grande, el software no se usa en una sola computadora. 
              Existen <strong>varios puestos físicos de trabajo</strong> que interactúan con el mismo inventario y la misma base de datos al mismo tiempo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-white text-xs flex items-center gap-1.5 mb-1 text-sky-400">
                  <Users className="w-3.5 h-3.5" /> Mostrador / Recepción
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Atiende clientes, elabora <strong>Cotizaciones previas</strong>, consulta compatibilidades de cilindrajes y registra los datos del cliente y la placa de la moto.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-white text-xs flex items-center gap-1.5 mb-1 text-emerald-400">
                  <Wrench className="w-3.5 h-3.5" /> Puesto de Mecánicos / Bahía
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Utiliza una tablet o PC táctil para explorar el <strong>Diagrama Interactivo de la Moto</strong>, identificar piezas dañadas (ej. pistón, cadenilla) y enviar pedidos a bodega.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-white text-xs flex items-center gap-1.5 mb-1 text-amber-400">
                  <Layers className="w-3.5 h-3.5" /> Bodega / Almacén de Repuestos
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Recibe las piezas físicas de proveedores, procesa <strong>Órdenes de Entrada</strong>, gestiona repuestos defectuosos (devoluciones) y hace conteos físicos de stock.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-white text-xs flex items-center gap-1.5 mb-1 text-purple-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Caja & Administración
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Genera la <strong>Facturación de Venta</strong> definitiva, cobra dinero, imprime tickets POS y revisa los movimientos del Kardex con permisos protegidos.
                </p>
              </div>
            </div>
          </div>

          {/* Beneficios Técnicos y de Auditoría */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              2. ¿Por qué es crucial para la seguridad y el Kardex?
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Auditoría y Trazabilidad Inmutable:</strong> Cuando se descarga stock o se factura, el Kardex graba exactamente cuál terminal e IP realizó el movimiento (ej. <em>"Venta realizada desde TERM-01 (192.168.1.101)"</em>). Si falta una pieza, se sabe desde qué equipo se autorizó.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Concurrencia sin Colisiones:</strong> Gracias al Pool HikariCP y transacciones ACID en PostgreSQL, 5 mecánicos y 2 cajeros pueden consultar y descontar repuestos al mismo milisegundo sin bloquear el sistema.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Personalización de Terminales:</strong> El Administrador puede agregar nuevas terminales, renombrarlas o cambiar sus IPs desde el Módulo de Administrador con contraseña.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Cambia de terminal en cualquier momento para simular diferentes puestos del taller.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
