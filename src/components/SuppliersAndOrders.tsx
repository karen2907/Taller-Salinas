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
  X
} from 'lucide-react';
import { Proveedor, OrdenCompra, Repuesto } from '../types/workshop';

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
  }) => void;
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

  // Formulario Orden de Entrada / Recepción
  const [entradaForm, setEntradaForm] = useState({
    proveedorId: proveedores[0]?.id || 1,
    repuestoId: repuestos[0]?.id || 1,
    cantidad: 10,
    costoUnitario: 35000,
    docRemision: `REM-${Math.floor(1000 + Math.random() * 9000)}`,
    observacion: 'Recepción conforme en almacén de repuestos.'
  });

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
    onCrearOrdenEntrada(entradaForm);
    alert(`¡Entrada Registrada con éxito! Se sumaron ${entradaForm.cantidad} unidades al stock y se registró en Kardex.`);
    setEntradaForm(prev => ({
      ...prev,
      docRemision: `REM-${Math.floor(1000 + Math.random() * 9000)}`
    }));
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
            onClick={() => setSubTab('entrada')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              subTab === 'entrada'
                ? 'bg-emerald-600 text-white font-bold'
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
          <button
            onClick={() => setSubTab('ordenes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              subTab === 'ordenes'
                ? 'bg-slate-800 text-amber-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Órdenes de Compra ({ordenesCompra.length})
          </button>
        </div>

        {subTab === 'proveedores' && (
          <button
            onClick={() => setShowNewProvModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Proveedor</span>
          </button>
        )}
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
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Contacto Comercial: <strong>{prov.contactoNombre}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono">{prov.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-cyan-300">{prov.correo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{prov.direccion}, {prov.ciudad}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Repuestos asignados: {repuestos.filter(r => r.proveedorId === prov.id).length} ítems</span>
                <button 
                  onClick={() => {
                    setEntradaForm(prev => ({ ...prev, proveedorId: prov.id }));
                    setSubTab('entrada');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Registrar Entrada →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA 2: ORDEN DE ENTRADA / RECEPCIÓN DE REPUESTOS */}
      {subTab === 'entrada' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl max-w-2xl mx-auto space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              Recepción de Repuestos / Orden de Entrada a Bodega
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Suma unidades al inventario físico e inserta automáticamente un movimiento de tipo <strong>ENTRADA</strong> en el Kardex.
            </p>
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
                    [{r.codigo}] {r.nombre} - {r.marcaMoto} (Stock actual: {r.stockActual})
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
                <span>Asentar Entrada & Actualizar Kardex</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VISTA 3: DEVOLUCIÓN POR REPUESTOS DEFECTUOSOS */}
      {subTab === 'devolucion' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl max-w-2xl mx-auto space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-purple-400" />
              Devolución de Compra por Repuesto Defectuoso
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Descuenta el stock físico defectuoso y genera un asiento formal de auditoría en el Kardex como <strong>DEVOLUCION_PROVEEDOR</strong>.
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
                <label className="font-semibold text-slate-300 block mb-1">Acta / Folio de Devolución:</label>
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
                {repuestos.filter(r => r.stockActual > 0).map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.codigo}] {r.nombre} (Stock disponible: {r.stockActual})
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

      {/* VISTA 4: HISTORIAL DE ÓRDENES DE COMPRA */}
      {subTab === 'ordenes' && (
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ordenesCompra.map((oc) => (
                <tr key={oc.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{oc.numero}</td>
                  <td className="py-2.5 px-3 text-slate-300">{oc.fecha}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{oc.proveedorNombre}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{oc.fechaEntregaEstimada}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{oc.itemsCount}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                    $ {oc.total.toLocaleString('es-CO')}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {oc.estado === 'RECIBIDA_COMPLETA' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                        RECIBIDA
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold text-[10px]">
                        PENDIENTE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <label className="font-semibold text-slate-300 block mb-1">NIT / Identificación:</label>
                <input
                  type="text"
                  required
                  placeholder="900.123.456-7"
                  value={provForm.nit}
                  onChange={(e) => setProvForm({ ...provForm, nit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Razón Social:</label>
                <input
                  type="text"
                  required
                  placeholder="Distribuciones Moto Ya S.A.S."
                  value={provForm.razonSocial}
                  onChange={(e) => setProvForm({ ...provForm, razonSocial: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Teléfono:</label>
                <input
                  type="text"
                  placeholder="+57 (601) 555-0100"
                  value={provForm.telefono}
                  onChange={(e) => setProvForm({ ...provForm, telefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  placeholder="ventas@proveedor.com"
                  value={provForm.correo}
                  onChange={(e) => setProvForm({ ...provForm, correo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Dirección:</label>
                <input
                  type="text"
                  placeholder="Calle 10 # 20-30"
                  value={provForm.direccion}
                  onChange={(e) => setProvForm({ ...provForm, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ciudad:</label>
                <input
                  type="text"
                  placeholder="Bogotá / Medellín / Cali"
                  value={provForm.ciudad}
                  onChange={(e) => setProvForm({ ...provForm, ciudad: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Nombre Persona de Contacto:</label>
              <input
                type="text"
                placeholder="Nombre del asesor comercial..."
                value={provForm.contactoNombre}
                onChange={(e) => setProvForm({ ...provForm, contactoNombre: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewProvModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
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
