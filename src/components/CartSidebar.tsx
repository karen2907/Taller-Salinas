import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  FileText, 
  CreditCard, 
  User, 
  Bike, 
  Phone, 
  IdCard, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  X
} from 'lucide-react';
import { ItemCarrito } from '../types/workshop';

interface CartSidebarProps {
  carrito: ItemCarrito[];
  onUpdateQuantity: (repuestoId: number, nuevaCantidad: number) => void;
  onRemoveItem: (repuestoId: number) => void;
  onClearCart: () => void;
  onGenerarCotizacion: (clienteInfo: ClienteInfo) => void;
  onFacturarVenta: (clienteInfo: ClienteInfo) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export interface ClienteInfo {
  nombre: string;
  documento: string;
  telefono: string;
  placa: string;
  modelo: string;
  observaciones: string;
  metodoPago: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Crédito';
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  carrito,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onGenerarCotizacion,
  onFacturarVenta,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [showClientForm, setShowClientForm] = useState(true);
  const [cliente, setCliente] = useState<ClienteInfo>({
    nombre: 'Juan Camilo Pérez',
    documento: '1098452331',
    telefono: '312-554-9988',
    placa: 'WXT-44D',
    modelo: 'Yamaha FZ 2.0 (2022)',
    observaciones: 'Mantenimiento preventivo general y cambio de kit de arrastre',
    metodoPago: 'Efectivo'
  });

  // Cálculos financieros
  const subtotal = carrito.reduce((acc, item) => acc + item.subtotal, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  const handleGenerarCotizacion = () => {
    if (carrito.length === 0) return;
    onGenerarCotizacion(cliente);
  };

  const handleFacturarVenta = () => {
    if (carrito.length === 0) return;
    onFacturarVenta(cliente);
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl">
      {/* Cabecera del Carrito Persistente */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white font-mono">Carrito de Trabajo</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-mono">
                {carrito.reduce((sum, item) => sum + item.cantidad, 0)} ítems
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Persistente · No se borra al navegar</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {carrito.length > 0 && (
            <button
              onClick={onClearCart}
              title="Vaciar Carrito"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Formulario Plegable: Datos del Cliente y Vehículo */}
      <div className="border-b border-slate-800 bg-slate-900/90 text-xs">
        <button
          onClick={() => setShowClientForm(!showClientForm)}
          className="w-full px-4 py-2 flex items-center justify-between text-slate-300 hover:text-white hover:bg-slate-800/40 font-semibold"
        >
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Datos Cliente & Motocicleta</span>
            {cliente.placa && (
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                {cliente.placa}
              </span>
            )}
          </div>
          {showClientForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showClientForm && (
          <div className="p-3 pt-1 space-y-2 bg-slate-950/40">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Nombre del Cliente:</label>
              <div className="relative">
                <User className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                <input
                  type="text"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                  placeholder="Nombre y apellido..."
                  className="w-full bg-slate-900 border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Cédula / NIT:</label>
                <div className="relative">
                  <IdCard className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                  <input
                    type="text"
                    value={cliente.documento}
                    onChange={(e) => setCliente({ ...cliente, documento: e.target.value })}
                    placeholder="Documento..."
                    className="w-full bg-slate-900 border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Teléfono:</label>
                <div className="relative">
                  <Phone className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                  <input
                    type="text"
                    value={cliente.telefono}
                    onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                    placeholder="Celular..."
                    className="w-full bg-slate-900 border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Placa Moto:</label>
                <div className="relative">
                  <Bike className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
                  <input
                    type="text"
                    value={cliente.placa}
                    onChange={(e) => setCliente({ ...cliente, placa: e.target.value.toUpperCase() })}
                    placeholder="Ej. JKL-12C"
                    className="w-full bg-slate-900 border border-slate-700 rounded pl-7 pr-2 py-1 text-xs text-amber-300 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Modelo / Cilindraje:</label>
                <input
                  type="text"
                  value={cliente.modelo}
                  onChange={(e) => setCliente({ ...cliente, modelo: e.target.value })}
                  placeholder="Ej. Pulsar NS200"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Método de Pago:</label>
              <select
                value={cliente.metodoPago}
                onChange={(e) => setCliente({ ...cliente, metodoPago: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia Bancaria / Nequi / Daviplata</option>
                <option value="Tarjeta">Tarjeta Débito / Crédito</option>
                <option value="Crédito">Crédito Taller (15 días)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Listado de Repuestos en el Carrito */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {carrito.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">El carrito está vacío</p>
              <p className="text-xs text-slate-500 mt-1">
                Explore el diagrama de la motocicleta y haga clic en "+ Agregar" en los repuestos deseados.
              </p>
            </div>
          </div>
        ) : (
          carrito.map((item) => (
            <div
              key={item.repuesto.id}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/40 px-1 rounded">
                      {item.repuesto.codigo}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {item.repuesto.marcaMoto}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-1 rounded">
                      {item.repuesto.cilindraje}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">
                    {item.repuesto.nombre}
                  </h5>
                  <div className="text-[10px] text-slate-500 font-mono">
                    OEM: {item.repuesto.referenciaOEM}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.repuesto.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Quitar repuesto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fila de Cantidad y Precio */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded">
                  <button
                    onClick={() => onUpdateQuantity(item.repuesto.id, item.cantidad - 1)}
                    className="px-2 py-0.5 text-slate-300 hover:text-white text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-white font-mono min-w-[20px] text-center">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.repuesto.id, item.cantidad + 1)}
                    disabled={item.cantidad >= item.repuesto.stockActual}
                    className="px-2 py-0.5 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">
                    $ {item.precioUnitario.toLocaleString('es-CO')} c/u
                  </div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    $ {item.subtotal.toLocaleString('es-CO')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumen Financiero y Acciones */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        {/* Totales */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <span className="font-mono text-slate-200">$ {subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>IVA (19%):</span>
            <span className="font-mono text-slate-200">$ {iva.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-slate-800">
            <span className="text-white">TOTAL ESTIMADO:</span>
            <span className="font-mono text-emerald-400 text-base">
              $ {total.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        {/* Botones Operativos Requeridos */}
        <div className="space-y-2 pt-1">
          {/* Botón 1: Generar Cotización (Sin modificar inventario) */}
          <button
            onClick={handleGenerarCotizacion}
            disabled={carrito.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span>GENERAR COTIZACIÓN (Guarda / Imprime)</span>
          </button>

          {/* Botón 2: Facturar / Vender (Descuenta stock e inserta Kardex) */}
          <button
            onClick={handleFacturarVenta}
            disabled={carrito.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/40 active:scale-[0.99]"
          >
            <CreditCard className="w-4 h-4" />
            <span>FACTURAR / VENDER (Descuenta Stock & Kardex)</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 font-mono">
          ✓ Modo Transaccional ACID LAN HikariCP
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Vista de Escritorio: Sidebar fijo */}
      <aside className="hidden lg:block w-96 shrink-0 h-[calc(100vh-6rem)] sticky top-24 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        {content}
      </aside>

      {/* Vista Móvil / Tablet: Modal flotante */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-md h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
