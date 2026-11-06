export interface ManualDocument {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: 'arquitectura' | 'usuario' | 'operacion' | 'codigo' | 'instalacion' | 'base_datos' | 'despliegue';
  icono: string;
  descripcionCorta: string;
  nombreArchivo: string;
  nombreWord: string;
  urlWord: string;
  contenido: string;
}

export const MANUAL_MAESTRO_UNIFICADO = {
  nombreArchivo: '00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc',
  urlWord: '/docs/word/00_MANUAL_MAESTRO_COMPLETO_MOTOGESTION_FX.doc',
  titulo: 'Compendio Maestro Unificado (Todos los 7 Documentos)',
  subtitulo: 'Toda la documentación técnica, manuales de usuario, CI/CD y guías en un solo archivo Word / PDF'
};

export const MANUALES_DEL_PROYECTO: ManualDocument[] = [
  {
    id: '01_general',
    titulo: 'Documento General del Proyecto: MotoGestión FX',
    subtitulo: 'Arquitectura Integral, Módulos Desarrollados y Especificaciones Técnicas',
    categoria: 'arquitectura',
    icono: 'Layers',
    descripcionCorta: 'Arquitectura Integral, Módulos Desarrollados y Especificaciones Técnicas',
    nombreArchivo: '01_DOCUMENTO_PROYECTO_GENERAL.md',
    nombreWord: '01_Documento_General_del_Proyecto_MotoGestionFX.doc',
    urlWord: '/docs/word/01_Documento_General_del_Proyecto_MotoGestionFX.doc',
    contenido: "# DOCUMENTO MAESTRO DEL PROYECTO: MOTOGESTIÓN FX\n## Sistema Integral de Inventarios, Cotizaciones y Exploración Visual Multimedial para Taller de Motocicletas\n\n**Versión:** 2.4.0-PRO  \n**Arquitectura:** Java 17+ / JavaFX 21 (MVC + DAO) | Soporte Multi-Equipo LAN & Nube  \n**Fecha:** Octubre 2026  \n**Autor:** Equipo de Arquitectura de Software MotoGestión FX  \n\n---\n\n### TABLA DE CONTENIDO\n1. Resumen Ejecutivo y Alcance\n2. Pila Tecnológica y Especificaciones Técnicas\n3. Arquitectura del Software (Patrón MVC + DAO + HikariCP)\n4. Módulos Funcionales Desarrollados\n5. Modelo de Datos Relacional y Esquema SQL\n6. Control de Concurrencia y Red Local (LAN)\n7. Seguridad y Control de Administrador\n8. Estado Actual de Entrega y Madurez\n\n---\n\n## 1. RESUMEN EJECUTIVO Y ALCANCE\n**MotoGestión FX** es un sistema de software de escritorio de alta fidelidad diseñado específicamente para modernizar las operaciones comerciales, técnicas y logísticas de talleres de motocicletas. \n\nA diferencia de los sistemas contables genéricos, MotoGestión FX introduce un **Módulo de Trabajo Interactivo Multimedial** basado en el esquema visual en alta definición de una motocicleta deportiva de alto rendimiento (Kawasaki Ninja ZX-10RR) y componentes para todas las marcas comerciales del mercado (Yamaha, Suzuki, Kawasaki, Bajaj, Honda, AKT, KTM). \n\nEl sistema soluciona tres cuellos de botella críticos en los talleres de motos:\n1. **Dificultad para identificar repuestos compatibles:** El mecánico u operario puede hacer clic directamente en la foto de la moto (ej. motor, suspensión, frenos, carenado, mandos) y el sistema despliega al instante el catálogo compatible con especificaciones de cilindraje (100cc a 1000cc), códigos OEM y stock físico.\n2. **Desconexión entre mostrador y bodega:** El carrito de cotizaciones/ventas es persistente entre todas las vistas de la aplicación. Se pueden cotizar trabajos sin bloquear el inventario o facturar descontando stock en tiempo real con transaccionalidad ACID.\n3. **Falta de trazabilidad en redes locales:** El sistema está preparado para funcionar en red local (LAN) con múltiples terminales (Recepción, Mecánicos, Bodega, Caja) conectadas a un servidor de base de datos único (PostgreSQL o SQLite).\n\n---\n\n## 2. PILA TECNOLÓGICA Y ESPECIFICACIONES TÉCNICAS\n\n| Componente | Tecnología Seleccionada | Justificación Técnica |\n| :--- | :--- | :--- |\n| **Lenguaje Base** | Java 17 LTS / Java 21 LTS | Tipado estático robusto, concurrencia avanzada, compatibilidad a largo plazo y multiplataforma. |\n| **Interfaz Gráfica (GUI)** | JavaFX 21 + FXML | Renderizado acelerado por hardware (DirectX/OpenGL/Metal), enlaces de datos bidireccionales (`ObservableList`), layouts desacoplados FXML y hojas de estilo CSS. |\n| **Gestor de Dependencias** | Apache Maven 3.9+ | Estandarización de compilación, gestión de dependencias y generación de paquetes ejecutables. |\n| **Patrón Arquitectónico** | MVC (Model-View-Controller) + DAO (Data Access Object) | Separación estricta de responsabilidades entre GUI, lógica de negocio y persistencia de datos. |\n| **Acceso a Datos** | JDBC Nativo + PreparedStatement | Máximo rendimiento sin sobrecargas de ORM pesados; protección total contra SQL Injection. |\n| **Pool de Conexiones** | HikariCP 5.1.0 | El pool JDBC más rápido del ecosistema Java, con reconexión automática en caídas de red LAN. |\n| **Base de Datos Local** | SQLite JDBC (`mototaller.db`) | Portabilidad inmediata sin requerir la instalación de un servidor SQL en pruebas iniciales o talleres monousuario. |\n| **Base de Datos LAN / Nube** | PostgreSQL 14+ / Neon.tech / Supabase | Integridad referencial fuerte, transacciones ACID para Kardex, soporte para múltiples terminales en simultáneo y nubes gratuitas serverless. |\n\n---\n\n## 3. ARQUITECTURA DEL SOFTWARE (PATRÓN MVC + DAO)\n\nEl código fuente del sistema se estructura en capas independientes:\n\n```\nsrc/main/java/com/mototaller/\n├── config/                  # Configuración global y lectura de database.properties\n│   ├── AppConfig.java\n│   └── DatabaseConnection.java (Singleton + HikariCP Pool)\n├── model/                   # Capa de Modelo (Entidades y POJOs con propiedades observables)\n│   ├── Repuesto.java\n│   ├── Proveedor.java\n│   ├── MovimientoKardex.java\n│   ├── FacturaVenta.java\n│   ├── ItemCarrito.java\n│   ├── Cotizacion.java\n│   └── TerminalLAN.java\n├── dao/                     # Capa de Acceso a Datos (Interfaces y Contratos)\n│   ├── RepuestoDAO.java\n│   ├── KardexDAO.java\n│   ├── VentaDAO.java\n│   └── ProveedorDAO.java\n├── dao/impl/                # Implementaciones JDBC de los DAOs\n│   ├── RepuestoDAOImpl.java\n│   ├── KardexDAOImpl.java\n│   ├── VentaDAOImpl.java\n│   └── ProveedorDAOImpl.java\n├── controller/              # Capa de Controladores JavaFX\n│   ├── MainViewController.java\n│   ├── MotorcycleExplorerController.java\n│   ├── InventoryController.java\n│   ├── KardexController.java\n│   ├── AdminController.java\n│   └── CartSidebarController.java\n└── MainApp.java             # Entry point del ciclo de vida JavaFX (start, init, stop)\n```\n\n---\n\n## 4. MÓDULOS FUNCIONALES DESARROLLADOS\n\n### 4.1. Módulo de Exploración Visual Interactivo (Diagrama Moto HD)\n* **Visualización de alta definición:** Fotografía de motocicleta deportiva de alta gama con coordenadas de zonas técnicas.\n* **Clickeable directamente en la foto:** 18 polígonos interactivos trazados sobre el carenaje, cúpula, frenos delanteros, calipers Brembo, suspensión invertida Showa, radiador, motor 998cc, embrague anti-rebote, escape Akrapovic, sillín, colín, basculante y cadena.\n* **Filtrado contextual en 2 clics:** Al hacer clic en una parte (ej. Motor -> Pistón), la lista de repuestos filtra automáticamente por esa pieza, permitiendo además refinar por marca (Yamaha, Suzuki, Kawasaki, etc.) y cilindraje (100cc a 1000cc).\n* **Adición inmediata al carrito:** Selector de cantidad integrado y advertencia de stock máximo disponible.\n\n### 4.2. Carrito Persistente y Documentos Comerciales\n* **Persistencia total:** El panel lateral permanece visible e inmutable mientras el usuario navega entre el Diagrama, Inventario, Kardex o Proveedores.\n* **Generación de Cotizaciones:** Calcula subtotales, IVA parametrizable (ej. 19%) y total sin modificar inventario. Genera proforma con vigencia legal para entrega al cliente.\n* **Facturación POS / Venta Atómica:** Valida stock disponible, descuenta inventario, genera el registro de venta con resolución DIAN/fiscal, e inserta automáticamente la transacción en el Kardex.\n\n### 4.3. Inventario y Control de Stock en Tiempo Real\n* **Monitoreo de Stock Mínimo:** Alertas visuales inmediatas cuando un repuesto alcanza o baja de su umbral de seguridad.\n* **Filtros avanzados:** Búsqueda en vivo por código SKU, referencia OEM de fabricante, nombre, zona técnica, marca de moto y cilindraje.\n* **Gestión de Precios:** Margen de rentabilidad calculado en base al costo unitario y precio de venta al público.\n\n### 4.4. Control de Inventario / Kardex de Movimientos\n* **Auditoría inmutable:** Asientos contables automáticos por:\n  * `ENTRADA` (Recepción de pedidos de proveedores).\n  * `VENTA` (Facturación directa desde el carrito).\n  * `DEVOLUCION_PROVEEDOR` (Repuestos con defectos de fábrica).\n  * `AJUSTE_INVENTARIO` (Corrección por inventario físico o pérdidas).\n* **Trazabilidad de puestos:** Cada movimiento almacena la fecha/hora exacta, saldo anterior, cantidad, saldo posterior, documento de referencia y nombre/IP de la terminal responsable.\n\n### 4.5. Proveedores y Órdenes de Entrada / Devolución\n* **Ficha de Proveedores:** NIT, Razón Social, Teléfono, Correo, Dirección y Ciudad.\n* **Órdenes de Entrada:** Recepción de mercancía que suma al stock existente y actualiza el costo ponderado.\n* **Gestión de Devoluciones:** Proceso formal para devolver piezas defectuosas a proveedores con motivo documentado y ajuste automático del Kardex.\n\n### 4.6. Módulo de Administrador con Contraseña\n* **Seguridad por PIN / Clave Maestra:** Protege contra modificaciones no autorizadas por parte de operadores o mecánicos.\n* **Identidad Corporativa:** Nombre de la empresa, slogan, NIT, teléfonos, dirección y carga interactiva del Logo del Taller (visible en cabecera y facturas).\n* **Parámetros del Sistema:** Configuración de IVA, prefijos de facturación y cotización, vigencia, términos legales y alertas de stock.\n* **Gestión de Terminales LAN:** Registro de IPs y nombres de estaciones de trabajo del taller.\n\n---\n\n## 5. MODELO DE DATOS RELACIONAL Y ESQUEMA SQL\n\nEl sistema cuenta con un esquema normalizado en 3ra Forma Normal (3NF) compuesto por las siguientes tablas principales:\n1. `configuracion_taller`: Parámetros globales, rutas de logo y PIN de administrador.\n2. `proveedor`: Proveedores y distribuidores de repuestos.\n3. `zona_moto`: Zonas anatómicas de la motocicleta.\n4. `repuesto`: Maestro de repuestos con SKU, OEM, compatibilidades, precios y stock.\n5. `kardex_movimiento`: Libro mayor de movimientos de inventario.\n6. `factura_venta` y `detalle_factura_venta`: Encabezado y líneas de venta POS.\n7. `cotizacion` y `detalle_cotizacion`: Cotizaciones y proformas comerciales.\n8. `orden_compra` y `detalle_orden_compra`: Pedidos a distribuidores.\n\n---\n\n## 6. CONTROL DE CONCURRENCIA Y RED LOCAL (LAN)\nPara permitir que múltiples mecánicos y cajeros trabajen simultáneamente:\n1. **Transacciones ACID:** Las ventas usan `conn.setAutoCommit(false)`, ejecutando la factura, detalles, descuento de stock y asiento en Kardex en un bloque atómico. Si la red falla, se aplica `conn.rollback()`.\n2. **Nivel de Aislamiento:** `TRANSACTION_READ_COMMITTED` para evitar lecturas sucias de stock.\n3. **Pool HikariCP:** Mantiene conexiones calientes preabiertas reduciendo la latencia de red a menos de 2 milisegundos por consulta en la LAN.\n\n---\n\n## 7. ESTADO ACTUAL DE ENTREGA\nEl proyecto cuenta con:\n* Código fuente Java completo (Modelos, DAOs, Controladores, Vistas FXML y Singleton JDBC).\n* Scripts SQL compatibles con PostgreSQL y SQLite.\n* Entorno interactivo para pruebas en tiempo real con simulación multiequipo.\n* Módulo de Administrador autenticado por contraseña.\n* Catálogo maestro de repuestos para motos deportivas, calle y trabajo de todas las marcas y cilindrajes.\n"
  },
  {
    id: '02_usuario',
    titulo: 'Manual de Usuario Funcional',
    subtitulo: 'Perfiles de Acceso, Pantallas y Funcionalidades por Rol',
    categoria: 'usuario',
    icono: 'Users',
    descripcionCorta: 'Perfiles de Acceso, Pantallas y Funcionalidades por Rol',
    nombreArchivo: '02_MANUAL_DE_USUARIO.md',
    nombreWord: '02_Manual_de_Usuario_Funcional_MotoGestionFX.doc',
    urlWord: '/docs/word/02_Manual_de_Usuario_Funcional_MotoGestionFX.doc',
    contenido: "# MANUAL DE USUARIO\n## SISTEMA MOTOGESTIÓN FX - GESTIÓN DE TALLER, INVENTARIOS Y COTIZACIONES\n\n**Para:** Operadores, Mecánicos, Asesores de Mostrador, Bodegueros y Administradores  \n**Versión de la Guía:** 2.4.0  \n\n---\n\n### TABLA DE CONTENIDO\n1. Introducción y Filosofía del Sistema\n2. Roles de Usuario y Perfiles de Acceso\n3. Estructura de la Pantalla Principal\n4. Uso del Diagrama Interactivo de Motocicleta\n5. El Carrito Persistente: Cotizaciones vs Facturación\n6. Consulta de Inventario y Alertas de Stock\n7. Navegación en el Kardex y Proveedores\n8. Acceso al Módulo de Administrador y Seguridad\n9. Solución a Preguntas Frecuentes\n\n---\n\n## 1. INTRODUCCIÓN Y FILOSOFÍA DEL SISTEMA\nBienvenido a **MotoGestión FX**. Esta herramienta ha sido concebida para simplificar el trabajo diario en el taller de motocicletas. A diferencia de las hojas de cálculo tradicionales o programas genéricos, aquí encontrará la moto representada gráficamente, permitiendo que cualquier miembro del equipo identifique repuestos compatibles en segundos, prepare cotizaciones claras para los clientes y registre ventas sin errores de inventario.\n\n---\n\n## 2. ROLES DE USUARIO Y PERFILES DE ACCESO\n\nEl sistema distingue 5 perfiles de trabajo dentro del taller:\n\n| Perfil | Ubicación Física Típica | Funciones Principales | Restricciones de Seguridad |\n| :--- | :--- | :--- | :--- |\n| **Mecánico / Técnico** | Bahía de servicio / Taller | Clic en el Diagrama de la moto para ubicar repuestos; agregar piezas al carrito para solicitar a bodega. | No puede modificar precios de costo ni cambiar configuraciones del taller. |\n| **Asesor de Mostrador** | Recepción de motos | Búsqueda por placa y modelo; elaboración e impresión de Cotizaciones para aprobación del cliente. | No puede alterar el Kardex contable manualmente. |\n| **Bodeguero / Almacén** | Almacén de repuestos | Recepción de Órdenes de Entrada de proveedores; devolución de piezas con defecto de fábrica; control de stock físico. | No puede acceder a configuraciones fiscales o bases de datos. |\n| **Cajero** | Caja / Facturación | Cobro de órdenes de trabajo; emisión de Facturas de Venta POS; arqueo diario de caja. | No puede eliminar asientos del Kardex ni modificar el logo del taller. |\n| **Administrador** | Oficina Principal | Control total: Configuración de la empresa, cambio de logo, ajuste de IVA, gestión de terminales LAN, base de datos y código. | **Requiere Contraseña Maestra (PIN) para ingresar.** |\n\n---\n\n## 3. ESTRUCTURA DE LA PANTALLA PRINCIPAL\n\nAl iniciar la aplicación, la pantalla se organiza en 3 grandes áreas ergonómicas:\n\n1. **Barra Superior (Cabecera & LAN):**\n   * **Indicador de Red Local:** Muestra la IP del servidor de base de datos y el estado de la conexión (`Pool HikariCP: 15/15 Conexiones`).\n   * **Selector de Terminal de Trabajo:** Identifica desde qué puesto físico se está operando (ej. `Mostrador Principal`, `Bahía Mecánicos 1`).\n   * **Alerta de Stock Mínimo:** Botón ámbar que indica cuántos repuestos tienen existencia crítica.\n   * **Identidad del Taller:** Logo corporativo, nombre comercial y slogan configurados por el administrador.\n   * **Pestañas de Navegación:** Acceso a `Diagrama Moto HD`, `Inventario & Stock`, `Kardex`, `Proveedores` y `Módulo Administrador`.\n\n2. **Área Central de Trabajo (Vista Activa):**\n   * Muestra la pantalla seleccionada (Diagrama visual, tablas de inventario, etc.).\n\n3. **Panel Lateral Derecho (Carrito Persistente):**\n   * Siempre visible. Mantiene los repuestos que usted va seleccionando sin importar si cambia de pestaña.\n   * Contiene los botones de acción inmediata: **\"Generar Cotización\"** y **\"Facturar / Vender\"**.\n\n---\n\n## 4. USO DEL DIAGRAMA INTERACTIVO DE MOTOCICLETA\n\nEl módulo de exploración visual es el corazón del sistema:\n\n1. **Exploración Directa sobre la Foto:**\n   * Al pasar el cursor del mouse sobre la moto deportiva (Kawasaki Ninja ZX-10RR), verá que partes como el **carenado**, la **cúpula**, las **mordazas de freno Brembo**, la **suspensión invertida**, el **motor**, el **radiador**, el **escape Akrapovic**, el **asiento** o la **cadena** se iluminan en color verde lima neón.\n   * **Haga clic directamente sobre la pieza:** El sistema reconocerá la zona anatómica seleccionada al instante.\n\n2. **Despliegue Contextual de Repuestos:**\n   * Al hacer clic en una parte de la moto, la pantalla desplegará la lista de repuestos compatibles con esa sección.\n   * Puede filtrar adicionalmente por:\n     * **Marca de Moto:** Yamaha, Suzuki, Kawasaki, Bajaj, Honda, AKT, KTM o Universal.\n     * **Cilindraje:** Desde 100cc (motos de trabajo) hasta 1000cc (superdeportivas).\n     * **Buscador de texto:** Para buscar por código OEM o descripción rápida.\n\n3. **Adición al Carrito:**\n   * Seleccione la cantidad deseada usando los botones `+` y `-`.\n   * Presione **\"Agregar\"** o el botón del carrito verde. El ítem se sumará al panel lateral derecho con una confirmación visual.\n\n---\n\n## 5. EL CARRITO PERSISTENTE: COTIZACIONES VS FACTURACIÓN\n\nEl panel lateral derecho permite dos operaciones comerciales distintas:\n\n### A. Generar Cotización (Proforma)\n* **¿Cuándo usarla?:** Cuando el cliente pide un presupuesto antes de autorizar la reparación de su moto.\n* **Procedimiento:**\n  1. Agregue los repuestos necesarios al carrito.\n  2. Ingrese los datos del cliente (Nombre, Teléfono, Placa y Modelo de la moto).\n  3. Presione el botón azul **\"Generar Cotización\"**.\n  4. Se abrirá una ventana con la proforma formal con vigencia (ej. 15 días) y desglose de IVA.\n  5. Puede imprimirla o entregarla al cliente.\n* **Efecto en el inventario:** **NINGUNO**. Las cotizaciones NO descuentan repuestos del inventario.\n\n### B. Facturar / Vender (Descuento de Stock)\n* **¿Cuándo usarla?:** Cuando el cliente paga los repuestos o la orden de servicio está terminada.\n* **Procedimiento:**\n  1. Revise los ítems del carrito.\n  2. Diligencie el documento del cliente y seleccione el medio de pago (Efectivo, Tarjeta, Transferencia, Crédito).\n  3. Presione el botón verde **\"Facturar / Vender\"**.\n* **Efecto en el inventario:** \n  * Se descuentan las unidades vendidas en tiempo real.\n  * Se genera automáticamente el asiento contable en el **Kardex** con tipo `VENTA`.\n  * Se muestra el recibo POS con código de factura para imprimir.\n\n---\n\n## 6. CONSULTA DE INVENTARIO Y ALERTAS DE STOCK\nEn la pestaña **\"Inventario & Stock\"**:\n* Podrá ver la lista completa de todos los repuestos del taller.\n* Los productos con stock menor o igual al mínimo tendrán un distintivo rojo parpadeante de **\"CRÍTICO\"**.\n* Puede registrar nuevos repuestos con su código SKU, referencia de fabricante, costos y precios de venta.\n\n---\n\n## 7. NAVEGACIÓN EN EL KARDEX Y PROVEEDORES\n* **Kardex:** Es la hoja de vida inmutable de las entradas y salidas de mercancía. Muestra fecha, número de documento, tipo de movimiento, cantidad, saldos y la terminal que operó el registro.\n* **Proveedores & Órdenes:** Permite crear órdenes de entrada para surtir el almacén y gestionar devoluciones a distribuidores cuando una pieza llega con defecto de fábrica.\n\n---\n\n## 8. ACCESO AL MÓDULO DE ADMINISTRADOR Y SEGURIDAD\nPor seguridad del negocio, la configuración del taller y el cambio de logo están protegidos:\n1. Al hacer clic en la pestaña **\"Módulo Administrador\"**, se abrirá una ventana solicitando la **Contraseña Maestra**.\n2. Ingrese la contraseña asignada (clave inicial de fábrica: `admin123`).\n3. Al autenticarse, tendrá acceso a:\n   * Cambiar el Nombre comercial, slogan, NIT y teléfonos del taller.\n   * Subir un nuevo **Logo del Taller** desde su computador.\n   * Configurar porcentajes de IVA, prefijos de facturas y alertas de stock.\n   * Cambiar la contraseña maestra de administrador.\n   * Consultar la guía de código y bases de datos.\n4. Para proteger el sistema al retirarse de su puesto, presione el botón **\"Bloquear / Cerrar Sesión\"**.\n"
  },
  {
    id: '03_operativo',
    titulo: 'Manual de Uso Operativo (Día a Día)',
    subtitulo: 'Procedimientos Estándar Paso a Paso (SOP) para el Taller',
    categoria: 'operacion',
    icono: 'ClipboardList',
    descripcionCorta: 'Procedimientos Estándar Paso a Paso (SOP) para el Taller',
    nombreArchivo: '03_MANUAL_DE_USO.md',
    nombreWord: '03_Manual_de_Uso_Operativo_Dia_a_Dia.doc',
    urlWord: '/docs/word/03_Manual_de_Uso_Operativo_Dia_a_Dia.doc',
    contenido: "# MANUAL DE USO OPERATIVO DÍA A DÍA\n## SISTEMA MOTOGESTIÓN FX - GUÍA DE PROCEDIMIENTOS ESTÁNDAR (SOP)\n\n**Para:** Operación Diaria en Recepción, Bahía de Mecánica, Almacén y Caja  \n**Versión:** 2.4.0  \n\n---\n\n### TABLA DE CONTENIDO\n1. Flujo Operativo 1: Recepción de Motocicleta y Creación de Cotización\n2. Flujo Operativo 2: Identificación Técnica Visual por el Mecánico (Diagrama HD)\n3. Flujo Operativo 3: Facturación POS y Cierre de Venta\n4. Flujo Operativo 4: Recepción de Repuestos por Orden de Entrada\n5. Flujo Operativo 5: Devolución de Repuestos con Defecto de Fábrica a Proveedor\n6. Flujo Operativo 6: Auditoría de Inventario y Conteo Físico en Kardex\n7. Flujo Operativo 7: Cambio y Selección de Terminal de Trabajo\n\n---\n\n## 1. FLUJO OPERATIVO 1: RECEPCIÓN DE MOTOCICLETA Y COTIZACIÓN\n\n**Objetivo:** Elaborar un presupuesto detallado para un cliente sin alterar el stock del almacén.\n\n### Paso a Paso:\n1. **Identificar la moto del cliente:** Solicite la marca (ej. Yamaha), modelo (ej. MT-09) y cilindraje (ej. 850cc), junto con la placa.\n2. **Seleccionar los repuestos necesarios:**\n   * Ingrese a la pestaña **\"Diagrama Moto HD\"** o a **\"Inventario & Stock\"**.\n   * Localice las piezas a cotizar (ej. Kit de arrastre, pastillas de freno Brembo, aceite sintético).\n   * Especifique la cantidad requerida en cada ítem y presione **\"Agregar\"**.\n3. **Verificar el Carrito Lateral:**\n   * En el panel derecho, confirme que las cantidades y precios unitarios sean correctos.\n4. **Completar los datos del cliente:**\n   * En la sección inferior del carrito, ingrese el nombre del cliente, teléfono celular, placa y modelo de la moto.\n5. **Generar la Cotización:**\n   * Haga clic en el botón azul **\"Generar Cotización\"**.\n   * Se abrirá la ventana con el documento proforma formal con numeración consecutiva (ej. `COT-00104`).\n   * La proforma detalla subtotales, IVA (19%), total y fecha límite de validez (15 días).\n   * Imprima el comprobante o comparta el resumen con el cliente.\n6. **Resultado:** La cotización queda registrada sin haber descontado una sola unidad física del inventario.\n\n---\n\n## 2. FLUJO OPERATIVO 2: IDENTIFICACIÓN TÉCNICA VISUAL POR EL MECÁNICO\n\n**Objetivo:** Permitir que el mecánico en el taller encuentre la referencia exacta de un repuesto desgastado sin tener que buscar códigos manuales.\n\n### Paso a Paso:\n1. **Abrir el Diagrama Interactivo:**\n   * Ingrese a la pestaña **\"Diagrama Moto HD\"**.\n2. **Hacer clic en la zona anatómica averiada:**\n   * Si la moto tiene un ruido en el motor: haga clic en el bloque del **Motor**.\n   * Si presenta desgaste en la frenada: haga clic en las **Mordazas / Discos de Freno**.\n   * Si requiere suspensión: haga clic en la **Horquilla Invertida** o en el **Monoshock**.\n3. **Explorar las subpartes y marcas compatibles:**\n   * El sistema desplegará de inmediato la lista de repuestos correspondientes.\n   * Seleccione la marca de la moto en el selector (ej. Bajaj o Suzuki) y el cilindraje.\n4. **Verificar disponibilidad física:**\n   * Compruebe la columna **Stock**. Si el número aparece en verde, hay existencia suficiente en bodega.\n   * Si el stock es 0 o está en rojo, solicite la pieza a compras de inmediato.\n5. **Solicitar a Bodega:**\n   * Presione **\"Agregar al Carrito\"** para que el almacén prepare los repuestos.\n\n---\n\n## 3. FLUJO OPERATIVO 3: FACTURACIÓN POS Y CIERRE DE VENTA\n\n**Objetivo:** Registrar el pago del cliente, entregar la factura formal y descargar las piezas del inventario físico.\n\n### Paso a Paso:\n1. **Revisión final de ítems:** Confirme con el cliente o la orden de servicio que todos los repuestos y aceites estén cargados en el carrito lateral.\n2. **Datos de facturación:**\n   * Ingrese el Nombre o Razón Social y Cédula/NIT del cliente.\n   * Seleccione el método de pago:\n     * *Efectivo*\n     * *Transferencia (Nequi / Daviplata / Bancolombia)*\n     * *Tarjeta Débito / Crédito*\n     * *Crédito Taller*\n3. **Presionar \"Facturar / Vender\":**\n   * El sistema ejecuta una **transacción atómica (ACID)** en la base de datos:\n     1. Descuenta las unidades exactas de cada repuesto en la tabla `repuesto`.\n     2. Genera la factura con prefijo fiscal (ej. `FV-2026-0089`).\n     3. Inserta un asiento de auditoría en el **Kardex** con tipo `VENTA`.\n4. **Entrega de Comprobante:**\n   * Se abrirá el modal de la Factura de Venta POS con el logo de su taller, datos fiscales, desglose de IVA y pie de garantía.\n   * Presione **\"Imprimir Factura\"** para el ticket del cliente.\n   * El carrito se limpiará automáticamente quedando listo para el siguiente cliente.\n\n---\n\n## 4. FLUJO OPERATIVO 4: RECEPCIÓN DE REPUESTOS POR ORDEN DE ENTRADA\n\n**Objetivo:** Ingresar al inventario repuestos nuevos entregados por un distribuidor mayorista.\n\n### Paso a Paso:\n1. Diríjase a la pestaña **\"Proveedores & Órdenes\"**.\n2. En la sección **\"Órdenes de Entrada / Recepción\"**, presione **\"Nueva Recepción de Mercancía\"**.\n3. Seleccione el proveedor remitente (ej. *Importadora Nacional de Repuestos S.A.S.*).\n4. Ingrese el número de factura o remisión del proveedor (ej. `FAC-PROV-9941`).\n5. Seleccione el repuesto recibido, ingrese la cantidad física verificada en bodega y el costo unitario pactado.\n6. Presione **\"Registrar Entrada en Stock\"**.\n7. **Efecto Inmediato:**\n   * El stock del repuesto aumentará automáticamente.\n   * En el **Kardex** quedará grabada la entrada con el número de factura del proveedor y el costo actualizado.\n\n---\n\n## 5. FLUJO OPERATIVO 5: DEVOLUCIÓN DE REPUESTO DEFECTUOSO A PROVEEDOR\n\n**Objetivo:** Retirar del stock piezas que llegaron con defectos de fábrica o medidas erradas y devolverlas al distribuidor.\n\n### Paso a Paso:\n1. Ingrese a la pestaña **\"Proveedores & Órdenes\"** y seleccione la subpestaña **\"Devoluciones por Defecto\"**.\n2. Presione **\"Registrar Devolución a Proveedor\"**.\n3. Indique el repuesto defectuoso, el proveedor al que se le devuelve y la cantidad de unidades.\n4. Especifique el motivo técnico del defecto (ej. *Cilindro con rayón interno en camisa*, *Empaque con rotura de fábrica*).\n5. Adjunte el número de radicado o guía de despacho.\n6. Guarde la devolución.\n7. **Efecto Inmediato:** El sistema descuenta las unidades defectuosas del stock y crea un movimiento en el Kardex tipo `DEVOLUCION_PROVEEDOR`, salvaguardando la garantía contable del taller.\n\n---\n\n## 6. FLUJO OPERATIVO 6: AUDITORÍA DE INVENTARIO Y CONTEO FÍSICO EN KARDEX\n\n**Objetivo:** Comparar las existencias físicas en los estantes con el saldo registrado en el software y justificar descuadres.\n\n### Paso a Paso:\n1. Ingrese a la pestaña **\"Kardex de Movimientos\"**.\n2. Filtre por el repuesto a auditar (ej. *Bujía NGK Iridium CR9EIA-9*).\n3. Revise la columna de **Saldo Anterior**, **Cantidad Movida** y **Saldo Posterior**.\n4. Si el conteo físico en estantería difiere del sistema (ej. se contaron 8 unidades físicas pero el sistema marca 9):\n   * Diríjase a **\"Inventario & Stock\"** y edite el stock del ítem.\n   * El sistema solicitará el motivo del ajuste (ej. *Rotura accidental en taller*, *Conteo de fin de mes*).\n   * En el Kardex se insertará un asiento tipo `AJUSTE_INVENTARIO` con el nombre del responsable.\n\n---\n\n## 7. FLUJO OPERATIVO 7: CAMBIO Y SELECCIÓN DE TERMINAL DE TRABAJO\n\n**Objetivo:** Indicar al sistema en qué computadora o puesto físico se encuentra trabajando el operador.\n\n### Paso a Paso:\n1. Ubique en la esquina superior derecha de la cabecera el selector **\"Terminal\"**.\n2. Seleccione su terminal asignada:\n   * `TERM-01`: Mostrador Principal (Recepción)\n   * `TERM-02`: Taller Bahía 1 (Mecánicos)\n   * `TERM-03`: Bodega de Repuestos (Almacén)\n   * `TERM-04`: Caja y Facturación\n3. A partir de ese momento, todas las cotizaciones, facturas y asientos de inventario quedarán firmados con el nombre de su terminal para garantizar trazabilidad ante cualquier revisión administrativa.\n"
  },
  {
    id: '04_codigo',
    titulo: 'Guía Técnica de Código y Modificaciones',
    subtitulo: 'Desarrollo en Java 17+ / JavaFX 21 - Arquitectura MVC & Patrón DAO',
    categoria: 'codigo',
    icono: 'Code2',
    descripcionCorta: 'Desarrollo en Java 17+ / JavaFX 21 - Arquitectura MVC & Patrón DAO',
    nombreArchivo: '04_GUIA_DE_CODIGO_MODIFICACIONES.md',
    nombreWord: '04_Guia_Tecnica_de_Codigo_y_Modificaciones.doc',
    urlWord: '/docs/word/04_Guia_Tecnica_de_Codigo_y_Modificaciones.doc',
    contenido: "# GUÍA TÉCNICA DE CÓDIGO Y MODIFICACIONES\n## DESARROLLO EN JAVA 17+ / JAVAFX 21 - ARQUITECTURA MVC & PATRÓN DAO\n\n**Para:** Desarrolladores de Software, Ingenieros de Sistemas y Arquitectos Java  \n**Versión:** 2.4.0  \n\n---\n\n### TABLA DE CONTENIDO\n1. Estructura de Directorios del Proyecto Maven\n2. Cómo Agregar Nuevos Repuestos y Piezas al Catálogo\n3. Cómo Incorporar Nuevas Marcas, Modelos y Cilindrajes de Motos\n4. Cómo Modificar o Agregar Nuevos Puntos Interactivos (Hotspots) en la Moto\n5. Cómo Crear un Nuevo DAO o Agregar Consultas SQL\n6. Cómo Modificar las Vistas FXML y Estilos CSS\n7. Configuración de Marca y Logo por Código Java (`AppConfig.java`)\n8. Gestión Transaccional con HikariCP (`DatabaseConnection.java`)\n\n---\n\n## 1. ESTRUCTURA DE DIRECTORIOS DEL PROYECTO MAVEN\n\nEl proyecto sigue la convención estándar de Apache Maven:\n\n```\nmototaller-javafx/\n├── pom.xml                                   # Configuración de dependencias Maven\n├── src/\n│   ├── main/\n│   │   ├── java/\n│   │   │   └── com/mototaller/\n│   │   │       ├── MainApp.java              # Clase principal JavaFX Application\n│   │   │       ├── config/\n│   │   │       │   ├── AppConfig.java        # Constantes de marca, logo y rutas\n│   │   │       │   └── DatabaseConnection.java# Pool Singleton HikariCP\n│   │   │       ├── model/                    # Entidades POJO JavaFX\n│   │   │       │   ├── Repuesto.java\n│   │   │       │   ├── Proveedor.java\n│   │   │       │   ├── MovimientoKardex.java\n│   │   │       │   ├── FacturaVenta.java\n│   │   │       │   └── ItemCarrito.java\n│   │   │       ├── dao/                      # Contratos / Interfaces de acceso a datos\n│   │   │       │   ├── RepuestoDAO.java\n│   │   │       │   ├── KardexDAO.java\n│   │   │       │   └── VentaDAO.java\n│   │   │       ├── dao/impl/                 # Implementaciones JDBC nativas\n│   │   │       │   ├── RepuestoDAOImpl.java\n│   │   │       │   ├── KardexDAOImpl.java\n│   │   │       │   └── VentaDAOImpl.java\n│   │   │       └── controller/               # Controladores de interfaz gráfica\n│   │   │           ├── MainViewController.java\n│   │   │           └── MotorcycleExplorerController.java\n│   │   └── resources/\n│   │       ├── database.properties           # Credenciales y URL de JDBC activa\n│   │       ├── sql/\n│   │       │   ├── schema_postgresql.sql     # Script DDL para PostgreSQL\n│   │       │   └── schema_sqlite.sql         # Script DDL para SQLite\n│   │       ├── fxml/\n│   │       │   ├── MainView.fxml             # Layout XML de la interfaz\n│   │       │   └── MotorcycleExplorer.fxml\n│   │       ├── css/\n│   │       │   └── dark_theme.css            # Estilos visuales dark mode\n│   │       └── images/\n│   │           ├── kawasaki_ninja_zx10r.jpg  # Fotografía técnica de la moto\n│   │           └── logo_taller.png           # Logo predeterminado del taller\n```\n\n---\n\n## 2. CÓMO AGREGAR NUEVOS REPUESTOS Y PIEZAS AL CATÁLOGO\n\n### A. Vía Script SQL (`schema_postgresql.sql` / `schema_sqlite.sql`)\nPara insertar repuestos de manera masiva, ejecute una sentencia `INSERT`:\n\n```sql\nINSERT INTO repuesto (\n    codigo, referencia_oem, nombre, descripcion, zona_id, subparte,\n    marca_moto, cilindraje, modelo_compatible, precio_costo, precio_venta,\n    stock_actual, stock_minimo, proveedor_id\n) VALUES (\n    'MOT-YAM-045', \n    '54P-E1631-00', \n    'Pistón Completo Estándar 50.0mm con Anillos y Pasador', \n    'Pistón forjado de alta resistencia para motor Blue Core enfriado por aire.', \n    'motor', \n    'Pistón y Cilindro', \n    'Yamaha', \n    '125cc', \n    'Yamaha Crypton 115 / YBR 125', \n    48000.00, \n    78000.00, \n    14, \n    4, \n    1\n);\n```\n\n### B. Vía Modelo de Dominio Java (`Repuesto.java`)\nSi crea repuestos programáticamente en tiempo de ejecución:\n\n```java\nRepuesto nuevoRepuesto = new Repuesto();\nnuevoRepuesto.setCodigo(\"SUS-BAJ-012\");\nnuevoRepuesto.setReferenciaOem(\"JL-1210-04\");\nnuevoRepuesto.setNombre(\"Retenedores de Suspensión Delantera 37mm\");\nnuevoRepuesto.setZonaId(\"frenos_suspension\");\nnuevoRepuesto.setSubparte(\"Horquilla Telescópica y Suspensión\");\nnuevoRepuesto.setMarcaMoto(\"Bajaj\");\nnuevoRepuesto.setCilindraje(\"200cc\");\nnuevoRepuesto.setModeloCompatible(\"Pulsar NS200 / RS200 FI\");\nnuevoRepuesto.setPrecioCosto(18000.0);\nnuevoRepuesto.setPrecioVenta(32000.0);\nnuevoRepuesto.setStockActual(20);\nnuevoRepuesto.setStockMinimo(6);\n\nRepuestoDAO repuestoDAO = new RepuestoDAOImpl();\nrepuestoDAO.guardar(nuevoRepuesto);\n```\n\n---\n\n## 3. CÓMO INCORPORAR NUEVAS MARCAS, MODELOS Y CILINDRAJES\n\nEn `MainViewController.java`, los filtros de marca y cilindraje se inicializan mediante listas observables de JavaFX:\n\n```java\n// Para añadir nuevas marcas (ej. Benelli, Hero, BMW):\nObservableList<String> marcas = FXCollections.observableArrayList(\n    \"Todas\", \"Kawasaki\", \"Yamaha\", \"Suzuki\", \"Bajaj\", \"AKT\", \"Honda\", \"KTM\", \"Benelli\", \"Hero\", \"BMW\", \"Universal\"\n);\ncomboMarcas.setItems(marcas);\n\n// Para añadir nuevos cilindrajes (ej. 750cc, 800cc, 1200cc):\nObservableList<String> cilindrajes = FXCollections.observableArrayList(\n    \"Todos\", \"1000cc\", \"800cc\", \"650cc\", \"400cc\", \"390cc\", \"321cc\", \"250cc\", \"200cc\", \"150cc\", \"125cc\", \"100cc\", \"Universal\"\n);\ncomboCilindrajes.setItems(cilindrajes);\n```\n\n---\n\n## 4. CÓMO AGREGAR O MODIFICAR PUNTOS INTERACTIVOS (HOTSPOTS) EN LA MOTO\n\nLos puntos interactivos del diagrama se definen como coordenadas relativas porcentuales (0% a 100%) sobre la imagen en `MotorcycleExplorerController.java`:\n\n```java\npublic class HotspotDef {\n    private String id;\n    private String label;\n    private String zonaId;\n    private String subparteFiltro;\n    private double targetX; // Coordenada X del componente (0 a 100)\n    private double targetY; // Coordenada Y del componente (0 a 100)\n    private String hitPolygon; // Coordenadas poligonales SVG para clics directos\n    \n    // Constructor, getters y setters...\n}\n\n// Ejemplo: Añadir un nuevo punto para el \"Farola LED Delantera\":\nhotspots.add(new HotspotDef(\n    \"farola_delantera\",\n    \"Farola Dual LED\",\n    \"electrico\",\n    \"Luces LED, Farola y Direccionales\",\n    84.0, 36.0,\n    \"78,32 90,32 92,42 80,44\"\n));\n```\n\n---\n\n## 5. CÓMO CREAR UN NUEVO DAO O AGREGAR CONSULTAS SQL\n\nPara mantener el principio de desacoplamiento, cree primero la interfaz en `com.mototaller.dao` y luego su implementación en `com.mototaller.dao.impl`:\n\n### Paso 1: Interfaz `RepuestoDAO.java`\n```java\npublic interface RepuestoDAO {\n    List<Repuesto> listarTodos() throws SQLException;\n    List<Repuesto> buscarPorZonaYFiltros(String zonaId, String marca, String cilindraje) throws SQLException;\n    Repuesto buscarPorCodigo(String codigo) throws SQLException;\n    void actualizarStock(int id, int nuevoStock) throws SQLException;\n}\n```\n\n### Paso 2: Implementación con PreparedStatement y HikariCP `RepuestoDAOImpl.java`\n```java\npublic class RepuestoDAOImpl implements RepuestoDAO {\n    @Override\n    public List<Repuesto> buscarPorZonaYFiltros(String zonaId, String marca, String cilindraje) throws SQLException {\n        List<Repuesto> lista = new ArrayList<>();\n        StringBuilder sql = new StringBuilder(\"SELECT * FROM repuesto WHERE zona_id = ?\");\n        \n        if (!\"Todas\".equalsIgnoreCase(marca)) {\n            sql.append(\" AND marca_moto = ?\");\n        }\n        if (!\"Todos\".equalsIgnoreCase(cilindraje)) {\n            sql.append(\" AND cilindraje = ?\");\n        }\n\n        try (Connection conn = DatabaseConnection.getInstance().getConnection();\n             PreparedStatement ps = conn.prepareStatement(sql.toString())) {\n            \n            int paramIndex = 1;\n            ps.setString(paramIndex++, zonaId);\n            \n            if (!\"Todas\".equalsIgnoreCase(marca)) {\n                ps.setString(paramIndex++, marca);\n            }\n            if (!\"Todos\".equalsIgnoreCase(cilindraje)) {\n                ps.setString(paramIndex++, cilindraje);\n            }\n\n            try (ResultSet rs = ps.executeQuery()) {\n                while (rs.next()) {\n                    lista.add(mapearRepuesto(rs));\n                }\n            }\n        }\n        return lista;\n    }\n}\n```\n\n---\n\n## 6. CÓMO MODIFICAR LAS VISTAS FXML Y ESTILOS CSS\n\n* Las vistas FXML (`src/main/resources/fxml/MainView.fxml`) pueden abrirse y editarse visualmente usando **Scene Builder** o directamente en el editor de código de Visual Studio Code.\n* Todos los componentes tienen identificadores `fx:id` vinculados con `@FXML` en el controlador:\n  ```xml\n  <TableView fx:id=\"tablaRepuestos\" styleClass=\"dark-table\">\n      <columns>\n          <TableColumn fx:id=\"colCodigo\" text=\"Código\" prefWidth=\"110\"/>\n          <TableColumn fx:id=\"colNombre\" text=\"Repuesto\" prefWidth=\"250\"/>\n          <TableColumn fx:id=\"colStock\" text=\"Stock\" prefWidth=\"70\"/>\n          <TableColumn fx:id=\"colPrecio\" text=\"Precio Venta\" prefWidth=\"100\"/>\n      </columns>\n  </TableView>\n  ```\n* En `dark_theme.css`, personalice los colores del taller:\n  ```css\n  /* Fondo general estilo Dashboard Deportivo */\n  .root {\n      -fx-base: #0f172a;\n      -fx-background-color: #020617;\n  }\n  /* Botón de acento ámbar / verde racing */\n  .button-primary {\n      -fx-background-color: #f59e0b;\n      -fx-text-fill: #020617;\n      -fx-font-weight: bold;\n      -fx-background-radius: 8px;\n  }\n  ```\n\n---\n\n## 7. CONFIGURACIÓN DE MARCA Y LOGO POR CÓDIGO JAVA\n\nLa clase `com.mototaller.config.AppConfig.java` centraliza los datos corporativos:\n\n```java\npackage com.mototaller.config;\n\npublic class AppConfig {\n    public static String NOMBRE_TALLER = \"MOTO RACING PRO SERVICE\";\n    public static String SLOGAN = \"Centro Técnico Especializado & Repuestos\";\n    public static String NIT = \"900.548.120-4\";\n    public static String RUTA_LOGO = \"/images/logo_taller.png\";\n    public static String ADMIN_PASSWORD_HASH = \"admin123\";\n    public static double IVA_PORCENTAJE = 0.19; // 19%\n}\n```\n\n---\n\n## 8. GESTIÓN TRANSACCIONAL CON HIKARICP\n\nPara ejecutar ventas con descuento de inventario y Kardex atómico:\n\n```java\nConnection conn = null;\ntry {\n    conn = DatabaseConnection.getInstance().getConnection();\n    conn.setAutoCommit(false); // INICIO TRANSACCIÓN ACID\n\n    // 1. Insertar Factura\n    // 2. Insertar Detalles\n    // 3. Descontar Stock:\n    //    UPDATE repuesto SET stock_actual = stock_actual - ? WHERE id = ?\n    // 4. Insertar Kardex:\n    //    INSERT INTO kardex_movimiento ...\n\n    conn.commit(); // ÉXITO: Se confirman todos los cambios juntos\n} catch (SQLException ex) {\n    if (conn != null) {\n        conn.rollback(); // ERROR: Se deshacen todos los cambios, no hay inconsistencias\n    }\n    throw ex;\n} finally {\n    if (conn != null) {\n        conn.setAutoCommit(true);\n        conn.close(); // Devuelve la conexión al pool HikariCP\n    }\n}\n```\n"
  },
  {
    id: '05_instalacion',
    titulo: 'Manual de Instalación y Despliegue Local',
    subtitulo: 'De Google AI Studio a los Equipos del Taller en Red LAN',
    categoria: 'instalacion',
    icono: 'Download',
    descripcionCorta: 'De Google AI Studio a los Equipos del Taller en Red LAN',
    nombreArchivo: '05_MANUAL_INSTALACION_LOCAL_Y_DESCARGA.md',
    nombreWord: '05_Manual_de_Instalacion_y_Despliegue_Local.doc',
    urlWord: '/docs/word/05_Manual_de_Instalacion_y_Despliegue_Local.doc',
    contenido: "# MANUAL DE INSTALACIÓN, DESCARGA Y DESPLIEGUE LOCAL\n## SISTEMA MOTOGESTIÓN FX - DE GOOGLE AI STUDIO A LOS EQUIPOS DEL TALLER\n\n**Para:** Administradores de TI, Soporte Técnico y Dueños de Taller  \n**Versión:** 2.4.0  \n\n---\n\n### TABLA DE CONTENIDO\n1. Cómo Descargar el Proyecto desde Google AI Studio\n2. Requisitos Previos del Sistema (Hardware y Software)\n3. Instalación de Java JDK 21 y Apache Maven\n4. Configuración del Entorno en Visual Studio Code\n5. Compilación del Proyecto con Maven (`mvn clean package`)\n6. Generación de un Ejecutable Nativo (.exe) con JPackage\n7. Despliegue en Red Local (LAN) para Múltiples Equipos\n8. Mantenimiento y Respaldos Diarios\n\n---\n\n## 1. CÓMO DESCARGAR EL PROYECTO DESDE GOOGLE AI STUDIO\n\nPara trasladar este software a las computadoras físicas de su taller, siga uno de estos métodos:\n\n### Método A: Descarga en Archivo ZIP (Recomendado)\n1. En la interfaz de **Google AI Studio Build**, ubique el menú superior derecho de opciones del proyecto (icono de tres puntos o menú de archivo).\n2. Seleccione la opción **\"Download Project as ZIP\"** (Descargar Proyecto como ZIP) o **\"Export Code\"**.\n3. Guarde el archivo `.zip` en su computador (ej. `motogestion-fx-main.zip`).\n4. Haga clic derecho sobre el archivo y seleccione **\"Extraer todo...\"** en una carpeta de fácil acceso, por ejemplo:\n   * En Windows: `C:\\Sistemas\\motogestion-fx`\n   * En Linux/Mac: `~/Sistemas/motogestion-fx`\n\n### Método B: Clonar vía Git (Si sincronizó con GitHub / GitLab)\nAbra su terminal y ejecute:\n```bash\ngit clone <URL_DE_SU_REPOSITORIO>\ncd motogestion-fx\n```\n\n---\n\n## 2. REQUISITOS PREVIOS DEL SISTEMA\n\n### Requisitos de Hardware (Por cada PC del Taller):\n* **Procesador:** Intel Core i3 / AMD Ryzen 3 o superior (2 núcleos, 2.0 GHz+).\n* **Memoria RAM:** 4 GB mínimo (8 GB recomendados para mayor fluidez con gráficos HD).\n* **Almacenamiento:** 500 MB libres para la aplicación + 2 GB para la base de datos local.\n* **Pantalla:** Resolución mínima 1366 x 768 (Óptimo 1920 x 1080 Full HD).\n* **Conexión de Red:** Tarjeta de red Ethernet o Wi-Fi conectada al router del taller.\n\n### Requisitos de Software:\n* **Sistema Operativo:** Windows 10 / Windows 11 (64-bit), Ubuntu Linux 20.04+, o macOS Sonoma/Sequoia.\n\n---\n\n## 3. INSTALACIÓN DE JAVA JDK 21 Y APACHE MAVEN\n\nPara ejecutar y compilar aplicaciones JavaFX modernas, se recomienda **BellSoft Liberica JDK Full** (que ya incluye JavaFX integrado) o **Eclipse Temurin JDK 21**:\n\n### Paso 1: Instalar JDK 21 con JavaFX\n1. Ingrese a [https://bell-sw.com/pages/downloads/](https://bell-sw.com/pages/downloads/)\n2. En la sección **Package Type**, asegúrese de seleccionar **\"Full JDK\"** (versión 21 LTS).\n3. Descargue el instalador `.msi` para Windows o `.deb`/`.tar.gz` para Linux.\n4. Ejecute el instalador y marque la casilla: **\"Set JAVA_HOME variable\"** y **\"Add to PATH\"**.\n\n### Paso 2: Verificar la instalación en la Terminal\nAbra `cmd` o PowerShell y escriba:\n```bash\njava -version\n```\nDebe responder: `openjdk version \"21.0.x\" ...`\n\n### Paso 3: Instalar Apache Maven (Si no lo tiene)\n1. Descargue el archivo binario `.zip` desde [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)\n2. Descomprímalo en `C:\\Program Files\\apache-maven-3.9.6`\n3. Agregue la ruta `C:\\Program Files\\apache-maven-3.9.6\\bin` a las **Variables de Entorno (PATH)** de Windows.\n4. Verifique con:\n```bash\nmvn -version\n```\n\n---\n\n## 4. CONFIGURACIÓN EN VISUAL STUDIO CODE\n\n1. Abra Visual Studio Code.\n2. Vaya a la pestaña de Extensiones (`Ctrl + Shift + X`).\n3. Instale el paquete oficial de Microsoft: **\"Extension Pack for Java\"**.\n4. Instale también **\"Maven for Java\"**.\n5. Abra la carpeta del proyecto descargado: **Archivo -> Abrir Carpeta... -> `C:\\Sistemas\\motogestion-fx`**.\n6. VS Code detectará automáticamente el archivo `pom.xml` y descargará las dependencias necesarias (`javafx-controls`, `javafx-fxml`, `HikariCP`, `postgresql`, `sqlite-jdbc`).\n\n---\n\n## 5. COMPILACIÓN DEL PROYECTO CON MAVEN\n\nAbra la terminal integrada en VS Code (`Ctrl + ñ` o Terminal -> Nueva Terminal) y ejecute:\n\n```bash\n# Limpiar y compilar el proyecto\nmvn clean compile\n\n# Ejecutar la aplicación en modo desarrollo\nmvn javafx:run\n\n# Generar el archivo ejecutable JAR empaquetado\nmvn clean package\n```\n\nAl finalizar, encontrará el archivo ejecutable en:  \n`target/mototaller-javafx-1.0.0.jar`\n\nPara probar la ejecución directa del JAR:\n```bash\njava -jar target/mototaller-javafx-1.0.0.jar\n```\n\n---\n\n## 6. GENERACIÓN DE UN INSTALADOR EJECUTABLE NATIVO (.EXE)\n\nPara que los mecánicos y cajeros no tengan que abrir consolas ni instalar Java manualmente, podemos empaquetar un instalador `.exe` independiente usando la herramienta oficial `jpackage` incluida en JDK 21:\n\n```bash\njpackage \\\n  --input target/ \\\n  --name \"MotoGestionFX\" \\\n  --main-jar mototaller-javafx-1.0.0.jar \\\n  --main-class com.mototaller.MainApp \\\n  --type exe \\\n  --win-dir-chooser \\\n  --win-menu \\\n  --win-shortcut \\\n  --icon src/main/resources/images/icono_taller.ico\n```\n\nEsto generará un instalador `MotoGestionFX-1.0.0.exe` que crea un acceso directo en el escritorio de Windows con el logo de su taller.\n\n---\n\n## 7. DESPLIEGUE EN RED LOCAL (LAN) MULTIEQUIPO\n\nPara que las 4 terminales del taller compartan la misma información en tiempo real:\n\n```\n[ Router del Taller / Wi-Fi LAN ]\n           │\n ┌─────────┼──────────────────────────┬────────────────────────┐\n │ (Servidor LAN: 192.168.1.100)      │                        │\n ▼                                    ▼                        ▼\nTerminal 1: Caja / Servidor      Terminal 2: Mostrador   Terminal 3: Mecánicos\nPostgreSQL + MotoGestión FX      MotoGestión FX          MotoGestión FX (Tablet)\n```\n\n### Configuración en los Equipos Clientes:\nEn cada computadora del taller, abra el archivo `src/main/resources/database.properties`:\n\n```properties\ndb.type=lan_postgres\ndb.url=jdbc:postgresql://192.168.1.100:5432/mototaller_db\ndb.user=motouser\ndb.password=MotoPass2026!\ndb.pool.size=10\n```\n\nReemplace `192.168.1.100` por la IP fija de la computadora designada como Servidor Principal en su taller. ¡Listo! Todas las terminales compartirán stock, cotizaciones y kardex al instante.\n"
  },
  {
    id: '06_base_datos',
    titulo: 'Manual de Creación y Conexión de Bases de Datos',
    subtitulo: 'Microsoft Access, SQLite, PostgreSQL LAN y Bases en la Nube Gratuitas',
    categoria: 'base_datos',
    icono: 'Database',
    descripcionCorta: 'Microsoft Access, SQLite, PostgreSQL LAN y Bases en la Nube Gratuitas',
    nombreArchivo: '06_MANUAL_BASE_DATOS_ACCESS_Y_NUBE.md',
    nombreWord: '06_Manual_Conexion_Bases_de_Datos_Access_y_Nube.doc',
    urlWord: '/docs/word/06_Manual_Conexion_Bases_de_Datos_Access_y_Nube.doc',
    contenido: "# MANUAL DE CREACIÓN Y CONEXIÓN DE BASES DE DATOS\n## MICROSOFT ACCESS, SQLITE, POSTGRESQL LAN Y BASES DE DATOS EN LA NUBE GRATUITAS\n\n**Para:** Administradores de Base de Datos, Programadores y Gerentes de Taller  \n**Versión:** 2.4.0  \n\n---\n\n### TABLA DE CONTENIDO\n1. Aclaración Vital: ¿Sirve GitHub como Base de Datos?\n2. Crear y Conectar una Base de Datos Local en Microsoft Access (.accdb) con Java\n3. Por qué Access NO se Recomienda en Talleres Multi-Equipo\n4. Alternativa Local Recomendada #1: SQLite (`mototaller.db`)\n5. Alternativa Local Multi-Equipo #2: PostgreSQL Local LAN\n6. Bases de Datos Gratuitas en la Nube (Neon.tech & Supabase)\n7. Configuración Paso a Paso en `database.properties`\n\n---\n\n## 1. ACLARACIÓN VITAL: ¿SIRVE GITHUB COMO BASE DE DATOS?\n\n**Respuesta Técnica Directa: NO.**  \nExiste una confusión común entre **almacenar código** y **gestionar datos transaccionales**:\n\n* **¿Qué es GitHub?:** Es un servicio de almacenamiento y control de versiones para **archivos y código fuente** (usando Git). Está diseñado para guardar versiones históricas de archivos de texto (`.java`, `.html`, `.css`, `.sql`).\n* **¿Por qué NO sirve como base de datos de un taller?:**\n  1. **No soporta lenguaje SQL:** No se pueden ejecutar consultas como `SELECT`, `UPDATE` o `JOIN`.\n  2. **No tiene transacciones ACID:** Si dos mecánicos intentan descontar stock al mismo segundo, GitHub no puede bloquear la fila ni resolver la concurrencia; generaría un conflicto de fusión (*merge conflict*).\n  3. **No tiene seguridad de conexión:** Exponer credenciales o datos de clientes en un repositorio público o privado es inseguro y no cumple con la legislación de protección de datos (Habeas Data).\n  4. **Latencia extrema:** Hacer un `git commit` y `git push` por cada repuesto vendido tardaría entre 2 y 5 segundos, congelando la caja del taller.\n\n**Conclusión:** GitHub se usa para **respaldar y versionar el código de su aplicación Java**, pero los datos de su inventario deben guardarse en un motor de base de datos relacional como **SQLite**, **PostgreSQL** o un servicio en la nube como **Neon.tech**.\n\n---\n\n## 2. CREAR Y CONECTAR BASE DE DATOS EN MICROSOFT ACCESS (.accdb)\n\nSi por requerimiento interno de su empresa debe conectarse a un archivo de **Microsoft Access**:\n\n### Paso 1: Crear la Base de Datos en MS Access\n1. Abra Microsoft Access en Windows.\n2. Seleccione **\"Base de datos del escritorio en blanco\"**.\n3. Asígnele el nombre `mototaller.accdb` y guárdela en una ruta conocida, por ejemplo: `C:\\taller\\mototaller.accdb`.\n4. Cree las tablas `repuesto`, `proveedor`, `kardex_movimiento` y `factura_venta` con los tipos de datos equivalentes (Texto corto, Número entero, Moneda, Fecha/Hora).\n\n### Paso 2: Agregar el Driver JDBC de Access en `pom.xml`\nJava no incluye soporte nativo para Access desde Java 8. Se debe usar la librería de código abierto **UCanAccess**:\n\n```xml\n<dependencies>\n    <!-- Driver JDBC para Microsoft Access -->\n    <dependency>\n        <groupId>net.sf.ucanaccess</groupId>\n        <artifactId>ucanaccess</artifactId>\n        <version>5.0.1</version>\n    </dependency>\n</dependencies>\n```\n\n### Paso 3: Código de Conexión Java para Access\n```java\npackage com.mototaller.config;\n\nimport java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.SQLException;\n\npublic class AccessConnection {\n    private static final String RUTA_ARCHIVO = \"C:/taller/mototaller.accdb\";\n    private static final String URL_JDBC = \"jdbc:ucanaccess://\" + RUTA_ARCHIVO + \";memory=false\";\n\n    public static Connection getConnection() throws SQLException {\n        try {\n            Class.forName(\"net.sf.ucanaccess.jdbc.UcanaccessDriver\");\n            return DriverManager.getConnection(URL_JDBC);\n        } catch (ClassNotFoundException e) {\n            throw new SQLException(\"Driver UCanAccess no encontrado en el classpath.\", e);\n        }\n    }\n}\n```\n\n---\n\n## 3. LIMITACIONES SEVERAS DE MICROSOFT ACCESS EN UN TALLER\n\nAunque Access funciona para un único usuario en una sola computadora, **presenta graves fallas cuando se usa en un taller con varias terminales en red LAN**:\n\n1. **Bloqueo por archivo (*File Locking*):** Access no es un servidor de red; es un archivo compartido en una carpeta de Windows. Cuando la computadora de la Caja abre el archivo, frecuentemente bloquea el acceso de escritura para los mecánicos.\n2. **Riesgo de Corrupción de Datos:** Si un mecánico apaga su equipo o se desconecta la red Wi-Fi mientras se grababa una factura, el archivo `.accdb` puede corromperse por completo, perdiendo todo el inventario.\n3. **Límite de 2 GB:** El archivo no puede superar 2 GB de tamaño total.\n\nPor estas razones técnicas, la industria recomienda sustituir Access por **SQLite** (local monousuario) o **PostgreSQL** (local multi-equipo o nube).\n\n---\n\n## 4. ALTERNATIVA LOCAL RECOMENDADA #1: SQLITE\n\n**SQLite** es el motor de base de datos más utilizado del mundo. Al igual que Access, se almacena en un solo archivo (`mototaller.db`), pero es **inmune a la corrupción por caídas de energía**, es extremadamente rápido y no requiere instalar ningún programa adicional.\n\n* **Driver Maven:**\n  ```xml\n  <dependency>\n      <groupId>org.xerial</groupId>\n      <artifactId>sqlite-jdbc</artifactId>\n      <version>3.45.1.0</version>\n  </dependency>\n  ```\n* **Cadena de Conexión:**\n  ```properties\n  db.url=jdbc:sqlite:mototaller.db\n  ```\nEl archivo `mototaller.db` se creará automáticamente en la carpeta de la aplicación la primera vez que se ejecute.\n\n---\n\n## 5. ALTERNATIVA LOCAL MULTI-EQUIPO #2: POSTGRESQL LOCAL LAN\n\nSi en su taller no hay internet estable pero tienen 4 computadoras conectadas al mismo router:\n\n1. Instale **PostgreSQL 16** en la computadora principal del taller (ej. la de Caja).\n2. Durante la instalación, asigne la contraseña del superusuario `postgres`.\n3. Abra **pgAdmin 4** o la consola `psql` y cree la base de datos:\n   ```sql\n   CREATE DATABASE mototaller_db;\n   ```\n4. Ejecute el script `src/main/resources/sql/schema_postgresql.sql` que viene incluido en el proyecto.\n5. Permita conexiones en red local en el archivo `postgresql.conf`:\n   ```\n   listen_addresses = '*'\n   ```\n6. En `pg_hba.conf`, autorice el rango de su red LAN:\n   ```\n   host  all  all  192.168.1.0/24  scram-sha-256\n   ```\n\n---\n\n## 6. BASES DE DATOS GRATUITAS EN LA NUBE\n\nSi desea consultar el inventario desde su casa, desde el celular o sincronizar sucursales del taller, las mejores opciones **100% gratuitas** son:\n\n### Opción 1: Neon.tech (PostgreSQL Serverless - La Mejor Opción)\n* **¿Qué ofrece gratis?:**\n  * Servidor PostgreSQL 16 dedicado en la nube.\n  * 500 MB de almacenamiento (suficiente para más de 100,000 repuestos y 300,000 facturas).\n  * Consola web interactiva para ver y editar tablas con un clic.\n  * Conexiones cifradas SSL automáticas.\n* **Paso a Paso:**\n  1. Ingrese a [https://neon.tech](https://neon.tech) y cree una cuenta gratuita con su correo o GitHub.\n  2. Cree un nuevo proyecto: llámelo `mototaller-cloud`.\n  3. En el panel principal verá su cadena de conexión JDBC lista para copiar:\n     `jdbc:postgresql://ep-silent-shadow-a5abc.us-east-2.aws.neon.tech/neondb?sslmode=require`\n  4. Vaya a la pestaña **\"SQL Editor\"** en Neon, pegue el contenido de `schema_postgresql.sql` y presione **Run**. ¡Su base de datos estará activa en 10 segundos!\n\n### Opción 2: Supabase (PostgreSQL en la Nube)\n* **¿Qué ofrece gratis?:**\n  * Base de datos PostgreSQL con 500 MB de espacio gratuito.\n  * Panel web estilo hoja de cálculo para editar repuestos visualmente.\n  * Copias de seguridad automáticas.\n* **Paso a Paso:**\n  1. Ingrese a [https://supabase.com](https://supabase.com) y regístrese gratis.\n  2. Cree una organización y un proyecto: `mototaller-db`.\n  3. Vaya a **Project Settings -> Database -> Connection string -> JDBC**.\n  4. Copie la URL e ingrésela en su software.\n\n---\n\n## 7. CONFIGURACIÓN EN `database.properties`\n\nEn su proyecto Java, ubique el archivo `src/main/resources/database.properties`. Simplemente descomente el bloque que vaya a utilizar:\n\n```properties\n# ========================================================\n# PERFIL 1: BASE DE DATOS LOCAL SIN INSTALACIÓN (SQLITE)\n# ========================================================\ndb.driver=org.sqlite.JDBC\ndb.url=jdbc:sqlite:mototaller.db\ndb.user=\ndb.password=\ndb.pool.size=5\n\n# ========================================================\n# PERFIL 2: RED LOCAL LAN TALLER (POSTGRESQL MULTI-PC)\n# ========================================================\n# db.driver=org.postgresql.Driver\n# db.url=jdbc:postgresql://192.168.1.100:5432/mototaller_db\n# db.user=postgres\n# db.password=TuClaveSegura2026\n# db.pool.size=15\n\n# ========================================================\n# PERFIL 3: NUBE GRATUITA (NEON.TECH SERVERLESS)\n# ========================================================\n# db.driver=org.postgresql.Driver\n# db.url=jdbc:postgresql://ep-silent-shadow-a5abc.us-east-2.aws.neon.tech/neondb?sslmode=require\n# db.user=neondb_owner\n# db.password=TuClaveNeonSecret\n# db.pool.size=10\n```\n"
  },
  {
    id: '07_autoupdate',
    titulo: 'Manual de Despliegue .EXE, CI/CD y Auto-Update vía GitHub Releases',
    subtitulo: 'Compilación Automática con GitHub Actions y Actualización en Caliente de Terminales',
    categoria: 'despliegue',
    icono: 'Rocket',
    descripcionCorta: 'Compilación Automática con GitHub Actions y Actualización en Caliente de Terminales',
    nombreArchivo: '07_MANUAL_DESPLIEGUE_EXE_Y_AUTO_UPDATE_GITHUB.md',
    nombreWord: '07_Manual_Despliegue_EXE_y_Auto_Update_GitHub.doc',
    urlWord: '/docs/word/07_Manual_Despliegue_EXE_y_Auto_Update_GitHub.doc',
    contenido: `# MANUAL DE DESPLIEGUE DE EJECUTABLES (.EXE), INTEGRACIÓN CONTINUA (CI/CD) Y AUTO-ACTUALIZACIÓN AUTOMÁTICA VÍA GITHUB RELEASES
## SISTEMA MOTOGESTIÓN FX - ARQUITECTURA DE DISTRIBUCIÓN Y ACTUALIZACIÓN EN CALIENTE

**Para:** Sustentación de Proyecto ante el Docente, Arquitectos de Software y Equipo de Desarrollo  
**Versión de la Guía:** 2.4.0-PRO  
**Fecha:** Octubre 2026  

---

### TABLA DE CONTENIDO
1. Planteamiento del Problema: ¿Por qué no basta con subir a GitHub?
2. Arquitectura de Distribución de Software de Escritorio
3. El Ciclo de Auto-Actualización Automática (Auto-Updater)
4. Implementación con Electron Builder + GitHub Releases (Enfoque Web/Desktop)
5. Implementación en JavaFX con Update4j o JPackage Launcher
6. Configuración de GitHub Actions para Compilación Automática (CI/CD)
7. Seguridad Criptográfica, Rollback y Persistencia de la Base de Datos
8. Guía de Demostración Paso a Paso para el Profesor

---

## 1. PLANTEAMIENTO DEL PROBLEMA: ¿POR QUÉ NO BASTA CON SUBIR A GITHUB?

Cuando se desarrolla un sistema para un negocio real (como un taller mecánico con computadoras en mostrador, bahías de servicio y caja), existen dos realidades distintas:

1. **La computadora del Programador (Entorno de Desarrollo):**
   * Tiene instalado Git, Node.js, JDK de Java, Maven, VS Code o IntelliJ.
   * Modifica el código, prueba localmente y hace \`git push\` a GitHub.

2. **Las computadoras del Taller (Entorno de Producción / Usuario Final):**
   * Son operadas por cajeros, recepcionistas y mecánicos.
   * **No tienen ni deben tener instalado Git ni entornos de compilación.**
   * El usuario espera hacer doble clic en un icono en su escritorio de Windows (\`MotoGestion.exe\`) y trabajar sin preocuparse de comandos.

### El reto de las Actualizaciones:
Si el programador corrige un error o agrega 50 repuestos nuevos en GitHub:
* **El método anticuado e ineficiente:** Ir con una memoria USB a cada uno de los 5 computadores del taller, desinstalar la versión vieja e instalar la nueva manualmente.
* **El método moderno de ingeniería de software (Auto-Update):** El ejecutable instalado en cada PC consulta periódicamente a GitHub Releases. Al detectar una versión nueva, **descarga el parche en segundo plano y se actualiza solo**, exactamente igual a como se actualizan aplicaciones como WhatsApp Desktop, Discord, Spotify o Visual Studio Code.

---

## 2. ARQUITECTURA DE DISTRIBUCIÓN DE SOFTWARE DE ESCRITORIO

El sistema se compone de 4 capas:

\`\`\`
[ REPOSITORIO GITHUB ] 
       │ (git push origin main / git tag v1.2.0)
       ▼
[ GITHUB ACTIONS (CI/CD) ]  <-- Compilador automático en la nube de GitHub
       │ Genera: MotoGestion-Setup-1.2.0.exe + latest.yml (Hash SHA-512)
       ▼
[ GITHUB RELEASES ]         <-- Servidor de distribución seguro y gratuito
       │
       ├─────────────────────────────────┬─────────────────────────────────┐
       ▼                                 ▼                                 ▼
[ PC 1: CAJA ]                   [ PC 2: TALLER ]                  [ PC 3: RECEPCIÓN ]
(Consulta /releases/latest)       (Consulta /releases/latest)       (Consulta /releases/latest)
Detecta v1.2.0 > v1.0.0           Detecta v1.2.0 > v1.0.0           Detecta v1.2.0 > v1.0.0
Descarga e instala en silencio    Descarga e instala en silencio    Descarga e instala en silencio
\`\`\`

---

## 3. EL CICLO DE AUTO-ACTUALIZACIÓN AUTOMÁTICA (AUTO-UPDATER)

El proceso de auto-actualización sigue una máquina de estados estricta:

1. **Evento de Disparo (Trigger):**
   * Al iniciar la aplicación en el PC del taller, o cada 4 horas mediante un temporizador en segundo plano, la app llama al método \`autoUpdater.checkForUpdates()\`.
2. **Consulta a la API Pública de GitHub Releases:**
   * La app realiza una petición HTTP GET a:
     \`https://api.github.com/repos/TU_USUARIO/motogestion-fx/releases/latest\`
3. **Comparación Semántica de Versiones (SemVer):**
   * La app compara:
     * Versión local instalada: \`1.0.0\`
     * Versión publicada en GitHub: \`1.1.0\`
   * Si \`1.1.0 > 1.0.0\`, dispara el evento \`update-available\`.
4. **Descarga Diferencial o Completa en Segundo Plano:**
   * La app descarga el archivo instalador sin interrumpir el trabajo del mecánico o cajero.
   * Se comprueba la firma digital y el hash SHA-512 del archivo contra el manifest \`latest.yml\` para garantizar que el archivo no fue manipulado.
5. **Notificación Amigable al Usuario:**
   * Aparece una barra flotante en la esquina inferior:
     *"¡Nueva versión 1.1.0 lista! Novedades: Nuevas piezas de motor y mejora de facturas. [Reiniciar e Instalar]"*.
6. **Reemplazo Atómico e Inicio de la Nueva Versión:**
   * Al hacer clic en "Reiniciar e Instalar" (o al cerrar la app por la noche), el actualizador sustituye los binarios del programa e inicia inmediatamente la versión nueva.
   * **Importante:** Las configuraciones del taller, el logo, los datos de la base de datos local o en la nube **NUNCA se borran** porque residen en la carpeta de datos de usuario de Windows (\`%APPDATA%/MotoGestion/\`).

---

## 4. IMPLEMENTACIÓN CON ELECTRON BUILDER + GITHUB RELEASES

Para empaquetar la aplicación actual como un \`.exe\` con actualizador automático:

### A. Dependencias necesarias en \`package.json\`:
\`\`\`json
{
  "name": "motogestion-fx",
  "version": "1.0.0",
  "main": "electron/main.js",
  "scripts": {
    "build": "vite build",
    "electron:build": "vite build && electron-builder -w"
  },
  "devDependencies": {
    "electron": "^29.0.0",
    "electron-builder": "^24.13.3"
  },
  "dependencies": {
    "electron-updater": "^6.1.7"
  }
}
\`\`\`

### B. Configuración de \`electron-builder.yml\` para GitHub Releases:
\`\`\`yaml
appId: com.motogestion.app
productName: MotoGestion FX
directories:
  output: dist-electron

publish:
  provider: github
  owner: TU_USUARIO_GITHUB
  repo: motogestion-fx
  releaseType: release

win:
  target:
    - target: nsis
      arch:
        - x64
  icon: public/favicon.ico

nsis:
  oneClick: true
  perMachine: false
  allowToChangeInstallationDirectory: false
  deleteAppDataOnUninstall: false
\`\`\`

### C. Código del proceso principal (\`electron/main.js\`):
\`\`\`javascript
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'MotoGestión FX - Sistema de Taller',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!app.isPackaged) {
      console.log('Modo desarrollo: Saltando autoUpdater');
    } else {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
}

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('updater-status', { status: 'verificando' });
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('updater-status', { 
    status: 'disponible', 
    version: info.version 
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('updater-progress', {
    percent: Math.round(progressObj.percent),
    bytesPerSecond: progressObj.bytesPerSecond,
    transferred: progressObj.transferred,
    total: progressObj.total
  });
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('updater-status', { 
    status: 'descargado', 
    version: info.version 
  });
});

ipcMain.on('aplicar-actualizacion', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);
\`\`\`

---

## 5. IMPLEMENTACIÓN EN JAVAFX CON UPDATE4J

Si se compila la versión nativa en **Java 17/21 + JavaFX**, el estándar de la industria para auto-actualización es **Update4j** o un lanzador bootstrap liviano:

### Arquitectura de Update4j:
1. Se distribuye un ejecutable lanzador (\`bootstrap.jar\` o \`MotoGestion.exe\` generado con \`jpackage\`).
2. El lanzador lee un archivo XML remoto alojado en GitHub:
   \`https://raw.githubusercontent.com/TU_USUARIO/motogestion-fx/main/releases/config.xml\`
3. El archivo \`config.xml\` contiene la lista de archivos JAR y sus checksums SHA-256.
4. Si el checksum del JAR principal (\`motogestion-core-1.1.0.jar\`) difiere del local, descarga únicamente el nuevo JAR y arranca la aplicación actualizada sin reinstalar Java.

---

## 6. CONFIGURACIÓN DE GITHUB ACTIONS (CI/CD)

Para que **tú no tengas que compilar a mano en tu PC**, creamos el flujo de automatización en la nube de GitHub:

Archivo: \`.github/workflows/build-and-release.yml\`

\`\`\`yaml
name: Compilar y Publicar Ejecutable .EXE

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: windows-latest

    steps:
      - name: Clonar Código Fuente
        uses: actions/checkout@v4

      - name: Configurar Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar Dependencias
        run: npm ci

      - name: Compilar Frontend Vite
        run: npm run build

      - name: Compilar Instalador Windows .EXE y Publicar Release
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: npx electron-builder --win --publish always
\`\`\`

### ¿Cómo lanzas una nueva versión para que todos los talleres se actualicen?
Solo ejecutas estos 3 comandos en tu terminal de desarrollo:
\`\`\`bash
git add .
git commit -m "Nueva versión con repuestos de carreras y módulo fiscal"
git tag v1.1.0
git push origin main --tags
\`\`\`
¡Listo! Los servidores de GitHub se encargarán de compilar el \`.exe\` en segundo plano, publicarlo en GitHub Releases y todas las computadoras del taller recibirán la actualización automáticamente.

---

## 7. SEGURIDAD CRIPTOGRÁFICA Y PERSISTENCIA DE LA BASE DE DATOS

Un punto crítico para el profesor es la **integridad de los datos durante las actualizaciones**:

1. **¿Qué pasa con la base de datos cuando se actualiza el programa?**
   * El código ejecutable reside en: \`C:\\Users\\Usuario\\AppData\\Local\\Programs\\MotoGestion\\\`
   * La base de datos (SQLite o configuración de conexión PostgreSQL/Cloud) reside en: \`C:\\Users\\Usuario\\AppData\\Roaming\\MotoGestion\\\` o en el servidor Cloud (Neon/Supabase).
   * **Resultado:** La actualización reemplaza los binarios de la aplicación, pero la base de datos, clientes, ventas y facturas históricas permanecen 100% intactas.

2. **Verificación de Seguridad:**
   * El archivo \`latest.yml\` en GitHub Releases incluye una firma SHA-512.
   * Si un hacker intercepta la red o el archivo se descarga corrupto por un corte de internet, el instalador compara el hash y rechaza el archivo, evitando que la aplicación quede dañada.

---

## 8. GUÍA DE DEMOSTRACIÓN PASO A PASO PARA EL PROFESOR

En la sustentación académica, explica el flujo usando el **Simulador Interactivo de Despliegue CI/CD** incluido en el sistema:

1. **Paso 1 - Mostrar el Control de Versiones:**
   * Muestra que el sistema corre en la versión \`v1.0.0-PRO\`.
   * Explica que el código fuente está respaldado en el repositorio GitHub.
2. **Paso 2 - Simular la Orden de Actualización:**
   * Ingresa al panel de **"Despliegue .EXE & Auto-Updater"** en el Módulo de Administrador.
   * Selecciona la versión \`v1.1.0 (Mejoras en el Diagrama HD y Nuevas Motos)\`.
   * Presiona el botón: **"🚀 Simular Publicación en GitHub Releases"**.
3. **Paso 3 - Mostrar la Reacción en las Terminales:**
   * Señala cómo el cliente detecta la publicación remota.
   * Muestra la descarga en segundo plano con la barra de progreso y verificación del hash criptográfico.
4. **Paso 4 - Aplicar la Actualización:**
   * Haz clic en **"Reiniciar e Instalar Ahora"**.
   * La pantalla se refrescará mostrando la nueva versión \`v1.1.0\` en la barra superior, con los datos de inventario y configuración del taller intactos.
5. **Conclusión Académica para el Docente:**
   * *"Profesor, de esta manera el taller no depende de soporte técnico presencial: cualquier mejora o resolución legal se despliega a todas las computadoras del negocio de forma centralizada y segura a través de GitHub Releases."*
`
  }
];
