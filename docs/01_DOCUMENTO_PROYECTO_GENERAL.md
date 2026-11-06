# DOCUMENTO MAESTRO DEL PROYECTO: MOTOGESTIÓN FX
## Sistema Integral de Inventarios, Cotizaciones y Exploración Visual Multimedial para Taller de Motocicletas

**Versión:** 2.4.0-PRO  
**Arquitectura:** Java 17+ / JavaFX 21 (MVC + DAO) | Soporte Multi-Equipo LAN & Nube  
**Fecha:** Octubre 2026  
**Autor:** Equipo de Arquitectura de Software MotoGestión FX  

---

### TABLA DE CONTENIDO
1. Resumen Ejecutivo y Alcance
2. Pila Tecnológica y Especificaciones Técnicas
3. Arquitectura del Software (Patrón MVC + DAO + HikariCP)
4. Módulos Funcionales Desarrollados
5. Modelo de Datos Relacional y Esquema SQL
6. Control de Concurrencia y Red Local (LAN)
7. Seguridad y Control de Administrador
8. Estado Actual de Entrega y Madurez

---

## 1. RESUMEN EJECUTIVO Y ALCANCE
**MotoGestión FX** es un sistema de software de escritorio de alta fidelidad diseñado específicamente para modernizar las operaciones comerciales, técnicas y logísticas de talleres de motocicletas. 

A diferencia de los sistemas contables genéricos, MotoGestión FX introduce un **Módulo de Trabajo Interactivo Multimedial** basado en el esquema visual en alta definición de una motocicleta deportiva de alto rendimiento (Kawasaki Ninja ZX-10RR) y componentes para todas las marcas comerciales del mercado (Yamaha, Suzuki, Kawasaki, Bajaj, Honda, AKT, KTM). 

El sistema soluciona tres cuellos de botella críticos en los talleres de motos:
1. **Dificultad para identificar repuestos compatibles:** El mecánico u operario puede hacer clic directamente en la foto de la moto (ej. motor, suspensión, frenos, carenado, mandos) y el sistema despliega al instante el catálogo compatible con especificaciones de cilindraje (100cc a 1000cc), códigos OEM y stock físico.
2. **Desconexión entre mostrador y bodega:** El carrito de cotizaciones/ventas es persistente entre todas las vistas de la aplicación. Se pueden cotizar trabajos sin bloquear el inventario o facturar descontando stock en tiempo real con transaccionalidad ACID.
3. **Falta de trazabilidad en redes locales:** El sistema está preparado para funcionar en red local (LAN) con múltiples terminales (Recepción, Mecánicos, Bodega, Caja) conectadas a un servidor de base de datos único (PostgreSQL o SQLite).

---

## 2. PILA TECNOLÓGICA Y ESPECIFICACIONES TÉCNICAS

| Componente | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Lenguaje Base** | Java 17 LTS / Java 21 LTS | Tipado estático robusto, concurrencia avanzada, compatibilidad a largo plazo y multiplataforma. |
| **Interfaz Gráfica (GUI)** | JavaFX 21 + FXML | Renderizado acelerado por hardware (DirectX/OpenGL/Metal), enlaces de datos bidireccionales (`ObservableList`), layouts desacoplados FXML y hojas de estilo CSS. |
| **Gestor de Dependencias** | Apache Maven 3.9+ | Estandarización de compilación, gestión de dependencias y generación de paquetes ejecutables. |
| **Patrón Arquitectónico** | MVC (Model-View-Controller) + DAO (Data Access Object) | Separación estricta de responsabilidades entre GUI, lógica de negocio y persistencia de datos. |
| **Acceso a Datos** | JDBC Nativo + PreparedStatement | Máximo rendimiento sin sobrecargas de ORM pesados; protección total contra SQL Injection. |
| **Pool de Conexiones** | HikariCP 5.1.0 | El pool JDBC más rápido del ecosistema Java, con reconexión automática en caídas de red LAN. |
| **Base de Datos Local** | SQLite JDBC (`mototaller.db`) | Portabilidad inmediata sin requerir la instalación de un servidor SQL en pruebas iniciales o talleres monousuario. |
| **Base de Datos LAN / Nube** | PostgreSQL 14+ / Neon.tech / Supabase | Integridad referencial fuerte, transacciones ACID para Kardex, soporte para múltiples terminales en simultáneo y nubes gratuitas serverless. |

---

## 3. ARQUITECTURA DEL SOFTWARE (PATRÓN MVC + DAO)

El código fuente del sistema se estructura en capas independientes:

```
src/main/java/com/mototaller/
├── config/                  # Configuración global y lectura de database.properties
│   ├── AppConfig.java
│   └── DatabaseConnection.java (Singleton + HikariCP Pool)
├── model/                   # Capa de Modelo (Entidades y POJOs con propiedades observables)
│   ├── Repuesto.java
│   ├── Proveedor.java
│   ├── MovimientoKardex.java
│   ├── FacturaVenta.java
│   ├── ItemCarrito.java
│   ├── Cotizacion.java
│   └── TerminalLAN.java
├── dao/                     # Capa de Acceso a Datos (Interfaces y Contratos)
│   ├── RepuestoDAO.java
│   ├── KardexDAO.java
│   ├── VentaDAO.java
│   └── ProveedorDAO.java
├── dao/impl/                # Implementaciones JDBC de los DAOs
│   ├── RepuestoDAOImpl.java
│   ├── KardexDAOImpl.java
│   ├── VentaDAOImpl.java
│   └── ProveedorDAOImpl.java
├── controller/              # Capa de Controladores JavaFX
│   ├── MainViewController.java
│   ├── MotorcycleExplorerController.java
│   ├── InventoryController.java
│   ├── KardexController.java
│   ├── AdminController.java
│   └── CartSidebarController.java
└── MainApp.java             # Entry point del ciclo de vida JavaFX (start, init, stop)
```

---

## 4. MÓDULOS FUNCIONALES DESARROLLADOS

### 4.1. Módulo de Exploración Visual Interactivo (Diagrama Moto HD)
* **Visualización de alta definición:** Fotografía de motocicleta deportiva de alta gama con coordenadas de zonas técnicas.
* **Clickeable directamente en la foto:** 18 polígonos interactivos trazados sobre el carenaje, cúpula, frenos delanteros, calipers Brembo, suspensión invertida Showa, radiador, motor 998cc, embrague anti-rebote, escape Akrapovic, sillín, colín, basculante y cadena.
* **Filtrado contextual en 2 clics:** Al hacer clic en una parte (ej. Motor -> Pistón), la lista de repuestos filtra automáticamente por esa pieza, permitiendo además refinar por marca (Yamaha, Suzuki, Kawasaki, etc.) y cilindraje (100cc a 1000cc).
* **Adición inmediata al carrito:** Selector de cantidad integrado y advertencia de stock máximo disponible.

### 4.2. Carrito Persistente y Documentos Comerciales
* **Persistencia total:** El panel lateral permanece visible e inmutable mientras el usuario navega entre el Diagrama, Inventario, Kardex o Proveedores.
* **Generación de Cotizaciones:** Calcula subtotales, IVA parametrizable (ej. 19%) y total sin modificar inventario. Genera proforma con vigencia legal para entrega al cliente.
* **Facturación POS / Venta Atómica:** Valida stock disponible, descuenta inventario, genera el registro de venta con resolución DIAN/fiscal, e inserta automáticamente la transacción en el Kardex.

### 4.3. Inventario y Control de Stock en Tiempo Real
* **Monitoreo de Stock Mínimo:** Alertas visuales inmediatas cuando un repuesto alcanza o baja de su umbral de seguridad.
* **Filtros avanzados:** Búsqueda en vivo por código SKU, referencia OEM de fabricante, nombre, zona técnica, marca de moto y cilindraje.
* **Gestión de Precios:** Margen de rentabilidad calculado en base al costo unitario y precio de venta al público.

### 4.4. Control de Inventario / Kardex de Movimientos
* **Auditoría inmutable:** Asientos contables automáticos por:
  * `ENTRADA` (Recepción de pedidos de proveedores).
  * `VENTA` (Facturación directa desde el carrito).
  * `DEVOLUCION_PROVEEDOR` (Repuestos con defectos de fábrica).
  * `AJUSTE_INVENTARIO` (Corrección por inventario físico o pérdidas).
* **Trazabilidad de puestos:** Cada movimiento almacena la fecha/hora exacta, saldo anterior, cantidad, saldo posterior, documento de referencia y nombre/IP de la terminal responsable.

### 4.5. Proveedores y Órdenes de Entrada / Devolución
* **Ficha de Proveedores:** NIT, Razón Social, Teléfono, Correo, Dirección y Ciudad.
* **Órdenes de Entrada:** Recepción de mercancía que suma al stock existente y actualiza el costo ponderado.
* **Gestión de Devoluciones:** Proceso formal para devolver piezas defectuosas a proveedores con motivo documentado y ajuste automático del Kardex.

### 4.6. Módulo de Administrador con Contraseña
* **Seguridad por PIN / Clave Maestra:** Protege contra modificaciones no autorizadas por parte de operadores o mecánicos.
* **Identidad Corporativa:** Nombre de la empresa, slogan, NIT, teléfonos, dirección y carga interactiva del Logo del Taller (visible en cabecera y facturas).
* **Parámetros del Sistema:** Configuración de IVA, prefijos de facturación y cotización, vigencia, términos legales y alertas de stock.
* **Gestión de Terminales LAN:** Registro de IPs y nombres de estaciones de trabajo del taller.

---

## 5. MODELO DE DATOS RELACIONAL Y ESQUEMA SQL

El sistema cuenta con un esquema normalizado en 3ra Forma Normal (3NF) compuesto por las siguientes tablas principales:
1. `configuracion_taller`: Parámetros globales, rutas de logo y PIN de administrador.
2. `proveedor`: Proveedores y distribuidores de repuestos.
3. `zona_moto`: Zonas anatómicas de la motocicleta.
4. `repuesto`: Maestro de repuestos con SKU, OEM, compatibilidades, precios y stock.
5. `kardex_movimiento`: Libro mayor de movimientos de inventario.
6. `factura_venta` y `detalle_factura_venta`: Encabezado y líneas de venta POS.
7. `cotizacion` y `detalle_cotizacion`: Cotizaciones y proformas comerciales.
8. `orden_compra` y `detalle_orden_compra`: Pedidos a distribuidores.

---

## 6. CONTROL DE CONCURRENCIA Y RED LOCAL (LAN)
Para permitir que múltiples mecánicos y cajeros trabajen simultáneamente:
1. **Transacciones ACID:** Las ventas usan `conn.setAutoCommit(false)`, ejecutando la factura, detalles, descuento de stock y asiento en Kardex en un bloque atómico. Si la red falla, se aplica `conn.rollback()`.
2. **Nivel de Aislamiento:** `TRANSACTION_READ_COMMITTED` para evitar lecturas sucias de stock.
3. **Pool HikariCP:** Mantiene conexiones calientes preabiertas reduciendo la latencia de red a menos de 2 milisegundos por consulta en la LAN.

---

## 7. ESTADO ACTUAL DE ENTREGA
El proyecto cuenta con:
* Código fuente Java completo (Modelos, DAOs, Controladores, Vistas FXML y Singleton JDBC).
* Scripts SQL compatibles con PostgreSQL y SQLite.
* Entorno interactivo para pruebas en tiempo real con simulación multiequipo.
* Módulo de Administrador autenticado por contraseña.
* Catálogo maestro de repuestos para motos deportivas, calle y trabajo de todas las marcas y cilindrajes.
