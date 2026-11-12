import React, { useState, useMemo, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { MotorcycleExplorer } from './components/MotorcycleExplorer';
import { CartSidebar, ClienteInfo } from './components/CartSidebar';
import { InventoryManager } from './components/InventoryManager';
import { KardexView } from './components/KardexView';
import { SuppliersAndOrders } from './components/SuppliersAndOrders';
import { InvoicesTraceability } from './components/InvoicesTraceability';
import { MotorcycleManualsManager } from './components/MotorcycleManualsManager';
import { JavaArchitectureExplorer } from './components/JavaArchitectureExplorer';
import { AdminModule } from './components/AdminModule';
import { QuotationModal } from './components/QuotationModal';
import { InvoiceModal } from './components/InvoiceModal';
import { WorkshopBrandingModal } from './components/WorkshopBrandingModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { TerminalInfoModal } from './components/TerminalInfoModal';
import { DocumentationModal } from './components/DocumentationModal';
import { AutoUpdaterModal } from './components/AutoUpdaterModal';

import { 
  REPUESTOS_INICIALES, 
  PROVEEDORES_INICIALES, 
  KARDEX_INICIAL, 
  ORDENES_COMPRA_INICIALES, 
  TERMINALES_LAN,
  TALLER_CONFIG_INICIAL,
  FACTURAS_INICIALES,
  MANUALES_MOTO_INICIALES
} from './data/initialData';

import { 
  Repuesto, 
  Proveedor, 
  MovimientoKardex, 
  OrdenCompra, 
  ItemCarrito, 
  Cotizacion, 
  FacturaVenta,
  MotoManual,
  TallerConfig
} from './types/workshop';

export default function App() {
  // Configuración de Identidad y Marca del Taller
  const [tallerConfig, setTallerConfig] = useState<TallerConfig>(() => {
    try {
      const saved = localStorage.getItem('mototaller_config');
      return saved ? JSON.parse(saved) : TALLER_CONFIG_INICIAL;
    } catch {
      return TALLER_CONFIG_INICIAL;
    }
  });
  const [showBrandingModal, setShowBrandingModal] = useState<boolean>(false);

  const handleSaveBranding = (nuevaConfig: TallerConfig) => {
    setTallerConfig(nuevaConfig);
    try {
      localStorage.setItem('mototaller_config', JSON.stringify(nuevaConfig));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  };

  // Estado Global del Sistema
  const [activeTab, setActiveTab] = useState<NavTab>('explorador');
  
  // Seguridad y Autenticación del Módulo Administrador
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);
  const [showTerminalInfoModal, setShowTerminalInfoModal] = useState<boolean>(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState<boolean>(false);

  // Versión del Sistema y Módulo CI/CD Auto-Updater
  const [appVersion, setAppVersion] = useState<string>(() => {
    return localStorage.getItem('mototaller_app_version') || '1.0.0';
  });
  const [showAutoUpdaterModal, setShowAutoUpdaterModal] = useState<boolean>(false);
  const [updateToast, setUpdateToast] = useState<{ show: boolean; version: string; notes: string } | null>(null);

  const handleApplyNewVersion = (newVersion: string, releaseNotes: string) => {
    setAppVersion(newVersion);
    try {
      localStorage.setItem('mototaller_app_version', newVersion);
    } catch (e) {
      console.warn('No se pudo guardar la versión:', e);
    }
    setUpdateToast({
      show: true,
      version: newVersion,
      notes: releaseNotes
    });
    setTimeout(() => {
      setUpdateToast(null);
    }, 6000);
  };

  const [repuestos, setRepuestos] = useState<Repuesto[]>(REPUESTOS_INICIALES);
  const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_INICIALES);
  const [kardex, setKardex] = useState<MovimientoKardex[]>(KARDEX_INICIAL);
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>(ORDENES_COMPRA_INICIALES);
  const [terminales, setTerminales] = useState(TERMINALES_LAN);
  const [terminalActual, setTerminalActual] = useState<string>('TERM-01');

  // Estado de Facturas para Trazabilidad
  const [facturas, setFacturas] = useState<FacturaVenta[]>(() => {
    try {
      const saved = localStorage.getItem('mototaller_facturas');
      return saved ? JSON.parse(saved) : FACTURAS_INICIALES;
    } catch {
      return FACTURAS_INICIALES;
    }
  });

  // Estado de Biblioteca de Manuales Técnicos de Motos en PDF
  const [manualesMoto, setManualesMoto] = useState<MotoManual[]>(() => {
    try {
      const saved = localStorage.getItem('mototaller_manuales_moto');
      return saved ? JSON.parse(saved) : MANUALES_MOTO_INICIALES;
    } catch {
      return MANUALES_MOTO_INICIALES;
    }
  });

  // Estado del Carrito Flotante Desplegable
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modales de Documentos
  const [cotizacionModal, setCotizacionModal] = useState<Cotizacion | null>(null);
  const [facturaModal, setFacturaModal] = useState<FacturaVenta | null>(null);

  // Conteo de repuestos en bajo stock
  const lowStockCount = useMemo(() => {
    return repuestos.filter(r => r.stockActual <= r.stockMinimo).length;
  }, [repuestos]);

  // Terminal activa info
  const currentTerminalObj = useMemo(() => {
    return terminales.find(t => t.id === terminalActual) || terminales[0];
  }, [terminales, terminalActual]);

  // --------------------------------------------------------------------------
  // LÓGICA DEL CARRITO PERSISTENTE
  // --------------------------------------------------------------------------
  const handleAddToCart = (repuesto: Repuesto, cantidad: number) => {
    setCarrito(prev => {
      const existingIndex = prev.findIndex(item => item.repuesto.id === repuesto.id);
      if (existingIndex >= 0) {
        const item = prev[existingIndex];
        const nuevaCant = Math.min(repuesto.stockActual, item.cantidad + cantidad);
        const updated = [...prev];
        updated[existingIndex] = {
          ...item,
          cantidad: nuevaCant,
          subtotal: nuevaCant * item.precioUnitario
        };
        return updated;
      } else {
        const cantToAdd = Math.min(repuesto.stockActual, Math.max(1, cantidad));
        return [
          ...prev,
          {
            repuesto,
            cantidad: cantToAdd,
            precioUnitario: repuesto.precioVenta,
            subtotal: cantToAdd * repuesto.precioVenta
          }
        ];
      }
    });

    // Desplegar suavemente el panel para mostrar al usuario la pieza agregada
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (repuestoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      handleRemoveItem(repuestoId);
      return;
    }
    setCarrito(prev => prev.map(item => {
      if (item.repuesto.id === repuestoId) {
        const realQty = Math.min(item.repuesto.stockActual, nuevaCantidad);
        return {
          ...item,
          cantidad: realQty,
          subtotal: realQty * item.precioUnitario
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (repuestoId: number) => {
    setCarrito(prev => prev.filter(item => item.repuesto.id !== repuestoId));
  };

  const handleClearCart = () => {
    setCarrito([]);
  };

  // --------------------------------------------------------------------------
  // GENERAR COTIZACIÓN (NO MODIFICA INVENTARIO)
  // --------------------------------------------------------------------------
  const handleGenerarCotizacion = (clienteInfo: ClienteInfo) => {
    if (carrito.length === 0) return;

    const subtotal = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    const now = new Date();
    const expire = new Date();
    expire.setDate(now.getDate() + (tallerConfig.modulos?.cotizacionDiasVigencia || 15));

    const formatDt = (d: Date) => d.toISOString().slice(0, 10);

    const nuevaCotizacion: Cotizacion = {
      numero: `${tallerConfig.modulos?.cotizacionPrefijo || 'COT-'}2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: formatDt(now),
      vencimiento: formatDt(expire),
      clienteNombre: clienteInfo.nombre || 'Cliente Particular',
      clienteDocumento: clienteInfo.documento,
      clienteTelefono: clienteInfo.telefono,
      placaMoto: clienteInfo.placa,
      modeloMoto: clienteInfo.modelo,
      items: [...carrito],
      subtotal,
      iva,
      descuento: 0,
      total,
      atendidoPor: currentTerminalObj.nombre,
      observaciones: clienteInfo.observaciones
    };

    setCotizacionModal(nuevaCotizacion);
    setCarrito([]);
    setIsCartOpen(false);
  };

  // --------------------------------------------------------------------------
  // FACTURAR / VENDER (DESCUENTA STOCK EN TIEMPO REAL, REGISTRA KARDEX Y FACTURA)
  // --------------------------------------------------------------------------
  const handleFacturarVenta = (clienteInfo: ClienteInfo) => {
    if (carrito.length === 0) return;

    // 1. Validar existencias
    for (const item of carrito) {
      const rep = repuestos.find(r => r.id === item.repuesto.id);
      if (!rep || rep.stockActual < item.cantidad) {
        alert(`Error de Stock: ${item.repuesto.nombre} tiene solo ${rep?.stockActual || 0} disponibles.`);
        return;
      }
    }

    const facturaNum = `${tallerConfig.modulos?.facturacionPrefijo || 'FV-'}2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // 2. Descontar stock
    const updatedRepuestos = repuestos.map(r => {
      const enCarrito = carrito.find(c => c.repuesto.id === r.id);
      if (enCarrito) {
        return {
          ...r,
          stockActual: r.stockActual - enCarrito.cantidad
        };
      }
      return r;
    });

    // 3. Crear asientos en el Kardex para cada ítem vendido
    const nuevosMovimientosKardex: MovimientoKardex[] = carrito.map((cItem, idx) => {
      const original = repuestos.find(r => r.id === cItem.repuesto.id)!;
      return {
        id: Date.now() + idx,
        fecha: nowStr,
        repuestoId: original.id,
        repuestoCodigo: original.codigo,
        repuestoNombre: original.nombre,
        tipo: 'VENTA',
        cantidad: cItem.cantidad,
        saldoAnterior: original.stockActual,
        saldoPosterior: original.stockActual - cItem.cantidad,
        costoUnitario: original.precioCosto,
        precioVentaUnitario: cItem.precioUnitario,
        documentoReferencia: facturaNum,
        observaciones: `Venta mostrador - Moto: ${clienteInfo.placa} (${clienteInfo.modelo})`,
        usuarioResponsable: currentTerminalObj.nombre
      };
    });

    // 4. Crear documento de Factura para imprimir y trazabilidad
    const subtotal = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    const nuevaFactura: FacturaVenta = {
      numero: facturaNum,
      fecha: nowStr,
      clienteNombre: clienteInfo.nombre || 'Consumidor Final',
      clienteDocumento: clienteInfo.documento,
      clienteTelefono: clienteInfo.telefono,
      placaMoto: clienteInfo.placa,
      modeloMoto: clienteInfo.modelo,
      items: [...carrito],
      subtotal,
      iva,
      descuento: 0,
      total,
      metodoPago: clienteInfo.metodoPago,
      cajero: currentTerminalObj.nombre
    };

    // 5. Actualizar estados
    setRepuestos(updatedRepuestos);
    setKardex(prev => [...nuevosMovimientosKardex, ...prev]);
    setFacturas(prev => {
      const updated = [nuevaFactura, ...prev];
      try {
        localStorage.setItem('mototaller_facturas', JSON.stringify(updated));
      } catch (e) {
        console.warn('No se pudo guardar factura en storage:', e);
      }
      return updated;
    });

    setFacturaModal(nuevaFactura);
    setCarrito([]);
    setIsCartOpen(false);
  };

  // --------------------------------------------------------------------------
  // AJUSTE MANUAL DE STOCK DESDE INVENTARIO
  // --------------------------------------------------------------------------
  const handleUpdateStockManual = (repuestoId: number, nuevoStock: number, motivo: string) => {
    const item = repuestos.find(r => r.id === repuestoId);
    if (!item) return;

    const saldoAnterior = item.stockActual;
    const diff = nuevoStock - saldoAnterior;
    if (diff === 0) return;

    setRepuestos(prev => prev.map(r => r.id === repuestoId ? { ...r, stockActual: nuevoStock } : r));

    const nuevoMovimiento: MovimientoKardex = {
      id: Date.now(),
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      repuestoId: item.id,
      repuestoCodigo: item.codigo,
      repuestoNombre: item.nombre,
      tipo: 'AJUSTE_INVENTARIO',
      cantidad: Math.abs(diff),
      saldoAnterior,
      saldoPosterior: nuevoStock,
      costoUnitario: item.precioCosto,
      documentoReferencia: `AJU-${Math.floor(100 + Math.random() * 900)}`,
      observaciones: motivo || 'Ajuste físico en bodega',
      usuarioResponsable: currentTerminalObj.nombre
    };

    setKardex(prev => [nuevoMovimiento, ...prev]);
  };

  // --------------------------------------------------------------------------
  // REGISTRAR NUEVO REPUESTO
  // --------------------------------------------------------------------------
  const handleAddNewRepuesto = (nuevo: Omit<Repuesto, 'id'>) => {
    const newId = repuestos.length > 0 ? Math.max(...repuestos.map(r => r.id)) + 1 : 1;
    const repuestoCompleto: Repuesto = { ...nuevo, id: newId };
    setRepuestos(prev => [repuestoCompleto, ...prev]);

    if (nuevo.stockActual > 0) {
      const mov: MovimientoKardex = {
        id: Date.now(),
        fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
        repuestoId: newId,
        repuestoCodigo: nuevo.codigo,
        repuestoNombre: nuevo.nombre,
        tipo: 'ENTRADA',
        cantidad: nuevo.stockActual,
        saldoAnterior: 0,
        saldoPosterior: nuevo.stockActual,
        costoUnitario: nuevo.precioCosto,
        documentoReferencia: 'CARGA-INICIAL',
        proveedorId: nuevo.proveedorId,
        observaciones: `Creación de referencia en catálogo (${nuevo.referenciaOEM}) y carga inicial`,
        usuarioResponsable: currentTerminalObj.nombre
      };
      setKardex(prev => [mov, ...prev]);
    }
  };

  // --------------------------------------------------------------------------
  // REGISTRAR NUEVO PROVEEDOR
  // --------------------------------------------------------------------------
  const handleAddNewProveedor = (prov: Omit<Proveedor, 'id'>) => {
    const newId = proveedores.length > 0 ? Math.max(...proveedores.map(p => p.id)) + 1 : 1;
    setProveedores(prev => [...prev, { ...prov, id: newId }]);
  };

  // --------------------------------------------------------------------------
  // CREAR ORDEN DE COMPRA (PUNTO 2)
  // --------------------------------------------------------------------------
  const handleCrearOrdenCompra = (nuevaOrden: Omit<OrdenCompra, 'id'>) => {
    const newId = ordenesCompra.length > 0 ? Math.max(...ordenesCompra.map(o => o.id)) + 1 : 1;
    const fullOrden: OrdenCompra = { ...nuevaOrden, id: newId };
    setOrdenesCompra(prev => [fullOrden, ...prev]);
  };

  // --------------------------------------------------------------------------
  // ORDEN DE ENTRADA / RECEPCIÓN (+ STOCK Y KARDEX CON ORDEN DE COMPRA ASOCIADA)
  // --------------------------------------------------------------------------
  const handleCrearOrdenEntrada = (orden: {
    proveedorId: number;
    repuestoId: number;
    cantidad: number;
    costoUnitario: number;
    docRemision: string;
    observacion: string;
    ordenCompraId?: number;
  }) => {
    const rep = repuestos.find(r => r.id === orden.repuestoId);
    if (!rep) return;

    const saldoAnterior = rep.stockActual;
    const saldoPosterior = saldoAnterior + orden.cantidad;

    // 1. Actualizar el stock del repuesto inmediatamente
    setRepuestos(prev => prev.map(r => r.id === orden.repuestoId ? {
      ...r,
      stockActual: saldoPosterior,
      precioCosto: orden.costoUnitario
    } : r));

    const prov = proveedores.find(p => p.id === orden.proveedorId);

    // 2. Insertar movimiento de ENTRADA en el Kardex
    const movKardex: MovimientoKardex = {
      id: Date.now(),
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      repuestoId: rep.id,
      repuestoCodigo: rep.codigo,
      repuestoNombre: rep.nombre,
      tipo: 'ENTRADA',
      cantidad: orden.cantidad,
      saldoAnterior,
      saldoPosterior,
      costoUnitario: orden.costoUnitario,
      documentoReferencia: orden.docRemision,
      proveedorId: orden.proveedorId,
      proveedorNombre: prov?.razonSocial,
      observaciones: orden.observacion,
      usuarioResponsable: currentTerminalObj.nombre
    };

    setKardex(prev => [movKardex, ...prev]);

    // 3. Si se relacionó una orden de compra, actualizar sus cantidades recibidas y estado
    if (orden.ordenCompraId) {
      setOrdenesCompra(prev => prev.map(oc => {
        if (oc.id === orden.ordenCompraId) {
          const updatedItems = oc.items ? oc.items.map(it => {
            if (it.repuestoId === orden.repuestoId) {
              const rec = (it.cantidadRecibida || 0) + orden.cantidad;
              return { ...it, cantidadRecibida: rec };
            }
            return it;
          }) : [];
          return {
            ...oc,
            items: updatedItems,
            estado: 'RECIBIDA_COMPLETA' as const
          };
        }
        return oc;
      }));
    }
  };

  // --------------------------------------------------------------------------
  // DEVOLUCIÓN A PROVEEDOR POR DEFECTO
  // --------------------------------------------------------------------------
  const handleRegistrarDevolucion = (dev: {
    proveedorId: number;
    repuestoId: number;
    cantidad: number;
    docReferencia: string;
    motivoDefecto: string;
  }) => {
    const rep = repuestos.find(r => r.id === dev.repuestoId);
    if (!rep) return;

    if (rep.stockActual < dev.cantidad) {
      alert(`No es posible devolver ${dev.cantidad} unidades. Stock disponible: ${rep.stockActual}`);
      return;
    }

    const saldoAnterior = rep.stockActual;
    const saldoPosterior = saldoAnterior - dev.cantidad;

    setRepuestos(prev => prev.map(r => r.id === dev.repuestoId ? {
      ...r,
      stockActual: saldoPosterior
    } : r));

    const prov = proveedores.find(p => p.id === dev.proveedorId);

    const movKardex: MovimientoKardex = {
      id: Date.now(),
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      repuestoId: rep.id,
      repuestoCodigo: rep.codigo,
      repuestoNombre: rep.nombre,
      tipo: 'DEVOLUCION_PROVEEDOR',
      cantidad: dev.cantidad,
      saldoAnterior,
      saldoPosterior,
      costoUnitario: rep.precioCosto,
      documentoReferencia: dev.docReferencia,
      proveedorId: dev.proveedorId,
      proveedorNombre: prov?.razonSocial,
      observaciones: `Devolución por defecto de fábrica: ${dev.motivoDefecto}`,
      usuarioResponsable: currentTerminalObj.nombre
    };

    setKardex(prev => [movKardex, ...prev]);
  };

  // --------------------------------------------------------------------------
  // GESTIÓN DE MANUALES DE MOTOS EN PDF (PUNTO 6 Y 7)
  // --------------------------------------------------------------------------
  const handleAddMotoManual = (nuevoManual: MotoManual) => {
    setManualesMoto(prev => {
      const updated = [nuevoManual, ...prev];
      try {
        localStorage.setItem('mototaller_manuales_moto', JSON.stringify(updated));
      } catch (e) {
        console.warn('No se pudo guardar manual en storage:', e);
      }
      return updated;
    });
  };

  const handleDeleteMotoManual = (manualId: string) => {
    setManualesMoto(prev => {
      const updated = prev.filter(m => m.id !== manualId);
      try {
        localStorage.setItem('mototaller_manuales_moto', JSON.stringify(updated));
      } catch (e) {
        console.warn('No se pudo guardar manual en storage:', e);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra de cabecera con navegación limpia */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={carrito.reduce((sum, i) => sum + i.cantidad, 0)}
        lowStockCount={lowStockCount}
        terminales={terminales}
        terminalActual={terminalActual}
        setTerminalActual={setTerminalActual}
        onOpenCartMobile={() => setIsCartOpen(prev => !prev)}
        tallerConfig={tallerConfig}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminAuth={() => setShowAdminAuthModal(true)}
        onLogoutAdmin={() => {
          setIsAdminAuthenticated(false);
          if (activeTab === 'admin') setActiveTab('explorador');
        }}
      />

      {/* Contenido Principal con Ancho Completo */}
      <main className="flex-1 p-4 max-w-[1720px] w-full mx-auto">
        <div className="w-full">
          {activeTab === 'explorador' && (
            <MotorcycleExplorer
              repuestos={repuestos}
              onAddToCart={handleAddToCart}
              tallerConfig={tallerConfig}
            />
          )}

          {activeTab === 'inventario' && (
            <InventoryManager
              repuestos={repuestos}
              proveedores={proveedores}
              onUpdateStock={handleUpdateStockManual}
              onAddNewRepuesto={handleAddNewRepuesto}
            />
          )}

          {activeTab === 'kardex' && (
            <KardexView
              movimientos={kardex}
              repuestos={repuestos}
              proveedores={proveedores}
            />
          )}

          {activeTab === 'proveedores' && (
            <SuppliersAndOrders
              proveedores={proveedores}
              ordenesCompra={ordenesCompra}
              repuestos={repuestos}
              onAddNewProveedor={handleAddNewProveedor}
              onCrearOrdenEntrada={handleCrearOrdenEntrada}
              onCrearOrdenCompra={handleCrearOrdenCompra}
              onRegistrarDevolucion={handleRegistrarDevolucion}
            />
          )}

          {activeTab === 'facturas' && (
            <InvoicesTraceability
              facturas={facturas}
              onVerFactura={(fac) => setFacturaModal(fac)}
              tallerConfig={tallerConfig}
            />
          )}

          {activeTab === 'manuales_moto' && (
            <MotorcycleManualsManager
              manuales={manualesMoto}
              onAddManual={handleAddMotoManual}
              onDeleteManual={handleDeleteMotoManual}
              isAdmin={isAdminAuthenticated}
              onOpenAdminAuth={() => setShowAdminAuthModal(true)}
            />
          )}

          {activeTab === 'admin' && (
            isAdminAuthenticated ? (
              <AdminModule
                tallerConfig={tallerConfig}
                onSaveConfig={handleSaveBranding}
                terminales={terminales}
                setTerminales={setTerminales}
                repuestos={repuestos}
                proveedores={proveedores}
                kardex={kardex}
                onResetFactoryData={() => {
                  setRepuestos(REPUESTOS_INICIALES);
                  setProveedores(PROVEEDORES_INICIALES);
                  setKardex(KARDEX_INICIAL);
                  setOrdenesCompra(ORDENES_COMPRA_INICIALES);
                  setTerminales(TERMINALES_LAN);
                  setFacturas(FACTURAS_INICIALES);
                  setManualesMoto(MANUALES_MOTO_INICIALES);
                  handleSaveBranding(TALLER_CONFIG_INICIAL);
                }}
                onLogoutAdmin={() => {
                  setIsAdminAuthenticated(false);
                  setActiveTab('explorador');
                }}
                currentAppVersion={appVersion}
                onApplyNewVersion={handleApplyNewVersion}
                onOpenDocModal={() => setShowDocumentationModal(true)}
                onOpenTerminalInfoModal={() => setShowTerminalInfoModal(true)}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center text-3xl font-black">
                  🔒
                </div>
                <h3 className="text-lg font-bold text-white">Módulo de Administrador Protegido</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Este panel contiene configuraciones sensibles, logo del taller, credenciales fiscales, centro de documentación oficial (Word/PDF), auto-update y código fuente. Ingrese la contraseña maestra para continuar.
                </p>
                <button
                  onClick={() => setShowAdminAuthModal(true)}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  Ingresar Contraseña de Administrador
                </button>
              </div>
            )
          )}

          {activeTab === 'arquitectura' && (
            <JavaArchitectureExplorer />
          )}
        </div>
      </main>

      {/* Carrito Flotante y Desplegable (PUNTO 4) */}
      <CartSidebar
        carrito={carrito}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onGenerarCotizacion={handleGenerarCotizacion}
        onFacturarVenta={handleFacturarVenta}
        isOpen={isCartOpen}
        onToggleOpen={() => setIsCartOpen(prev => !prev)}
      />

      {/* Modal de Cotización */}
      <QuotationModal
        cotizacion={cotizacionModal}
        onClose={() => setCotizacionModal(null)}
        tallerConfig={tallerConfig}
      />

      {/* Modal de Factura POS */}
      <InvoiceModal
        factura={facturaModal}
        onClose={() => setFacturaModal(null)}
        tallerConfig={tallerConfig}
      />

      {/* Modal de Autenticación de Administrador */}
      <AdminAuthModal
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setShowAdminAuthModal(false);
          setActiveTab('admin');
        }}
        correctPassword={tallerConfig.adminPassword || 'admin123'}
      />

      {/* Modal Informativo: Para qué se usa el Terminal de Trabajo (Exclusivo Admin) */}
      <TerminalInfoModal
        isOpen={showTerminalInfoModal}
        onClose={() => setShowTerminalInfoModal(false)}
        terminales={terminales}
        terminalActual={terminalActual}
      />

      {/* Modal de Configuración y Logo del Taller */}
      <WorkshopBrandingModal
        config={tallerConfig}
        isOpen={showBrandingModal}
        onClose={() => setShowBrandingModal(false)}
        onSave={handleSaveBranding}
      />

      {/* Modal de Documentación y Manuales Oficiales (Word / PDF) */}
      <DocumentationModal
        isOpen={showDocumentationModal}
        onClose={() => setShowDocumentationModal(false)}
        tallerConfig={tallerConfig}
      />

      {/* Modal de Auto-Updater & Despliegue CI/CD */}
      <AutoUpdaterModal
        isOpen={showAutoUpdaterModal}
        onClose={() => setShowAutoUpdaterModal(false)}
        currentAppVersion={appVersion}
        onApplyNewVersion={handleApplyNewVersion}
        onOpenDocModal={() => setShowDocumentationModal(true)}
      />

      {/* Notificación Flotante de Actualización Aplicada con Éxito */}
      {updateToast && updateToast.show && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-xl">🚀</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ¡Actualización Exitosa!
                </span>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  v{updateToast.version}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {updateToast.notes || 'El ejecutable ha aplicado la nueva versión desde GitHub Releases manteniendo la base de datos intacta.'}
              </p>
            </div>
            <button
              onClick={() => setUpdateToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
