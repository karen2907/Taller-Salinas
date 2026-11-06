import React from 'react';
import { CreditCard, Printer, CheckCircle2, X, Wrench, ShieldCheck } from 'lucide-react';
import { FacturaVenta, TallerConfig } from '../types/workshop';

interface InvoiceModalProps {
  factura: FacturaVenta | null;
  onClose: () => void;
  tallerConfig: TallerConfig;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ 
  factura, 
  onClose,
  tallerConfig 
}) => {
  if (!factura) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 text-slate-200 text-xs">
        {/* Barra superior de confirmación */}
        <div className="p-3 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold font-mono">
              ¡VENTA FACTURADA EXITOSAMENTE! STOCK DESCONTADO EN KARDEX
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-emerald-300 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hoja de Factura POS Imprimible */}
        <div className="p-6 bg-white text-slate-900 space-y-4 print:p-0">
          {/* Encabezado del Taller con Logo */}
          <div className="flex justify-between items-start pb-4 border-b-2 border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-300 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {tallerConfig.logoUrl ? (
                  <img src={tallerConfig.logoUrl} alt="Logo" className="w-full h-full object-cover rounded" />
                ) : (
                  <Wrench className="w-7 h-7 text-amber-500" />
                )}
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight font-mono uppercase">
                  {tallerConfig.nombre}
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">
                  NIT: {tallerConfig.nit} · Factura Electrónica de Venta
                </p>
                <p className="text-[10px] text-slate-500">
                  {tallerConfig.direccion} · Tel: {tallerConfig.telefono} · {tallerConfig.ciudad}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-black text-emerald-700 font-mono">
                {factura.numero}
              </div>
              <div className="text-[11px] text-slate-500">
                Fecha & Hora: <strong>{factura.fecha}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Cajero: <strong className="font-mono">{factura.cajero}</strong>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Adquiriente / Cliente:</span>
              <div className="font-bold text-slate-900">{factura.clienteNombre}</div>
              <div className="text-slate-600 font-mono text-[11px]">C.C. / NIT: {factura.clienteDocumento || 'Consumidor Final'}</div>
              <div className="text-slate-600 text-[11px]">Tel: {factura.clienteTelefono || 'S/N'}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehículo Atendido:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-400 text-xs">
                  {factura.placaMoto || 'SIN PLACA'}
                </span>
                <span className="font-semibold text-slate-700">{factura.modeloMoto || 'N/A'}</span>
              </div>
              <div className="text-slate-600 text-[11px] mt-1">
                Método de Pago: <strong>{factura.metodoPago}</strong>
              </div>
            </div>
          </div>

          {/* Detalle de Repuestos Facturados */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold text-[11px]">
                  <th className="py-2">SKU / OEM</th>
                  <th className="py-2">Descripción del Repuesto</th>
                  <th className="py-2 text-center">Cilindraje</th>
                  <th className="py-2 text-center">Cant.</th>
                  <th className="py-2 text-right">Precio Unit.</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {factura.items.map((item) => (
                  <tr key={item.repuesto.id}>
                    <td className="py-2 font-mono text-[11px] text-slate-600">
                      <div>{item.repuesto.codigo}</div>
                      <div className="text-[10px] text-slate-500">OEM: {item.repuesto.referenciaOEM}</div>
                    </td>
                    <td className="py-2">
                      <div className="font-semibold text-slate-900">{item.repuesto.nombre}</div>
                      <div className="text-[10px] text-slate-500">{item.repuesto.marcaMoto} · Bodega: {item.repuesto.ubicacionBodega}</div>
                    </td>
                    <td className="py-2 text-center font-mono text-slate-600">{item.repuesto.cilindraje}</td>
                    <td className="py-2 text-center font-mono font-bold text-emerald-800">{item.cantidad}</td>
                    <td className="py-2 text-right font-mono text-slate-700">
                      $ {item.precioUnitario.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-slate-900">
                      $ {item.subtotal.toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Liquidación de Totales */}
          <div className="flex justify-end pt-3 border-t-2 border-slate-200">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Gravado:</span>
                <span className="font-mono font-semibold">$ {factura.subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA Discriminado (19%):</span>
                <span className="font-mono font-semibold">$ {factura.iva.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-300">
                <span>TOTAL FACTURA:</span>
                <span className="font-mono text-base text-emerald-700">$ {factura.total.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Sello de Auditoría Kardex */}
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Transacción ACID Confirmada:</strong> Se registraron automáticamente los egresos en el Kardex del taller.
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-800 text-[10px]">
              ESTADO: ASENTADO
            </span>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
