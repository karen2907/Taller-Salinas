# DOCUMENTO TÉCNICO DE ARQUITECTURA Y ESPECIFICACIÓN DEL PROYECTO
# SISTEMA MOTOGESTIÓN FX - TALLER DE MOTOCICLETAS, INVENTARIO Y COTIZACIONES

---

## 1. INTRODUCCIÓN Y PROPÓSITO DEL SISTEMA
**MotoGestión FX** es una solución de software de escritorio de alto rendimiento diseñada para la administración integral de inventarios, gestión de proveedores, kardex de movimientos en tiempo real, facturación electrónica y cotizaciones interactivas en talleres de motocicletas. 

El sistema combina:
1. Una **interfaz gráfica multimedial e interactiva en JavaFX 21**, con un diagrama técnico de motocicleta en alta definición (Kawasaki Ninja ZX-10RR y modelos multimarca) con 18 zonas interactivas directamente clickeables sobre el cuerpo de la moto.
2. Una **arquitectura desacoplada Modelo-Vista-Controlador (MVC) y Patrón DAO (Data Access Object)** en **Java 17+**.
3. Un **gestor de conexiones transaccionales mediante HikariCP**, con soporte nativo para **Red Local (LAN)** en el taller (múltiples terminales simultáneas) y compatibilidad con bases de datos en la **Nube** (PostgreSQL Serverless en Neon.tech o Supabase) o **Base de Datos Local sin instalación (SQLite)**.
4. Un **Módulo de Administrador con autenticación por contraseña / PIN**, que protege las configuraciones fiscales, identidad corporativa, logo, parámetros de módulos y código fuente de accesos no autorizados.

---

## 2. PILA TECNOLÓGICA (TECH STACK)
* **Lenguaje de Programación:** Java 17 LTS / Java 21 LTS.
* **Interfaz Gráfica de Usuario (GUI):** JavaFX 21 (Fxml + CSS Dark Theme + Controles reactivos observables).
* **Gestor de Dependencias y Construcción:** Apache Maven 3.9+.
* **Patrón de Persistencia:** Data Access Object (DAO) con JDBC nativo y sentencias preparadas (`PreparedStatement`).
* **Pool de Conexiones:** HikariCP 5.1.0 (Pool de alto rendimiento con reconexión automática y protección TCP).
* **Bases de Datos Compatibles:**
  * **SQLite (Local):** `org.xerial:sqlite-jdbc` (Un solo archivo `mototaller.db`, cero instalación de servidores).
  * **PostgreSQL (LAN y Nube):** `org.postgresql:postgresql` (Versiones 14+ locales o nubes gratuitas como Neon.tech / Supabase con SSL).
  * **MySQL (Opcional):** `com.mysql:mysql-connector-j`.
* **Entorno de Desarrollo Recomendado:** Visual Studio Code con Extension Pack for Java.

---

## 3. ARQUITECTURA DEL SISTEMA (PATRÓN MVC + DAO)

El proyecto está organizado en 4 capas estrictamente desacopladas:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CAPA DE PRESENTACIÓN (JavaFX 21 GUI)                     │
│    - MainApp.java (Stage, Scene, Icono del Taller)          │
│    - MainViewController.java (Controlador FXML)            │
│    - MainView.fxml / dark_theme.css                         │
│    - Diagrama Interactivo de Moto con Hitpolygons SVG       │
│    - Panel Lateral: Carrito Persistente Multi-Zona          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Eventos de Usuario
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CAPA DE MODELOS DE DOMINIO (POJOs JavaFX Observables)    │
│    - Repuesto.java (Propiedades observables StringProperty) │
│    - Proveedor.java / MovimientoKardex.java                 │
│    - FacturaVenta.java / ItemCarrito.java / Cotizacion.java │
│    - TallerConfig.java / TerminalLAN.java                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Transferencia de Datos
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CAPA DE ACCESO A DATOS (Patrón DAO)                      │
│    - RepuestoDAO (Interfaz) -> RepuestoDAOImpl (JDBC)       │
│    - KardexDAO (Interfaz)   -> KardexDAOImpl (JDBC)         │
│    - VentaDAO (Interfaz)    -> VentaDAOImpl (ACID Trans.)   │
│    - ProveedorDAO           -> ProveedorDAOImpl             │
└──────────────────────────────┬──────────────────────────────┘
                               │ Consultas SQL Preparadas
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. CAPA DE PERSISTENCIA & CONEXIÓN                          │
│    - DatabaseConnection.java (Patrón Singleton con HikariCP)│
│    - database.properties (Selector de perfil de conexión)   │
│    - Motores: SQLite Local | PostgreSQL LAN | Neon Cloud     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. MODELO DE DATOS RELACIONAL (ESQUEMA SQL)

### Tablas Principales:
1. `configuracion_taller`: Almacena el nombre de la compañía, slogan, NIT, teléfonos, dirección, ruta del logo y PIN de administrador.
2. `proveedor`: NIT, Razón Social, Teléfono, Correo, Dirección, Ciudad y Contacto.
3. `zona_moto`: Clasificación técnica (Motor, Sistema Eléctrico, Frenos y Suspensión, Mandos y Guayas, Chasis y Carenaje).
4. `repuesto`: Catálogo de inventario con Código SKU, Referencia OEM de fabricante, Marca de moto compatible, Cilindraje (100cc a 1000cc), Stock Actual, Stock Mínimo de Alerta, Precio Costo y Precio Venta.
5. `kardex_movimiento`: Historial inmutable de auditoría (Entradas, Salidas, Ventas, Devoluciones a Proveedor, Ajustes de Conteo Físico) con saldo anterior, saldo posterior, costo unitario y usuario/terminal responsable.
6. `factura_venta` y `detalle_factura_venta`: Registro de transacciones comerciales con datos de cliente, placa de moto, método de pago, desglose de IVA y totales.
7. `cotizacion`: Proformas valorizadas sin descuento de inventario, con fecha de vigencia y términos legales.
8. `orden_compra` y `detalle_orden_compra`: Control de compras y recepción de repuestos con proveedores.

---

## 5. TRANSACCIONALIDAD ACID EN VENTAS Y KARDEX
Para garantizar que nunca exista descuadre de stock ni inconsistencia en red local:
* El método `facturarVenta(FacturaVenta factura)` en `VentaDAOImpl.java` desactiva el `autoCommit(false)`.
* En una **sola transacción atómica**:
  1. Inserta el encabezado en `factura_venta`.
  2. Inserta cada ítem en `detalle_factura_venta`.
  3. Ejecuta `UPDATE repuesto SET stock_actual = stock_actual - ? WHERE id = ?`.
  4. Inserta el asiento contable en `kardex_movimiento` con `tipo = 'VENTA'`.
* Si cualquier operación falla o hay congestión en la red LAN, se ejecuta `conn.rollback()` y se lanza una excepción al usuario, impidiendo ventas a medias o datos corruptos.

---

## 6. MÓDULO DE SEGURIDAD Y CONTROL DE ADMINISTRADOR
* **PIN de Protección:** El acceso a la configuración del logo, datos fiscales, edición de terminales, ajustes de base de datos y scripts de arquitectura requiere la autenticación mediante el PIN maestro de administrador.
* **Sesión Segura:** Una vez verificado el PIN, se habilita la administración hasta que el usuario decida bloquear nuevamente el sistema con el botón "Cerrar Sesión Admin".
* **Separación de Roles:** Los operarios en mostrador y mecánicos en bahías solo tienen acceso a la consulta del diagrama, catálogo de repuestos, armado de cotizaciones y facturación sin ver ni modificar datos sensibles del negocio.
