export type ZonaMotoId = 'motor' | 'electrico' | 'frenos_suspension' | 'mandos_guayas' | 'carenaje_chasis';

export interface ZonaMoto {
  id: ZonaMotoId;
  nombre: string;
  descripcion: string;
  icono: string;
  subpartes: string[];
}

export type MarcaMoto = 'Yamaha' | 'Suzuki' | 'Kawasaki' | 'Bajaj' | 'AKT' | 'Honda' | 'KTM' | 'TVS' | 'Hero' | 'Universal';

export interface Repuesto {
  id: number;
  codigo: string; // SKU interno taller
  referenciaOEM: string; // Número de parte / Referencia del fabricante original
  nombre: string;
  zonaId: ZonaMotoId;
  subparte: string;
  marcaMoto: MarcaMoto;
  cilindraje: string; // Ej. '125cc', '150cc', '200cc', '250cc', '400cc'
  anoCompatibilidad: string; // Ej. '2018 - 2024'
  modelosCompatibles: string[];
  stockActual: number;
  stockMinimo: number;
  precioCosto: number;
  precioVenta: number;
  ubicacionBodega: string; // Ej. "Estante M-01", "Gaveta E-04"
  proveedorId: number;
  descripcion: string;
  unidadMedida: string;
  especificacionesTecnicas?: string;
}

export interface Proveedor {
  id: number;
  nit: string;
  razonSocial: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  contactoNombre: string;
}

export type TipoMovimientoKardex = 'ENTRADA' | 'SALIDA' | 'VENTA' | 'DEVOLUCION_PROVEEDOR' | 'AJUSTE_INVENTARIO';

export interface MovimientoKardex {
  id: number;
  fecha: string;
  repuestoId: number;
  repuestoCodigo: string;
  repuestoNombre: string;
  tipo: TipoMovimientoKardex;
  cantidad: number;
  saldoAnterior: number;
  saldoPosterior: number;
  costoUnitario: number;
  precioVentaUnitario?: number;
  documentoReferencia: string; // Ej: "FAC-1004", "OC-204", "DEV-012"
  proveedorId?: number;
  proveedorNombre?: string;
  observaciones: string;
  usuarioResponsable: string;
}

export interface ItemCarrito {
  repuesto: Repuesto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cotizacion {
  numero: string;
  fecha: string;
  vencimiento: string;
  clienteNombre: string;
  clienteDocumento: string;
  clienteTelefono: string;
  placaMoto: string;
  modeloMoto: string;
  cilindrajeMoto?: string;
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  descuento: number;
  total: number;
  atendidoPor: string;
  observaciones: string;
}

export interface FacturaVenta {
  numero: string;
  fecha: string;
  clienteNombre: string;
  clienteDocumento: string;
  clienteTelefono: string;
  placaMoto: string;
  modeloMoto: string;
  cilindrajeMoto?: string;
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  descuento: number;
  total: number;
  metodoPago: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Crédito';
  cajero: string;
}

export interface OrdenCompra {
  id: number;
  numero: string;
  fecha: string;
  proveedorId: number;
  proveedorNombre: string;
  estado: 'PENDIENTE' | 'RECIBIDA_COMPLETA' | 'CANCELADA';
  total: number;
  itemsCount: number;
  fechaEntregaEstimada: string;
}

export interface TerminalLAN {
  id: string;
  nombre: string;
  ip: string;
  rol: string;
  activa: boolean;
}

export interface DiagramaConfig {
  mostrarLineasGuia: boolean;
  modoSiluetaGlow: boolean;
  sensibilidadRadioClic: number; // Porcentaje de tolerancia
  autoDespliegueRepuestos: boolean;
  modeloPredeterminado: string;
}

export interface ModulosConfig {
  inventarioAlertaStockGlobal: number;
  inventarioPermitirVentaSinStock: boolean;
  facturacionIvaPorcentaje: number;
  facturacionPrefijo: string;
  cotizacionPrefijo: string;
  cotizacionDiasVigencia: number;
  terminosCotizacion: string;
  pieFactura: string;
  dbMotorPredeterminado: 'sqlite' | 'lan_postgres' | 'neon_cloud' | 'supabase_cloud';
}

export interface TallerConfig {
  nombre: string;
  slogan: string;
  nit: string;
  direccion: string;
  telefono: string;
  correo: string;
  ciudad: string;
  logoUrl: string;
  logoMarcaAgua: boolean;
  adminPassword?: string;
  diagrama?: DiagramaConfig;
  modulos?: ModulosConfig;
}
