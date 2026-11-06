import React from 'react';
import { FileText, Printer, X, Wrench, ShieldAlert } from 'lucide-react';
import { Cotizacion, TallerConfig } from '../types/workshop';

interface QuotationModalProps {
  cotizacion: Cotizacion | null;
  onClose: () => void;
  tallerConfig: TallerConfig;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ 
  cotizacion, 
  onClose,
  tallerConfig 
}) => {
  if (!cotizacion) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 text-slate-200 text-xs">
        {/* Barra superior de acciones */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white font-mono">
              DOCUMENTO DE COTIZACIÓN PREVENTIVA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hoja de Cotización Imprimible */}
        <div className="p-6 bg-white text-slate-900 space-y-5 print:p-0">
          {/* Encabezado del Taller con Logo */}
          <div className="flex justify-between items-start pb-4 border-b-2 border-slate-200">
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
                  NIT: {tallerConfig.nit} · {tallerConfig.ciudad}
                </p>
                <p className="text-[10px] text-slate-500">
                  {tallerConfig.direccion} · Tel: {tallerConfig.telefono} · {tallerConfig.correo}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-black text-sky-700 font-mono">
                {cotizacion.numero}
              </div>
              <div className="text-[11px] text-slate-500">
                Fecha Emisión: <strong>{cotizacion.fecha}</strong>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">
                Válido hasta: {cotizacion.vencimiento} (15 días)
              </div>
            </div>
          </div>

          {/* Datos del Cliente y la Motocicleta */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Datos del Cliente:</span>
              <div className="font-bold text-slate-900">{cotizacion.clienteNombre || 'Cliente Mostrador'}</div>
              <div className="text-slate-600 font-mono text-[11px]">C.C. / NIT: {cotizacion.clienteDocumento || 'S/N'}</div>
              <div className="text-slate-600 text-[11px]">Tel: {cotizacion.clienteTelefono || 'S/N'}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehículo / Motocicleta:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-400 text-xs">
                  {cotizacion.placaMoto || 'SIN PLACA'}
                </span>
                <span className="font-semibold text-slate-700">{cotizacion.modeloMoto || 'Modelo no especificado'}</span>
              </div>
              <div className="text-slate-500 text-[11px] mt-1">Asesor: {cotizacion.atendidoPor}</div>
            </div>
          </div>

          {/* Tabla de Repuestos Cotizados */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold text-[11px]">
                  <th className="py-2">Código / OEM</th>
                  <th className="py-2">Descripción del Repuesto</th>
                  <th className="py-2 text-center">Cilindraje</th>
                  <th className="py-2 text-center">Cant.</th>
                  <th className="py-2 text-right">Precio Unit.</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cotizacion.items.map((item) => (
                  <tr key={item.repuesto.id}>
                    <td className="py-2 font-mono text-[11px] text-slate-600">
                      <div>{item.repuesto.codigo}</div>
                      <div className="text-[10px] text-slate-500">OEM: {item.repuesto.referenciaOEM}</div>
                    </td>
                    <td className="py-2">
                      <div className="font-semibold text-slate-900">{item.repuesto.nombre}</div>
                      <div className="text-[10px] text-slate-500">{item.repuesto.marcaMoto} · {item.repuesto.subparte}</div>
                    </td>
                    <td className="py-2 text-center font-mono text-slate-600">{item.repuesto.cilindraje}</td>
                    <td className="py-2 text-center font-mono font-semibold">{item.cantidad}</td>
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

          {/* Totales */}
          <div className="flex justify-end pt-3 border-t-2 border-slate-200">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Repuestos:</span>
                <span className="font-mono font-semibold">$ {cotizacion.subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA (19%):</span>
                <span className="font-mono font-semibold">$ {cotizacion.iva.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-300">
                <span>TOTAL ESTIMADO:</span>
                <span className="font-mono text-base text-sky-800">$ {cotizacion.total.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Nota Legal importante */}
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Nota Importante:</strong> Esta cotización tiene vigencia de 15 días calendario. 
              <strong> NO reserva ni descuenta existencias de inventario</strong> hasta que el cliente autorice la orden y se genere la factura correspondiente.
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-xs"
          >
            Cerrar Cotización
          </button>
        </div>
      </div>
    </div>
  );
};
