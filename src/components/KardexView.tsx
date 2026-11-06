import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  ShoppingCart, 
  Sliders, 
  Calendar, 
  Download,
  Building,
  UserCheck
} from 'lucide-react';
import { MovimientoKardex, TipoMovimientoKardex, Repuesto, Proveedor } from '../types/workshop';

interface KardexViewProps {
  movimientos: MovimientoKardex[];
  repuestos: Repuesto[];
  proveedores: Proveedor[];
}

export const KardexView: React.FC<KardexViewProps> = ({
  movimientos,
  repuestos,
  proveedores
}) => {
  const [selectedRepuestoId, setSelectedRepuestoId] = useState<string>('todos');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedProveedorId, setSelectedProveedorId] = useState<string>('todos');
  const [searchDoc, setSearchDoc] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('2026-10-01');
  const [fechaHasta, setFechaHasta] = useState<string>('2026-10-31');

  // Filtrado de movimientos
  const filteredMovimientos = useMemo(() => {
    return movimientos.filter(m => {
      if (selectedRepuestoId !== 'todos' && m.repuestoId !== parseInt(selectedRepuestoId)) return false;
      if (selectedTipo !== 'todos' && m.tipo !== selectedTipo) return false;
      if (selectedProveedorId !== 'todos' && m.proveedorId !== parseInt(selectedProveedorId)) return false;

      if (searchDoc.trim() !== '') {
        const q = searchDoc.toLowerCase();
        const mDoc = m.documentoReferencia.toLowerCase().includes(q);
        const mRep = m.repuestoNombre.toLowerCase().includes(q);
        const mSku = m.repuestoCodigo.toLowerCase().includes(q);
        const mObs = m.observaciones.toLowerCase().includes(q);
        if (!mDoc && !mRep && !mSku && !mObs) return false;
      }

      // Rango de fechas
      if (fechaDesde && m.fecha.substring(0, 10) < fechaDesde) return false;
      if (fechaHasta && m.fecha.substring(0, 10) > fechaHasta) return false;

      return true;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [movimientos, selectedRepuestoId, selectedTipo, selectedProveedorId, searchDoc, fechaDesde, fechaHasta]);

  // Contadores por tipo
  const counts = useMemo(() => {
    let entradas = 0;
    let ventas = 0;
    let devoluciones = 0;
    let otros = 0;

    movimientos.forEach(m => {
      if (m.tipo === 'ENTRADA') entradas += m.cantidad;
      else if (m.tipo === 'VENTA') ventas += m.cantidad;
      else if (m.tipo === 'DEVOLUCION_PROVEEDOR') devoluciones += m.cantidad;
      else otros += m.cantidad;
    });

    return { entradas, ventas, devoluciones, otros };
  }, [movimientos]);

  const getTipoBadge = (tipo: TipoMovimientoKardex) => {
    switch (tipo) {
      case 'ENTRADA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold font-mono">
            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
            ENTRADA
          </span>
        );
      case 'VENTA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold font-mono">
            <ShoppingCart className="w-3 h-3 text-blue-400" />
            VENTA POS
          </span>
        );
      case 'DEVOLUCION_PROVEEDOR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold font-mono">
            <RotateCcw className="w-3 h-3 text-purple-400" />
            DEV. DEFECTO
          </span>
        );
      case 'SALIDA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 text-[10px] font-bold font-mono">
            <ArrowUpRight className="w-3 h-3 text-orange-400" />
            SALIDA TALLER
          </span>
        );
      case 'AJUSTE_INVENTARIO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold font-mono">
            <Sliders className="w-3 h-3 text-amber-400" />
            AJUSTE FÍSICO
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = "Fecha,SKU,Repuesto,Tipo,Cantidad,Saldo_Anterior,Saldo_Posterior,Costo_Unitario,Doc_Referencia,Responsable,Observaciones\n";
    const rows = filteredMovimientos.map(m => 
      `"${m.fecha}","${m.repuestoCodigo}","${m.repuestoNombre}","${m.tipo}",${m.cantidad},${m.saldoAnterior},${m.saldoPosterior},${m.costoUnitario},"${m.documentoReferencia}","${m.usuarioResponsable}","${m.observaciones}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kardex_mototaller_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* TARJETA DE AUDITORÍA Y TOTALES DE KARDEX */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400">Total Unidades Ingresadas</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            +{counts.entradas} un.
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Órdenes de compra recibidas</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400">Total Unidades Vendidas</div>
          <div className="text-xl font-black text-blue-400 font-mono mt-1 flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            -{counts.ventas} un.
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Facturadas a clientes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400">Devoluciones Proveedor</div>
          <div className="text-xl font-black text-purple-400 font-mono mt-1 flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-purple-400" />
            -{counts.devoluciones} un.
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Por repuestos defectuosos</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400">Auditoría / Trazabilidad</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-400" />
            100%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Conexión directa LAN JDBC</div>
        </div>
      </div>

      {/* FILTROS AVANZADOS DEL KARDEX */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              Libro Diario Kardex de Movimientos
            </h3>
            <p className="text-xs text-slate-400">
              Historial de movimientos con saldo anterior y posterior garantizado por transacciones ACID.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar CSV Kardex</span>
          </button>
        </div>

        {/* Panel de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800 text-xs">
          {/* Búsqueda por documento o texto */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por doc, SKU, motivo..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filtro por Producto */}
          <select
            value={selectedRepuestoId}
            onChange={(e) => setSelectedRepuestoId(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 truncate"
          >
            <option value="todos">Todos los Repuestos</option>
            {repuestos.map(r => (
              <option key={r.id} value={r.id}>{r.codigo} - {r.nombre}</option>
            ))}
          </select>

          {/* Filtro por Tipo */}
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="todos">Todos los Tipos de Movimiento</option>
            <option value="ENTRADA">ENTRADA (Recepción / Compras)</option>
            <option value="VENTA">VENTA (Facturación mostrador)</option>
            <option value="DEVOLUCION_PROVEEDOR">DEVOLUCIÓN (Defectuosos)</option>
            <option value="SALIDA">SALIDA (Consumo taller)</option>
            <option value="AJUSTE_INVENTARIO">AJUSTE (Conteo físico)</option>
          </select>

          {/* Filtro por Proveedor */}
          <select
            value={selectedProveedorId}
            onChange={(e) => setSelectedProveedorId(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 truncate"
          >
            <option value="todos">Todos los Proveedores</option>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.razonSocial}</option>
            ))}
          </select>

          {/* Rango de Fechas */}
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-[11px] w-full focus:outline-none focus:border-amber-500"
              title="Fecha inicial"
            />
            <span className="text-slate-600">-</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-[11px] w-full focus:outline-none focus:border-amber-500"
              title="Fecha final"
            />
          </div>
        </div>
      </div>

      {/* TABLA DE REGISTROS KARDEX */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800 text-[11px]">
                <th className="py-3 px-3">Fecha & Hora</th>
                <th className="py-3 px-3">Tipo Movimiento</th>
                <th className="py-3 px-3">Repuesto (SKU)</th>
                <th className="py-3 px-3 text-center">Cant.</th>
                <th className="py-3 px-3 text-center">Saldo Ant.</th>
                <th className="py-3 px-3 text-center">Nuevo Saldo</th>
                <th className="py-3 px-3 text-right">Costo / Venta</th>
                <th className="py-3 px-3">Doc. Referencia</th>
                <th className="py-3 px-3">Responsable</th>
                <th className="py-3 px-3">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMovimientos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No hay movimientos que coincidan con los filtros del Kardex.
                  </td>
                </tr>
              ) : (
                filteredMovimientos.map((m) => {
                  const isPositive = m.tipo === 'ENTRADA';
                  return (
                    <tr key={m.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        {m.fecha}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {getTipoBadge(m.tipo)}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-bold text-white">{m.repuestoNombre}</div>
                        <div className="text-[10px] font-mono text-amber-400">{m.repuestoCodigo}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold whitespace-nowrap">
                        <span className={isPositive ? 'text-emerald-400' : 'text-orange-400'}>
                          {isPositive ? `+${m.cantidad}` : `-${m.cantidad}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                        {m.saldoAnterior}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-white bg-slate-950/40">
                        {m.saldoPosterior}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                        <div className="text-slate-300">$ {m.costoUnitario.toLocaleString('es-CO')}</div>
                        {m.precioVentaUnitario && m.precioVentaUnitario > 0 ? (
                          <div className="text-[10px] text-emerald-400 font-bold">
                            V: $ {m.precioVentaUnitario.toLocaleString('es-CO')}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-cyan-300 font-semibold whitespace-nowrap">
                        {m.documentoReferencia}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {m.usuarioResponsable}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs truncate" title={m.observaciones}>
                        {m.observaciones}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
