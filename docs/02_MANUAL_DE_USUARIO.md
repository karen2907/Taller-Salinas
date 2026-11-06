# MANUAL DE USUARIO
## SISTEMA MOTOGESTIÓN FX - GESTIÓN DE TALLER, INVENTARIOS Y COTIZACIONES

**Para:** Operadores, Mecánicos, Asesores de Mostrador, Bodegueros y Administradores  
**Versión de la Guía:** 2.4.0  

---

### TABLA DE CONTENIDO
1. Introducción y Filosofía del Sistema
2. Roles de Usuario y Perfiles de Acceso
3. Estructura de la Pantalla Principal
4. Uso del Diagrama Interactivo de Motocicleta
5. El Carrito Persistente: Cotizaciones vs Facturación
6. Consulta de Inventario y Alertas de Stock
7. Navegación en el Kardex y Proveedores
8. Acceso al Módulo de Administrador y Seguridad
9. Solución a Preguntas Frecuentes

---

## 1. INTRODUCCIÓN Y FILOSOFÍA DEL SISTEMA
Bienvenido a **MotoGestión FX**. Esta herramienta ha sido concebida para simplificar el trabajo diario en el taller de motocicletas. A diferencia de las hojas de cálculo tradicionales o programas genéricos, aquí encontrará la moto representada gráficamente, permitiendo que cualquier miembro del equipo identifique repuestos compatibles en segundos, prepare cotizaciones claras para los clientes y registre ventas sin errores de inventario.

---

## 2. ROLES DE USUARIO Y PERFILES DE ACCESO

El sistema distingue 5 perfiles de trabajo dentro del taller:

| Perfil | Ubicación Física Típica | Funciones Principales | Restricciones de Seguridad |
| :--- | :--- | :--- | :--- |
| **Mecánico / Técnico** | Bahía de servicio / Taller | Clic en el Diagrama de la moto para ubicar repuestos; agregar piezas al carrito para solicitar a bodega. | No puede modificar precios de costo ni cambiar configuraciones del taller. |
| **Asesor de Mostrador** | Recepción de motos | Búsqueda por placa y modelo; elaboración e impresión de Cotizaciones para aprobación del cliente. | No puede alterar el Kardex contable manualmente. |
| **Bodeguero / Almacén** | Almacén de repuestos | Recepción de Órdenes de Entrada de proveedores; devolución de piezas con defecto de fábrica; control de stock físico. | No puede acceder a configuraciones fiscales o bases de datos. |
| **Cajero** | Caja / Facturación | Cobro de órdenes de trabajo; emisión de Facturas de Venta POS; arqueo diario de caja. | No puede eliminar asientos del Kardex ni modificar el logo del taller. |
| **Administrador** | Oficina Principal | Control total: Configuración de la empresa, cambio de logo, ajuste de IVA, gestión de terminales LAN, base de datos y código. | **Requiere Contraseña Maestra (PIN) para ingresar.** |

---

## 3. ESTRUCTURA DE LA PANTALLA PRINCIPAL

Al iniciar la aplicación, la pantalla se organiza en 3 grandes áreas ergonómicas:

1. **Barra Superior (Cabecera & LAN):**
   * **Indicador de Red Local:** Muestra la IP del servidor de base de datos y el estado de la conexión (`Pool HikariCP: 15/15 Conexiones`).
   * **Selector de Terminal de Trabajo:** Identifica desde qué puesto físico se está operando (ej. `Mostrador Principal`, `Bahía Mecánicos 1`).
   * **Alerta de Stock Mínimo:** Botón ámbar que indica cuántos repuestos tienen existencia crítica.
   * **Identidad del Taller:** Logo corporativo, nombre comercial y slogan configurados por el administrador.
   * **Pestañas de Navegación:** Acceso a `Diagrama Moto HD`, `Inventario & Stock`, `Kardex`, `Proveedores` y `Módulo Administrador`.

2. **Área Central de Trabajo (Vista Activa):**
   * Muestra la pantalla seleccionada (Diagrama visual, tablas de inventario, etc.).

3. **Panel Lateral Derecho (Carrito Persistente):**
   * Siempre visible. Mantiene los repuestos que usted va seleccionando sin importar si cambia de pestaña.
   * Contiene los botones de acción inmediata: **"Generar Cotización"** y **"Facturar / Vender"**.

---

## 4. USO DEL DIAGRAMA INTERACTIVO DE MOTOCICLETA

El módulo de exploración visual es el corazón del sistema:

1. **Exploración Directa sobre la Foto:**
   * Al pasar el cursor del mouse sobre la moto deportiva (Kawasaki Ninja ZX-10RR), verá que partes como el **carenado**, la **cúpula**, las **mordazas de freno Brembo**, la **suspensión invertida**, el **motor**, el **radiador**, el **escape Akrapovic**, el **asiento** o la **cadena** se iluminan en color verde lima neón.
   * **Haga clic directamente sobre la pieza:** El sistema reconocerá la zona anatómica seleccionada al instante.

2. **Despliegue Contextual de Repuestos:**
   * Al hacer clic en una parte de la moto, la pantalla desplegará la lista de repuestos compatibles con esa sección.
   * Puede filtrar adicionalmente por:
     * **Marca de Moto:** Yamaha, Suzuki, Kawasaki, Bajaj, Honda, AKT, KTM o Universal.
     * **Cilindraje:** Desde 100cc (motos de trabajo) hasta 1000cc (superdeportivas).
     * **Buscador de texto:** Para buscar por código OEM o descripción rápida.

3. **Adición al Carrito:**
   * Seleccione la cantidad deseada usando los botones `+` y `-`.
   * Presione **"Agregar"** o el botón del carrito verde. El ítem se sumará al panel lateral derecho con una confirmación visual.

---

## 5. EL CARRITO PERSISTENTE: COTIZACIONES VS FACTURACIÓN

El panel lateral derecho permite dos operaciones comerciales distintas:

### A. Generar Cotización (Proforma)
* **¿Cuándo usarla?:** Cuando el cliente pide un presupuesto antes de autorizar la reparación de su moto.
* **Procedimiento:**
  1. Agregue los repuestos necesarios al carrito.
  2. Ingrese los datos del cliente (Nombre, Teléfono, Placa y Modelo de la moto).
  3. Presione el botón azul **"Generar Cotización"**.
  4. Se abrirá una ventana con la proforma formal con vigencia (ej. 15 días) y desglose de IVA.
  5. Puede imprimirla o entregarla al cliente.
* **Efecto en el inventario:** **NINGUNO**. Las cotizaciones NO descuentan repuestos del inventario.

### B. Facturar / Vender (Descuento de Stock)
* **¿Cuándo usarla?:** Cuando el cliente paga los repuestos o la orden de servicio está terminada.
* **Procedimiento:**
  1. Revise los ítems del carrito.
  2. Diligencie el documento del cliente y seleccione el medio de pago (Efectivo, Tarjeta, Transferencia, Crédito).
  3. Presione el botón verde **"Facturar / Vender"**.
* **Efecto en el inventario:** 
  * Se descuentan las unidades vendidas en tiempo real.
  * Se genera automáticamente el asiento contable en el **Kardex** con tipo `VENTA`.
  * Se muestra el recibo POS con código de factura para imprimir.

---

## 6. CONSULTA DE INVENTARIO Y ALERTAS DE STOCK
En la pestaña **"Inventario & Stock"**:
* Podrá ver la lista completa de todos los repuestos del taller.
* Los productos con stock menor o igual al mínimo tendrán un distintivo rojo parpadeante de **"CRÍTICO"**.
* Puede registrar nuevos repuestos con su código SKU, referencia de fabricante, costos y precios de venta.

---

## 7. NAVEGACIÓN EN EL KARDEX Y PROVEEDORES
* **Kardex:** Es la hoja de vida inmutable de las entradas y salidas de mercancía. Muestra fecha, número de documento, tipo de movimiento, cantidad, saldos y la terminal que operó el registro.
* **Proveedores & Órdenes:** Permite crear órdenes de entrada para surtir el almacén y gestionar devoluciones a distribuidores cuando una pieza llega con defecto de fábrica.

---

## 8. ACCESO AL MÓDULO DE ADMINISTRADOR Y SEGURIDAD
Por seguridad del negocio, la configuración del taller y el cambio de logo están protegidos:
1. Al hacer clic en la pestaña **"Módulo Administrador"**, se abrirá una ventana solicitando la **Contraseña Maestra**.
2. Ingrese la contraseña asignada (clave inicial de fábrica: `admin123`).
3. Al autenticarse, tendrá acceso a:
   * Cambiar el Nombre comercial, slogan, NIT y teléfonos del taller.
   * Subir un nuevo **Logo del Taller** desde su computador.
   * Configurar porcentajes de IVA, prefijos de facturas y alertas de stock.
   * Cambiar la contraseña maestra de administrador.
   * Consultar la guía de código y bases de datos.
4. Para proteger el sistema al retirarse de su puesto, presione el botón **"Bloquear / Cerrar Sesión"**.
