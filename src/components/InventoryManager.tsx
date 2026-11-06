import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  ArrowUpDown, 
  Edit3, 
  Check, 
  X, 
  DollarSign, 
  SlidersHorizontal,
  MapPin,
  Layers,
  Sparkles,
  Gauge,
  Copy
} from 'lucide-react';
import { Repuesto, ZonaMotoId, MarcaMoto, Proveedor } from '../types/workshop';
import { ZONAS_MOTO } from '../data/initialData';

interface InventoryManagerProps {
  repuestos: Repuesto[];
  proveedores: Proveedor[];
  onUpdateStock: (repuestoId: number, nuevoStock: number, motivo: string) => void;
  onAddNewRepuesto: (nuevo: Omit<Repuesto, 'id'>) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  repuestos,
  proveedores,
  onUpdateStock,
  onAddNewRepuesto
}) => {
  const [filterZona, setFilterZona] = useState<string>('todas');
  const [filterMarca, setFilterMarca] = useState<string>('todas');
  const [filterCilindraje, setFilterCilindraje] = useState<string>('todos');
  const [filterAlert, setFilterAlert] = useState<'todos' | 'bajo_stock' | 'agotados'>('todos');
  const [search, setSearch] = useState<string>('');
  const [copiedOem, setCopiedOem] = useState<string | null>(null);
  
  // Modal de ajuste de stock rápido
  const [adjustingItem, setAdjustingItem] = useState<Repuesto | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Ajuste de conteo físico en bodega');

  // Modal de nuevo repuesto
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<Omit<Repuesto, 'id'>>({
    codigo: '',
    referenciaOEM: '',
    nombre: '',
    zonaId: 'motor',
    subparte: 'Pistón y Cilindro',
    marcaMoto: 'Yamaha',
    cilindraje: '150cc',
    anoCompatibilidad: '2018 - 2024',
    modelosCompatibles: ['FZ 16', 'FZ 2.0'],
    stockActual: 10,
    stockMinimo: 5,
    precioCosto: 40000,
    precioVenta: 70000,
    ubicacionBodega: 'Estante M-02',
    proveedorId: 1,
    descripcion: '',
    unidadMedida: 'Unidad',
    especificacionesTecnicas: ''
  });

  const stats = useMemo(() => {
    let valorCosto = 0;
    let valorVenta = 0;
    let bajoStock = 0;
    let agotados = 0;

    repuestos.forEach(r => {
      valorCosto += r.precioCosto * r.stockActual;
      valorVenta += r.precioVenta * r.stockActual;
      if (r.stockActual <= 0) {
        agotados++;
      } else if (r.stockActual <= r.stockMinimo) {
        bajoStock++;
      }
    });

    return {
      totalItems: repuestos.length,
      valorCosto,
      valorVenta,
      bajoStock,
      agotados,
      margenBrutoEstimado: valorVenta > 0 ? ((valorVenta - valorCosto) / valorVenta) * 100 : 0
    };
  }, [repuestos]);

  const filteredRepuestos = useMemo(() => {
    return repuestos.filter(r => {
      if (filterZona !== 'todas' && r.zonaId !== filterZona) return false;
      if (filterMarca !== 'todas' && r.marcaMoto !== filterMarca) return false;
      if (filterCilindraje !== 'todos' && !r.cilindraje.includes(filterCilindraje) && r.cilindraje !== 'Universal') return false;
      if (filterAlert === 'bajo_stock' && (r.stockActual > r.stockMinimo || r.stockActual === 0)) return false;
      if (filterAlert === 'agotados' && r.stockActual > 0) return false;

      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const mSku = r.codigo.toLowerCase().includes(q);
        const mOem = r.referenciaOEM.toLowerCase().includes(q);
        const mNom = r.nombre.toLowerCase().includes(q);
        const mMod = r.modelosCompatibles.some(m => m.toLowerCase().includes(q));
        const mUbi = r.ubicacionBodega.toLowerCase().includes(q);
        const mCc = r.cilindraje.toLowerCase().includes(q);
        if (!mSku && !mOem && !mNom && !mMod && !mUbi && !mCc) return false;
      }

      return true;
    });
  }, [repuestos, filterZona, filterMarca, filterCilindraje, filterAlert, search]);

  const handleOpenAdjust = (item: Repuesto) => {
    setAdjustingItem(item);
    setNewStockValue(item.stockActual);
    setAdjustReason('Ajuste de conteo físico en bodega');
  };

  const handleConfirmAdjust = () => {
    if (!adjustingItem) return;
    onUpdateStock(adjustingItem.id, newStockValue, adjustReason);
    setAdjustingItem(null);
  };

  const handleCopyOEM = (oem: string) => {
    navigator.clipboard.writeText(oem);
    setCopiedOem(oem);
    setTimeout(() => setCopiedOem(null), 1500);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.codigo || !newForm.nombre) return;
    onAddNewRepuesto(newForm);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-4">
      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Referencias Activas</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {stats.totalItems} <span className="text-xs font-normal text-slate-500">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Catálogo multimedial activo
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Valor Total en Costo</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1 truncate">
            $ {stats.valorCosto.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Valoración contable de inventario
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Valor Potencial en Venta</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1 truncate">
            $ {stats.valorVenta.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Margen bruto aprox: {stats.margenBrutoEstimado.toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Alertas de Stock</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1 flex items-center gap-2">
            <span className="text-amber-400">{stats.bajoStock}</span>
            <span className="text-slate-600 text-sm">/</span>
            <span className="text-red-400">{stats.agotados}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.bajoStock} en reserva mín. · {stats.agotados} agotados
          </div>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS Y FILTROS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              Gestión de Stock, Precios & Referencias OEM
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredRepuestos.length} referencias filtradas)
            </span>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Nuevo Repuesto</span>
          </button>
        </div>

        {/* Filtros segmentados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-xs">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar SKU, Ref OEM, modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filtro por Zona */}
          <select
            value={filterZona}
            onChange={(e) => setFilterZona(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="todas">Todas las Zonas</option>
            {ZONAS_MOTO.map(z => (
              <option key={z.id} value={z.id}>{z.nombre}</option>
            ))}
          </select>

          {/* Filtro por Marca */}
          <select
            value={filterMarca}
            onChange={(e) => setFilterMarca(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="todas">Todas las Marcas</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Kawasaki">Kawasaki</option>
            <option value="Bajaj">Bajaj</option>
            <option value="AKT">AKT</option>
            <option value="Honda">Honda</option>
            <option value="KTM">KTM</option>
            <option value="Universal">Universal</option>
          </select>

          {/* Filtro por Cilindraje */}
          <select
            value={filterCilindraje}
            onChange={(e) => setFilterCilindraje(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="todos">Todos los Cilindrajes</option>
            <option value="100cc">100cc (Boxer / Platina)</option>
            <option value="125cc">125cc (NKD / GN / Wave)</option>
            <option value="150cc">150cc (FZ / Gixxer / XR)</option>
            <option value="190cc">190cc (CB 190R / XR 190)</option>
            <option value="200cc">200cc (Pulsar NS / Duke / TT)</option>
            <option value="250cc">250cc (Gixxer 250 / FZ 25)</option>
            <option value="321cc">321cc (MT-03 / R3)</option>
            <option value="400cc">400cc (Ninja / Z400 / Dominar)</option>
          </select>

          {/* Filtro por Alerta */}
          <select
            value={filterAlert}
            onChange={(e) => setFilterAlert(e.target.value as any)}
            className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="todos">Todos los Estados</option>
            <option value="bajo_stock">⚠️ Solo Bajo Stock</option>
            <option value="agotados">🛑 Solo Agotados (Stock 0)</option>
          </select>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE INVENTARIO */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800 text-[11px]">
                <th className="py-3 px-3">SKU / Ref OEM</th>
                <th className="py-3 px-3">Repuesto & Subparte</th>
                <th className="py-3 px-3">Marca / Cilindraje</th>
                <th className="py-3 px-3">Modelos Compatibles</th>
                <th className="py-3 px-3 text-center">Stock</th>
                <th className="py-3 px-3 text-center">Mín.</th>
                <th className="py-3 px-3 text-right">P. Costo</th>
                <th className="py-3 px-3 text-right">P. Venta</th>
                <th className="py-3 px-3">Ubicación</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRepuestos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No hay repuestos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredRepuestos.map((r) => {
                  const isZero = r.stockActual <= 0;
                  const isLow = r.stockActual <= r.stockMinimo && !isZero;
                  const isCopied = copiedOem === r.referenciaOEM;

                  return (
                    <tr 
                      key={r.id}
                      className={`hover:bg-slate-850/60 transition-colors ${
                        isZero ? 'bg-red-950/20' : isLow ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                        <div className="font-bold text-amber-400">{r.codigo}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span>OEM: {r.referenciaOEM}</span>
                          <button 
                            onClick={() => handleCopyOEM(r.referenciaOEM)}
                            title="Copiar OEM"
                            className="text-slate-500 hover:text-white"
                          >
                            {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-bold text-white leading-snug">{r.nombre}</div>
                        <div className="text-[10px] text-slate-400">{r.subparte}</div>
                        {r.especificacionesTecnicas && (
                          <div className="text-[10px] text-cyan-300 font-mono truncate" title={r.especificacionesTecnicas}>
                            {r.especificacionesTecnicas}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">{r.marcaMoto}</div>
                        <div className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-1 py-0.2 rounded inline-block">
                          {r.cilindraje}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-[11px] text-slate-300 font-mono line-clamp-2 max-w-[170px]" title={r.modelosCompatibles.join(', ')}>
                          {r.modelosCompatibles.join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{r.anoCompatibilidad}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {isZero ? (
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[11px]">
                            0 (Agotado)
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[11px] flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            {r.stockActual}
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-sm">
                            {r.stockActual}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                        {r.stockMinimo}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400 whitespace-nowrap">
                        $ {r.precioCosto.toLocaleString('es-CO')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        $ {r.precioVenta.toLocaleString('es-CO')}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {r.ubicacionBodega}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleOpenAdjust(r)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 rounded text-xs transition-colors font-medium flex items-center gap-1 mx-auto"
                        >
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>Ajustar</span>
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

      {/* MODAL DE AJUSTE RÁPIDO DE STOCK */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  Ajuste Manual de Inventario
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Genera automáticamente un movimiento registrado en el Kardex.
                </p>
              </div>
              <button onClick={() => setAdjustingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="font-mono text-amber-400 font-bold">{adjustingItem.codigo} (OEM: {adjustingItem.referenciaOEM})</div>
              <div className="text-white font-bold">{adjustingItem.nombre}</div>
              <div className="text-slate-400 text-[11px]">Stock actual en sistema: <strong className="text-white font-mono">{adjustingItem.stockActual}</strong></div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Nuevo Stock Físico Verificado:</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewStockValue(Math.max(0, newStockValue - 1))}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded font-bold hover:bg-slate-700"
                >
                  -1
                </button>
                <input
                  type="number"
                  min="0"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-center text-sm font-bold font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setNewStockValue(newStockValue + 1)}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded font-bold hover:bg-slate-700"
                >
                  +1
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Motivo / Justificación:</label>
              <input
                type="text"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Ej. Conteo físico, repuesto dañado, etc."
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjust}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Guardar y Asentar en Kardex
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR NUEVO REPUESTO */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <form 
            onSubmit={handleSaveNew}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-xl w-full shadow-2xl space-y-4 text-xs my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  Registrar Nuevo Repuesto en Catálogo
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ingrese las especificaciones técnicas para integrarlo al diagrama y al inventario.
                </p>
              </div>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Código SKU Interno:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. MOT-HON-099"
                  value={newForm.codigo}
                  onChange={(e) => setNewForm({ ...newForm, codigo: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Referencia OEM Fabricante:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 13011-KTT-900"
                  value={newForm.referenciaOEM}
                  onChange={(e) => setNewForm({ ...newForm, referenciaOEM: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Nombre Comercial del Repuesto:</label>
              <input
                type="text"
                required
                placeholder="Ej. Kit Cilindro y Pistón Racing 150cc"
                value={newForm.nombre}
                onChange={(e) => setNewForm({ ...newForm, nombre: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Marca de Moto:</label>
                <select
                  value={newForm.marcaMoto}
                  onChange={(e) => setNewForm({ ...newForm, marcaMoto: e.target.value as MarcaMoto })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Yamaha">Yamaha</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Kawasaki">Kawasaki</option>
                  <option value="Bajaj">Bajaj</option>
                  <option value="AKT">AKT</option>
                  <option value="Honda">Honda</option>
                  <option value="KTM">KTM</option>
                  <option value="Universal">Universal</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Cilindraje:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 150cc, 200cc"
                  value={newForm.cilindraje}
                  onChange={(e) => setNewForm({ ...newForm, cilindraje: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Años Compatibles:</label>
                <input
                  type="text"
                  placeholder="2016 - 2024"
                  value={newForm.anoCompatibilidad}
                  onChange={(e) => setNewForm({ ...newForm, anoCompatibilidad: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Zona de la Motocicleta:</label>
                <select
                  value={newForm.zonaId}
                  onChange={(e) => setNewForm({ ...newForm, zonaId: e.target.value as ZonaMotoId })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {ZONAS_MOTO.map(z => (
                    <option key={z.id} value={z.id}>{z.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Subparte / Sistema:</label>
                <input
                  type="text"
                  required
                  value={newForm.subparte}
                  onChange={(e) => setNewForm({ ...newForm, subparte: e.target.value })}
                  placeholder="Ej. Cadenilla y Distribución"
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Especificaciones Técnicas:</label>
              <input
                type="text"
                placeholder="Ej. Diámetro 57mm x Carrera 58.7mm, Paso 520H x 108L"
                value={newForm.especificacionesTecnicas || ''}
                onChange={(e) => setNewForm({ ...newForm, especificacionesTecnicas: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Stock Inicial:</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newForm.stockActual}
                  onChange={(e) => setNewForm({ ...newForm, stockActual: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Stock Mínimo (Alerta):</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newForm.stockMinimo}
                  onChange={(e) => setNewForm({ ...newForm, stockMinimo: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Precio Costo (COP):</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newForm.precioCosto}
                  onChange={(e) => setNewForm({ ...newForm, precioCosto: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Precio Venta (COP):</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newForm.precioVenta}
                  onChange={(e) => setNewForm({ ...newForm, precioVenta: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white font-mono text-emerald-400 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ubicación Bodega:</label>
                <input
                  type="text"
                  placeholder="Ej. Estante B-04"
                  value={newForm.ubicacionBodega}
                  onChange={(e) => setNewForm({ ...newForm, ubicacionBodega: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Proveedor Predeterminado:</label>
                <select
                  value={newForm.proveedorId}
                  onChange={(e) => setNewForm({ ...newForm, proveedorId: parseInt(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.razonSocial}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Modelos Compatibles (separados por coma):</label>
              <input
                type="text"
                placeholder="Ej. FZ 16, Fazer 2.0, R15"
                value={newForm.modelosCompatibles.join(', ')}
                onChange={(e) => setNewForm({ ...newForm, modelosCompatibles: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Guardar Repuesto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
