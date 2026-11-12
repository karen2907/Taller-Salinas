import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Eye, 
  Printer, 
  Calendar, 
  User, 
  Bike, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Filter,
  Download,
  Receipt
} from 'lucide-react';
import { FacturaVenta, TallerConfig } from '../types/workshop';

interface InvoicesTraceabilityProps {
  facturas: FacturaVenta[];
  onVerFactura: (factura: FacturaVenta) => void;
  tallerConfig: TallerConfig;
}

export const InvoicesTraceability: React.FC<InvoicesTraceabilityProps> = ({
  facturas,
  onVerFactura,
  tallerConfig
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState<string>('TODOS');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Filtrado reactivo de facturas
  const facturasFiltradas = useMemo(() => {
    return facturas.filter(f => {
      const matchSearch = 
        f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.clienteDocumento && f.clienteDocumento.includes(searchTerm)) ||
        (f.placaMoto && f.placaMoto.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.modeloMoto && f.modeloMoto.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchMetodo = filtroMetodo === 'TODOS' || f.metodoPago === filtroMetodo;

      let matchFecha = true;
      if (fechaDesde) {
        matchFecha = matchFecha && f.fecha.slice(0, 10) >= fechaDesde;
      }
      if (fechaHasta) {
        matchFecha = matchFecha && f.fecha.slice(0, 10) <= fechaHasta;
      }

      return matchSearch && matchMetodo && matchFecha;
    });
  }, [facturas, searchTerm, filtroMetodo, fechaDesde, fechaHasta]);

  // Métricas financieras
  const totalFacturado = useMemo(() => {
    return facturasFiltradas.reduce((sum, f) => sum + f.total, 0);
  }, [facturasFiltradas]);

  const totalIva = useMemo(() => {
    return facturasFiltradas.reduce((sum, f) => sum + f.iva, 0);
  }, [facturasFiltradas]);

  const itemsVendidosTotal = useMemo(() => {
    return facturasFiltradas.reduce((sum, f) => {
      const cantItems = f.items ? f.items.reduce((acc, it) => acc + it.cantidad, 0) : 0;
      return sum + cantItems;
    }, 0);
  }, [facturasFiltradas]);

  return (
    <div className="space-y-4">
      {/* TARJETAS RESUMEN DE TRAZABILIDAD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>FACTURAS GENERADAS</span>
            <Receipt className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {facturasFiltradas.length} <span className="text-xs text-slate-500 font-sans font-normal">de {facturas.length}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registros con validez fiscal y descarga en Kardex</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>TOTAL FACTURADO</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            $ {totalFacturado.toLocaleString('es-CO')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ventas totales acumuladas</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>IVA RECAUDADO (19%)</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            $ {totalIva.toLocaleString('es-CO')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Impuesto discriminado para informe fiscal</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>REPUESTOS VENDIDOS</span>
            <Bike className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {itemsVendidosTotal} <span className="text-xs text-slate-500 font-sans font-normal">unidades</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Descargadas en tiempo real de bodega</p>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por N° Factura, Nombre de Cliente, Cédula o Placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Medio de Pago:</span>
            <select
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none"
            >
              <option value="TODOS" className="bg-slate-900 text-white">Todos</option>
              <option value="Efectivo" className="bg-slate-900 text-white">Efectivo</option>
              <option value="Transferencia" className="bg-slate-900 text-white">Transferencia</option>
              <option value="Tarjeta" className="bg-slate-900 text-white">Tarjeta</option>
              <option value="Crédito" className="bg-slate-900 text-white">Crédito</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Desde:</span>
            <input 
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Hasta:</span>
            <input 
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none"
            />
          </div>

          {(searchTerm || filtroMetodo !== 'TODOS' || fechaDesde || fechaHasta) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroMetodo('TODOS');
                setFechaDesde('');
                setFechaHasta('');
              }}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* TABLA PRINCIPAL DE FACTURAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800 text-[11px]">
                <th className="py-3 px-3">N° Factura</th>
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-3">Cliente / Identificación</th>
                <th className="py-3 px-3">Motocicleta</th>
                <th className="py-3 px-3 text-center">Ítems</th>
                <th className="py-3 px-3">Medio Pago</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">IVA (19%)</th>
                <th className="py-3 px-3 text-right font-bold text-white">Total Facturado</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {facturasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <Receipt className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                    No se encontraron facturas registradas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                facturasFiltradas.map((fac) => {
                  const cantItems = fac.items ? fac.items.reduce((sum, it) => sum + it.cantidad, 0) : 0;
                  return (
                    <tr key={fac.numero} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {fac.numero}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {fac.fecha}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{fac.clienteNombre}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          CC/NIT: {fac.clienteDocumento || 'Consumidor Final'} {fac.clienteTelefono ? `· ${fac.clienteTelefono}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {fac.placaMoto ? (
                          <div>
                            <span className="font-mono font-bold bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-900/60 text-[10px]">
                              {fac.placaMoto}
                            </span>
                            <div className="text-[11px] text-slate-300 mt-0.5">{fac.modeloMoto}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Venta Mostrador</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px]">
                          {cantItems}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                          {fac.metodoPago || 'Efectivo'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        $ {fac.subtotal.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        $ {fac.iva.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                        $ {fac.total.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onVerFactura(fac)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver / Imprimir</span>
                        </button>
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
