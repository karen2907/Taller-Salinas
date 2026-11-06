# MANUAL DE USO OPERATIVO DÍA A DÍA
## SISTEMA MOTOGESTIÓN FX - GUÍA DE PROCEDIMIENTOS ESTÁNDAR (SOP)

**Para:** Operación Diaria en Recepción, Bahía de Mecánica, Almacén y Caja  
**Versión:** 2.4.0  

---

### TABLA DE CONTENIDO
1. Flujo Operativo 1: Recepción de Motocicleta y Creación de Cotización
2. Flujo Operativo 2: Identificación Técnica Visual por el Mecánico (Diagrama HD)
3. Flujo Operativo 3: Facturación POS y Cierre de Venta
4. Flujo Operativo 4: Recepción de Repuestos por Orden de Entrada
5. Flujo Operativo 5: Devolución de Repuestos con Defecto de Fábrica a Proveedor
6. Flujo Operativo 6: Auditoría de Inventario y Conteo Físico en Kardex
7. Flujo Operativo 7: Cambio y Selección de Terminal de Trabajo

---

## 1. FLUJO OPERATIVO 1: RECEPCIÓN DE MOTOCICLETA Y COTIZACIÓN

**Objetivo:** Elaborar un presupuesto detallado para un cliente sin alterar el stock del almacén.

### Paso a Paso:
1. **Identificar la moto del cliente:** Solicite la marca (ej. Yamaha), modelo (ej. MT-09) y cilindraje (ej. 850cc), junto con la placa.
2. **Seleccionar los repuestos necesarios:**
   * Ingrese a la pestaña **"Diagrama Moto HD"** o a **"Inventario & Stock"**.
   * Localice las piezas a cotizar (ej. Kit de arrastre, pastillas de freno Brembo, aceite sintético).
   * Especifique la cantidad requerida en cada ítem y presione **"Agregar"**.
3. **Verificar el Carrito Lateral:**
   * En el panel derecho, confirme que las cantidades y precios unitarios sean correctos.
4. **Completar los datos del cliente:**
   * En la sección inferior del carrito, ingrese el nombre del cliente, teléfono celular, placa y modelo de la moto.
5. **Generar la Cotización:**
   * Haga clic en el botón azul **"Generar Cotización"**.
   * Se abrirá la ventana con el documento proforma formal con numeración consecutiva (ej. `COT-00104`).
   * La proforma detalla subtotales, IVA (19%), total y fecha límite de validez (15 días).
   * Imprima el comprobante o comparta el resumen con el cliente.
6. **Resultado:** La cotización queda registrada sin haber descontado una sola unidad física del inventario.

---

## 2. FLUJO OPERATIVO 2: IDENTIFICACIÓN TÉCNICA VISUAL POR EL MECÁNICO

**Objetivo:** Permitir que el mecánico en el taller encuentre la referencia exacta de un repuesto desgastado sin tener que buscar códigos manuales.

### Paso a Paso:
1. **Abrir el Diagrama Interactivo:**
   * Ingrese a la pestaña **"Diagrama Moto HD"**.
2. **Hacer clic en la zona anatómica averiada:**
   * Si la moto tiene un ruido en el motor: haga clic en el bloque del **Motor**.
   * Si presenta desgaste en la frenada: haga clic en las **Mordazas / Discos de Freno**.
   * Si requiere suspensión: haga clic en la **Horquilla Invertida** o en el **Monoshock**.
3. **Explorar las subpartes y marcas compatibles:**
   * El sistema desplegará de inmediato la lista de repuestos correspondientes.
   * Seleccione la marca de la moto en el selector (ej. Bajaj o Suzuki) y el cilindraje.
4. **Verificar disponibilidad física:**
   * Compruebe la columna **Stock**. Si el número aparece en verde, hay existencia suficiente en bodega.
   * Si el stock es 0 o está en rojo, solicite la pieza a compras de inmediato.
5. **Solicitar a Bodega:**
   * Presione **"Agregar al Carrito"** para que el almacén prepare los repuestos.

---

## 3. FLUJO OPERATIVO 3: FACTURACIÓN POS Y CIERRE DE VENTA

**Objetivo:** Registrar el pago del cliente, entregar la factura formal y descargar las piezas del inventario físico.

### Paso a Paso:
1. **Revisión final de ítems:** Confirme con el cliente o la orden de servicio que todos los repuestos y aceites estén cargados en el carrito lateral.
2. **Datos de facturación:**
   * Ingrese el Nombre o Razón Social y Cédula/NIT del cliente.
   * Seleccione el método de pago:
     * *Efectivo*
     * *Transferencia (Nequi / Daviplata / Bancolombia)*
     * *Tarjeta Débito / Crédito*
     * *Crédito Taller*
3. **Presionar "Facturar / Vender":**
   * El sistema ejecuta una **transacción atómica (ACID)** en la base de datos:
     1. Descuenta las unidades exactas de cada repuesto en la tabla `repuesto`.
     2. Genera la factura con prefijo fiscal (ej. `FV-2026-0089`).
     3. Inserta un asiento de auditoría en el **Kardex** con tipo `VENTA`.
4. **Entrega de Comprobante:**
   * Se abrirá el modal de la Factura de Venta POS con el logo de su taller, datos fiscales, desglose de IVA y pie de garantía.
   * Presione **"Imprimir Factura"** para el ticket del cliente.
   * El carrito se limpiará automáticamente quedando listo para el siguiente cliente.

---

## 4. FLUJO OPERATIVO 4: RECEPCIÓN DE REPUESTOS POR ORDEN DE ENTRADA

**Objetivo:** Ingresar al inventario repuestos nuevos entregados por un distribuidor mayorista.

### Paso a Paso:
1. Diríjase a la pestaña **"Proveedores & Órdenes"**.
2. En la sección **"Órdenes de Entrada / Recepción"**, presione **"Nueva Recepción de Mercancía"**.
3. Seleccione el proveedor remitente (ej. *Importadora Nacional de Repuestos S.A.S.*).
4. Ingrese el número de factura o remisión del proveedor (ej. `FAC-PROV-9941`).
5. Seleccione el repuesto recibido, ingrese la cantidad física verificada en bodega y el costo unitario pactado.
6. Presione **"Registrar Entrada en Stock"**.
7. **Efecto Inmediato:**
   * El stock del repuesto aumentará automáticamente.
   * En el **Kardex** quedará grabada la entrada con el número de factura del proveedor y el costo actualizado.

---

## 5. FLUJO OPERATIVO 5: DEVOLUCIÓN DE REPUESTO DEFECTUOSO A PROVEEDOR

**Objetivo:** Retirar del stock piezas que llegaron con defectos de fábrica o medidas erradas y devolverlas al distribuidor.

### Paso a Paso:
1. Ingrese a la pestaña **"Proveedores & Órdenes"** y seleccione la subpestaña **"Devoluciones por Defecto"**.
2. Presione **"Registrar Devolución a Proveedor"**.
3. Indique el repuesto defectuoso, el proveedor al que se le devuelve y la cantidad de unidades.
4. Especifique el motivo técnico del defecto (ej. *Cilindro con rayón interno en camisa*, *Empaque con rotura de fábrica*).
5. Adjunte el número de radicado o guía de despacho.
6. Guarde la devolución.
7. **Efecto Inmediato:** El sistema descuenta las unidades defectuosas del stock y crea un movimiento en el Kardex tipo `DEVOLUCION_PROVEEDOR`, salvaguardando la garantía contable del taller.

---

## 6. FLUJO OPERATIVO 6: AUDITORÍA DE INVENTARIO Y CONTEO FÍSICO EN KARDEX

**Objetivo:** Comparar las existencias físicas en los estantes con el saldo registrado en el software y justificar descuadres.

### Paso a Paso:
1. Ingrese a la pestaña **"Kardex de Movimientos"**.
2. Filtre por el repuesto a auditar (ej. *Bujía NGK Iridium CR9EIA-9*).
3. Revise la columna de **Saldo Anterior**, **Cantidad Movida** y **Saldo Posterior**.
4. Si el conteo físico en estantería difiere del sistema (ej. se contaron 8 unidades físicas pero el sistema marca 9):
   * Diríjase a **"Inventario & Stock"** y edite el stock del ítem.
   * El sistema solicitará el motivo del ajuste (ej. *Rotura accidental en taller*, *Conteo de fin de mes*).
   * En el Kardex se insertará un asiento tipo `AJUSTE_INVENTARIO` con el nombre del responsable.

---

## 7. FLUJO OPERATIVO 7: CAMBIO Y SELECCIÓN DE TERMINAL DE TRABAJO

**Objetivo:** Indicar al sistema en qué computadora o puesto físico se encuentra trabajando el operador.

### Paso a Paso:
1. Ubique en la esquina superior derecha de la cabecera el selector **"Terminal"**.
2. Seleccione su terminal asignada:
   * `TERM-01`: Mostrador Principal (Recepción)
   * `TERM-02`: Taller Bahía 1 (Mecánicos)
   * `TERM-03`: Bodega de Repuestos (Almacén)
   * `TERM-04`: Caja y Facturación
3. A partir de ese momento, todas las cotizaciones, facturas y asientos de inventario quedarán firmados con el nombre de su terminal para garantizar trazabilidad ante cualquier revisión administrativa.
