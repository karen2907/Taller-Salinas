import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  PackageCheck, 
  FileCheck2, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  AlertOctagon,
  X,
  FilePlus,
  ArrowRight,
  Download,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { Proveedor, OrdenCompra, OrdenCompraItem, Repuesto } from '../types/workshop';

interface SuppliersAndOrdersProps {
  proveedores: Proveedor[];
  ordenesCompra: OrdenCompra[];
  repuestos: Repuesto[];
  onAddNewProveedor: (prov: Omit<Proveedor, 'id'>) => void;
  onCrearOrdenEntrada: (orden: {
    proveedorId: number;
    repuestoId: number;
    cantidad: number;
    costoUnitario: number;
    docRemision: string;
    observacion: string;
    ordenCompraId?: number;
  }) => void;
  onCrearOrdenCompra: (nuevaOrden: Omit<OrdenCompra, 'id'>) => void;
  onRegistrarDevolucion: (devolucion: {
    proveedorId: number;
    repuestoId: number;
    cantidad: number;
    docReferencia: string;
    motivoDefecto: string;
  }) => void;
}

export const SuppliersAndOrders: React.FC<SuppliersAndOrdersProps> = ({
  proveedores,
  ordenesCompra,
  repuestos,
  onAddNewProveedor,
  onCrearOrdenEntrada,
  onCrearOrdenCompra,
  onRegistrarDevolucion
}) => {
  const [subTab, setSubTab] = useState<'proveedores' | 'entrada' | 'devolucion' | 'ordenes'>('proveedores');

  // Modal nuevo proveedor
  const [showNewProvModal, setShowNewProvModal] = useState(false);
  const [provForm, setProvForm] = useState<Omit<Proveedor, 'id'>>({
    nit: '',
    razonSocial: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: 'Bogotá',
    contactoNombre: ''
  });

  // Modal NUEVA ORDEN DE COMPRA (PUNTO 2)
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderProvId, setNewOrderProvId] = useState<number>(proveedores[0]?.id || 1);
  const [newOrderEntrega, setNewOrderEntrega] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [newOrderObs, setNewOrderObs] = useState('Pedido urgente para abastecimiento semanal de bodega');
  const [newOrderItems, setNewOrderItems] = useState<{ repuestoId: number; cantidad: number; costoUnitario: number }[]>([
    { repuestoId: repuestos[0]?.id || 1, cantidad: 5, costoUnitario: repuestos[0]?.precioCosto || 35000 }
  ]);

  // Formulario Orden de Entrada / Recepción
  const [selectedOcId, setSelectedOcId] = useState<string>('NINGUNA');
  const [entradaForm, setEntradaForm] = useState({
    proveedorId: proveedores[0]?.id || 1,
    repuestoId: repuestos[0]?.id || 1,
    cantidad: 10,
    costoUnitario: 35000,
    docRemision: `REM-${Math.floor(1000 + Math.random() * 9000)}`,
    observacion: 'Recepción conforme en almacén de repuestos.'
  });

  // Al seleccionar una orden de compra para importar
  const handleSelectOcToImport = (ocIdStr: string) => {
    setSelectedOcId(ocIdStr);
    if (ocIdStr === 'NINGUNA') return;

    const oc = ordenesCompra.find(o => o.id === parseInt(ocIdStr));
    if (!oc) return;

    // Autoseleccionar proveedor de la OC
    const primerItem = oc.items && oc.items.length > 0 ? oc.items[0] : null;
    const repId = primerItem ? primerItem.repuestoId : (repuestos[0]?.id || 1);
    const cant = primerItem ? (primerItem.cantidadPedida - primerItem.cantidadRecibida) || primerItem.cantidadPedida : 10;
    const costo = primerItem ? primerItem.costoUnitario : 35000;

    setEntradaForm(prev => ({
      ...prev,
      proveedorId: oc.proveedorId,
      repuestoId: repId,
      cantidad: Math.max(1, cant),
      costoUnitario: costo,
      docRemision: `FAC-PROV-${oc.numero}`,
      observacion: `Recepción parcial/total de la Orden de Compra ${oc.numero}`
    }));
  };

  // Formulario Devolución por Defecto
  const [devForm, setDevForm] = useState({
    proveedorId: proveedores[0]?.id || 1,
    repuestoId: repuestos[0]?.id || 1,
    cantidad: 1,
    docReferencia: `DEV-DEF-${Math.floor(100 + Math.random() * 900)}`,
    motivoDefecto: 'Rosca barrida de fábrica / fisura interna en el material'
  });

  const handleSaveProv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provForm.nit || !provForm.razonSocial) return;
    onAddNewProveedor(provForm);
    setShowNewProvModal(false);
    setProvForm({
      nit: '',
      razonSocial: '',
      telefono: '',
      correo: '',
      direccion: '',
      ciudad: 'Bogotá',
      contactoNombre: ''
    });
  };

  const handleExecuteEntrada = (e: React.FormEvent) => {
    e.preventDefault();
    onCrearOrdenEntrada({
      ...entradaForm,
      ordenCompraId: selectedOcId !== 'NINGUNA' ? parseInt(selectedOcId) : undefined
    });
    alert(`¡Entrada Registrada con éxito! Se sumaron ${entradaForm.cantidad} unidades al stock y se registró el movimiento de tipo ENTRADA en el Kardex.`);
    setEntradaForm(prev => ({
      ...prev,
      docRemision: `REM-${Math.floor(1000 + Math.random() * 9000)}`
    }));
    setSelectedOcId('NINGUNA');
  };

  const handleExecuteDevolucion = (e: React.FormEvent) => {
    e.preventDefault();
    onRegistrarDevolucion(devForm);
    alert(`¡Devolución a proveedor registrada! Se descontaron ${devForm.cantidad} unidades defectuosas del stock y se registró en Kardex.`);
    setDevForm(prev => ({
      ...prev,
      docReferencia: `DEV-DEF-${Math.floor(100 + Math.random() * 900)}`
    }));
  };

  // Guardar nueva orden de compra
  const handleSaveNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrderItems.length === 0) return;

    const prov = proveedores.find(p => p.id === newOrderProvId);
    const numeroOC = `OC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().slice(0, 10);

    const mappedItems: OrdenCompraItem[] = newOrderItems.map(item => {
      const rep = repuestos.find(r => r.id === item.repuestoId)!;
      return {
        repuestoId: item.repuestoId,
        codigo: rep.codigo,
        nombre: rep.nombre,
        cantidadPedida: item.cantidad,
        cantidadRecibida: 0,
        costoUnitario: item.costoUnitario,
        subtotal: item.cantidad * item.costoUnitario
      };
    });

    const totalCalculado = mappedItems.reduce((acc, it) => acc + it.subtotal, 0);

    const nuevaOC: Omit<OrdenCompra, 'id'> = {
      numero: numeroOC,
      fecha: now,
      proveedorId: newOrderProvId,
      proveedorNombre: prov?.razonSocial || 'Proveedor General',
      estado: 'PENDIENTE',
      total: totalCalculado,
      itemsCount: mappedItems.length,
      fechaEntregaEstimada: newOrderEntrega,
      items: mappedItems,
      observaciones: newOrderObs
    };

    onCrearOrdenCompra(nuevaOC);
    setShowNewOrderModal(false);
    alert(`¡Orden de Compra ${numeroOC} creada exitosamente! Ahora puedes ir a la pestaña 'Recepción / Entrada' e importarla para asentar las piezas que vayan llegando.`);
  };

  return (
    <div className="space-y-4">
      {/* NAVEGACIÓN INTERNA DE PESTAÑAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('proveedores')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              subTab === 'proveedores'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Directorio de Proveedores ({proveedores.length})
          </button>
          <button
            onClick={() => setSubTab('ordenes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              subTab === 'ordenes'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Órdenes de Compra ({ordenesCompra.length})</span>
          </button>
          <button
            onClick={() => setSubTab('entrada')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              subTab === 'entrada'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Recepción / Entrada (+ Stock)</span>
          </button>
          <button
            onClick={() => setSubTab('devolucion')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              subTab === 'devolucion'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Devolución por Defecto (- Stock)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'proveedores' && (
            <button
              onClick={() => setShowNewProvModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Proveedor</span>
            </button>
          )}

          {subTab === 'ordenes' && (
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              <FilePlus className="w-4 h-4" />
              <span>+ Crear Orden de Compra</span>
            </button>
          )}
        </div>
      </div>

      {/* VISTA 1: DIRECTORIO DE PROVEEDORES */}
      {subTab === 'proveedores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proveedores.map((prov) => (
            <div 
              key={prov.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                    NIT: {prov.nit}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    {prov.razonSocial}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  ACTIVO
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{prov.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{prov.correo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{prov.direccion}, {prov.ciudad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-400">Contacto:</span>
                  <span className="font-semibold text-slate-200">{prov.contactoNombre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA 2: HISTORIAL Y GESTIÓN DE ÓRDENES DE COMPRA (PUNTO 2) */}
      {subTab === 'ordenes' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-400" />
                Órdenes de Compra a Proveedores
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Emite órdenes oficiales a tus distribuidores y luego impórtalas en la pestaña <strong>"Recepción / Entrada"</strong> para sumar el stock recibido.
              </p>
            </div>
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Orden</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800 text-[11px]">
                  <th className="py-3 px-3">N° Orden</th>
                  <th className="py-3 px-3">Fecha Emisión</th>
                  <th className="py-3 px-3">Proveedor</th>
                  <th className="py-3 px-3">Entrega Estimada</th>
                  <th className="py-3 px-3 text-center">Ítems</th>
                  <th className="py-3 px-3 text-right">Valor Total</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                  <th className="py-3 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ordenesCompra.map((oc) => (
                  <tr key={oc.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{oc.numero}</td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">{oc.fecha}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{oc.proveedorNombre}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{oc.fechaEntregaEstimada}</td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-200">
                        {oc.itemsCount} piezas
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      $ {oc.total.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {oc.estado === 'RECIBIDA_COMPLETA' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                          RECIBIDA
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold text-[10px] animate-pulse">
                          PENDIENTE DE RECEPCIÓN
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setSubTab('entrada');
                          handleSelectOcToImport(oc.id.toString());
                        }}
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded text-xs font-bold transition-all flex items-center gap-1 mx-auto"
                        title="Importar esta orden en el módulo de recepción de entrada"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Recibir Mercancía</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 3: RECEPCIÓN / ENTRADA (+ STOCK Y KARDEX CON IMPORTACIÓN DE OC) */}
      {subTab === 'entrada' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div>
            <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              Movimiento de Bodega: Entrada (+ Stock)
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              Recepción de Repuestos / Orden de Entrada a Bodega
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Suma unidades al inventario físico e inserta automáticamente un movimiento de tipo <strong>ENTRADA</strong> en el Kardex.
            </p>
          </div>

          {/* IMPORTADOR DE ORDEN DE COMPRA (PUNTO 2 DE LA SOLICITUD) */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                <ClipboardList className="w-4 h-4 text-amber-400" />
                ¿Deseas relacionar o importar una Orden de Compra previa?
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                Importación Rápida
              </span>
            </div>
            <select
              value={selectedOcId}
              onChange={(e) => handleSelectOcToImport(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="NINGUNA">-- Entrada independiente sin Orden de Compra --</option>
              {ordenesCompra.map(oc => (
                <option key={oc.id} value={oc.id}>
                  {oc.numero} · {oc.proveedorNombre} ({oc.estado}) - Total: ${oc.total.toLocaleString('es-CO')}
                </option>
              ))}
            </select>
            {selectedOcId !== 'NINGUNA' && (
              <div className="text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Datos precargados desde la Orden de Compra. Ajusta la cantidad recibida física si llegó incompleta.</span>
              </div>
            )}
          </div>

          <form onSubmit={handleExecuteEntrada} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Proveedor Emisor:</label>
                <select
                  value={entradaForm.proveedorId}
                  onChange={(e) => setEntradaForm({ ...entradaForm, proveedorId: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.razonSocial} (NIT: {p.nit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Documento de Remisión / Factura Proveedor:</label>
                <input
                  type="text"
                  required
                  value={entradaForm.docRemision}
                  onChange={(e) => setEntradaForm({ ...entradaForm, docRemision: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-cyan-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Repuesto a Recibir en Almacén:</label>
              <select
                value={entradaForm.repuestoId}
                onChange={(e) => {
                  const repId = parseInt(e.target.value);
                  const selectedRep = repuestos.find(r => r.id === repId);
                  setEntradaForm({ 
                    ...entradaForm, 
                    repuestoId: repId,
                    costoUnitario: selectedRep?.precioCosto || 35000
                  });
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {repuestos.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.codigo}] {r.nombre} - {r.marcaMoto} ({r.cilindraje}) - Stock actual: {r.stockActual}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Cantidad Recibida:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={entradaForm.cantidad}
                  onChange={(e) => setEntradaForm({ ...entradaForm, cantidad: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Costo Unitario de Compra (COP):</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={entradaForm.costoUnitario}
                  onChange={(e) => setEntradaForm({ ...entradaForm, costoUnitario: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Observaciones / Lote:</label>
              <textarea
                rows={2}
                value={entradaForm.observacion}
                onChange={(e) => setEntradaForm({ ...entradaForm, observacion: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/40"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Asentar Entrada y Sumar al Stock</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VISTA 4: DEVOLUCIÓN POR DEFECTO */}
      {subTab === 'devolucion' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div>
            <span className="text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              Movimiento de Bodega: Devolución (- Stock)
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-purple-400" />
              Devolución de Repuesto con Defecto de Fábrica
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Descuenta unidades no conformes del stock físico e inserta un movimiento <strong>DEVOLUCION_PROVEEDOR</strong> en Kardex para reclamo de garantía.
            </p>
          </div>

          <form onSubmit={handleExecuteDevolucion} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Proveedor Destinatario:</label>
                <select
                  value={devForm.proveedorId}
                  onChange={(e) => setDevForm({ ...devForm, proveedorId: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.razonSocial}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Acta / Documento de Devolución:</label>
                <input
                  type="text"
                  required
                  value={devForm.docReferencia}
                  onChange={(e) => setDevForm({ ...devForm, docReferencia: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-purple-300 font-mono font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Repuesto Defectuoso:</label>
              <select
                value={devForm.repuestoId}
                onChange={(e) => setDevForm({ ...devForm, repuestoId: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
              >
                {repuestos.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.codigo}] {r.nombre} (Stock actual: {r.stockActual})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Cantidad a Devolver:</label>
              <input
                type="number"
                min="1"
                required
                value={devForm.cantidad}
                onChange={(e) => setDevForm({ ...devForm, cantidad: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Detalle del Defecto de Fábrica:</label>
              <textarea
                rows={3}
                required
                value={devForm.motivoDefecto}
                onChange={(e) => setDevForm({ ...devForm, motivoDefecto: e.target.value })}
                placeholder="Describa la falla técnica (ej. fuga de aceite, fisura en fundición, rosca defectuosa)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-900/40"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Asentar Devolución y Descontar Stock</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL NUEVA ORDEN DE COMPRA (PUNTO 2) */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form 
            onSubmit={handleSaveNewOrder}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 text-xs animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Generar Nueva Orden de Compra a Proveedor
                </h3>
              </div>
              <button type="button" onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Proveedor Destinatario *:</label>
                <select
                  value={newOrderProvId}
                  onChange={(e) => setNewOrderProvId(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.razonSocial}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Fecha Entrega Estimada *:</label>
                <input 
                  type="date"
                  required
                  value={newOrderEntrega}
                  onChange={(e) => setNewOrderEntrega(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Lista de productos pedidos en la orden */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  Productos a Solicitar al Distribuidor:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewOrderItems(prev => [
                      ...prev,
                      { repuestoId: repuestos[0]?.id || 1, cantidad: 5, costoUnitario: repuestos[0]?.precioCosto || 30000 }
                    ]);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar Ítem</span>
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {newOrderItems.map((item, idx) => {
                  const rep = repuestos.find(r => r.id === item.repuestoId);
                  return (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                      <select
                        value={item.repuestoId}
                        onChange={(e) => {
                          const newId = parseInt(e.target.value);
                          const sel = repuestos.find(r => r.id === newId);
                          const updated = [...newOrderItems];
                          updated[idx] = {
                            ...updated[idx],
                            repuestoId: newId,
                            costoUnitario: sel?.precioCosto || updated[idx].costoUnitario
                          };
                          setNewOrderItems(updated);
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                      >
                        {repuestos.map(r => (
                          <option key={r.id} value={r.id}>
                            [{r.codigo}] {r.nombre} ({r.marcaMoto})
                          </option>
                        ))}
                      </select>

                      <div className="w-24">
                        <input 
                          type="number"
                          min="1"
                          placeholder="Cant"
                          value={item.cantidad}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const updated = [...newOrderItems];
                            updated[idx].cantidad = val;
                            setNewOrderItems(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono text-center"
                        />
                      </div>

                      <div className="w-28 text-right font-mono font-bold text-emerald-400">
                        $ {(item.cantidad * item.costoUnitario).toLocaleString('es-CO')}
                      </div>

                      {newOrderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewOrderItems(newOrderItems.filter((_, i) => i !== idx));
                          }}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Total Proyectado de la Orden:</span>
                <span className="text-base font-bold text-emerald-400">
                  $ {newOrderItems.reduce((acc, it) => acc + (it.cantidad * it.costoUnitario), 0).toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Notas / Condiciones Comerciales:</label>
              <textarea 
                rows={2}
                value={newOrderObs}
                onChange={(e) => setNewOrderObs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Generar Orden de Compra</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL NUEVO PROVEEDOR */}
      {showNewProvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form 
            onSubmit={handleSaveProv}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-3.5 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Registrar Nuevo Proveedor de Repuestos
              </h4>
              <button type="button" onClick={() => setShowNewProvModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">NIT / Documento *:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. 900.548.120-4"
                  value={provForm.nit}
                  onChange={(e) => setProvForm({ ...provForm, nit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Razón Social *:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Repuestos Andina S.A.S."
                  value={provForm.razonSocial}
                  onChange={(e) => setProvForm({ ...provForm, razonSocial: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Teléfono Móvil / PBX:</label>
                <input 
                  type="text"
                  placeholder="+57 (601) 458-9200"
                  value={provForm.telefono}
                  onChange={(e) => setProvForm({ ...provForm, telefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Correo Electrónico:</label>
                <input 
                  type="email"
                  placeholder="pedidos@proveedor.com"
                  value={provForm.correo}
                  onChange={(e) => setProvForm({ ...provForm, correo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Dirección:</label>
                <input 
                  type="text"
                  placeholder="Calle 13 # 42-50"
                  value={provForm.direccion}
                  onChange={(e) => setProvForm({ ...provForm, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ciudad:</label>
                <input 
                  type="text"
                  placeholder="Bogotá"
                  value={provForm.ciudad}
                  onChange={(e) => setProvForm({ ...provForm, ciudad: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Nombre Asesor Comercial:</label>
              <input 
                type="text"
                placeholder="Carlos Mendoza"
                value={provForm.contactoNombre}
                onChange={(e) => setProvForm({ ...provForm, contactoNombre: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewProvModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-md shadow-amber-500/20"
              >
                Guardar Proveedor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
