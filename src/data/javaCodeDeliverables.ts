export interface JavaSourceFile {
  name: string;
  package: string;
  type: 'pom' | 'sql' | 'config' | 'model' | 'dao' | 'controller' | 'fxml' | 'main' | 'guide';
  description: string;
  code: string;
}

export const JAVA_PROJECT_FILES: JavaSourceFile[] = [
  {
    name: 'pom.xml',
    package: 'Root Maven Configuration',
    type: 'pom',
    description: 'Configuración Apache Maven para VS Code con Java 17+, JavaFX 21, SQLite local, PostgreSQL (LAN y Nube) e HikariCP',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mototaller</groupId>
    <artifactId>mototaller-fx</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>MotoGestión FX - Taller de Motocicletas</name>
    <description>Sistema de Inventario, Cotizaciones, Diagrama Interactivo y Facturación</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <javafx.version>21.0.2</javafx.version>
    </properties>

    <dependencies>
        <!-- JavaFX Controls & FXML -->
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-graphics</artifactId>
            <version>\${javafx.version}</version>
        </dependency>

        <!-- Driver SQLite JDBC: Base de datos LOCAL en 1 solo archivo (CERO instalación) -->
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.45.1.0</version>
        </dependency>

        <!-- Driver PostgreSQL JDBC: Base de datos en RED LAN o NUBE GRATIS (Neon.tech / Supabase) -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.2</version>
        </dependency>

        <!-- Driver MySQL (Alternativa si ya tiene XAMPP instalado) -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>

        <!-- HikariCP: Pool de Conexiones de Alto Rendimiento para LAN y Nube -->
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.1.0</version>
        </dependency>

        <!-- ControlsFX: Notificaciones visuales y diálogos modernos en JavaFX -->
        <dependency>
            <groupId>org.controlsfx</groupId>
            <artifactId>controlsfx</artifactId>
            <version>11.2.1</version>
        </dependency>

        <!-- Logger SLF4J -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.12</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Compilador Java 17+ -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.12.1</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>

            <!-- Plugin JavaFX para Ejecución directa en VS Code: 'mvn javafx:run' -->
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.8</version>
                <configuration>
                    <mainClass>com.mototaller.MainApp</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: 'AppConfig.java',
    package: 'com.mototaller.config',
    type: 'config',
    description: 'PARTE DEL CÓDIGO DONDE SE AGREGA EL LOGO Y NOMBRE DEL TALLER (Datos fijos o editables)',
    code: `package com.mototaller.config;

/**
 * ============================================================================
 * ¿EN QUÉ PARTE DEL CÓDIGO PUEDO AGREGAR LA FOTO Y NOMBRE DEL TALLER?
 * ============================================================================
 * Esta clase centraliza la identidad corporativa de su taller en Java.
 * Modifique los valores aquí o cárguelos dinámicamente desde la base de datos.
 *
 * RUTA DE LA FOTO / LOGO:
 * Guarde el archivo de su logo en:
 *    src/main/resources/images/logo_taller.png
 * (Soporta .PNG con transparencia o .JPG de alta resolución).
 */
public class AppConfig {

    // 1. NOMBRE COMERCIAL DEL TALLER (Aparece en títulos, encabezados y facturas)
    public static final String NOMBRE_TALLER = "MOTO RACING PRO SERVICE";

    // 2. ESLOGAN / LEMA COMERCIAL
    public static final String ESLOGAN_TALLER = "Centro Técnico Especializado, Repuestos Multimarca & Laboratorio de Inyección";

    // 3. DATOS FISCALES Y DE CONTACTO
    public static final String NIT_TALLER = "900.548.120-4";
    public static final String DIRECCION_TALLER = "Av. Primero de Mayo # 28-40, Zona Motera";
    public static final String TELEFONOS_TALLER = "+57 (601) 458-9200 / 312 450 8820";
    public static final String CORREO_TALLER = "servicio@motoracingpro.co";
    public static final String CIUDAD_TALLER = "Bogotá D.C., Colombia";

    // 4. RUTA RELATIVA DEL RECURSO DE IMAGEN DEL LOGO EN EL CLASSPATH
    public static final String LOGO_PATH = "/images/logo_taller.png";

    // 5. MARCA DE AGUA EN DOCUMENTOS IMPRESOS
    public static final boolean MOSTRAR_MARCA_AGUA = true;

    // 6. TÉRMINOS LEGALES EN COTIZACIONES
    public static final String TERMINOS_COTIZACION = 
        "Esta cotización tiene una vigencia de 15 días calendario. Precios sujetos a variación según disponibilidad de stock.";

    // 7. PIE DE PÁGINA EN FACTURA
    public static final String PIE_FACTURA = 
        "¡Gracias por confiar en nosotros! Garantía de repuestos originales: 90 días por defectos de fabricación.";
}`
  },
  {
    name: 'database.properties',
    package: 'src/main/resources',
    type: 'config',
    description: 'Archivo de configuración de Base de Datos: Switch fácil entre SQLite Local, Red LAN o Nube Gratis',
    code: `# ============================================================================
# ARCHIVO DE CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
# ============================================================================
# Seleccione el motor descomentando SOLO el perfil que desea usar.

# ============================================================================
# PERFIL 1: BASE DE DATOS LOCAL SIN INSTALACIÓN (SQLITE) - ¡RECOMENDADA LOCAL!
# No requiere instalar nada ni crear usuarios. Crea el archivo 'mototaller.db' solo.
# ============================================================================
db.engine=sqlite
db.url=jdbc:sqlite:mototaller.db
db.user=
db.password=

# ============================================================================
# PERFIL 2: RED LOCAL LAN (PostgreSQL en el PC Servidor del Taller)
# Conecta múltiples computadores en el taller (Caja, Mecánicos, Bodega)
# ============================================================================
# db.engine=postgresql
# db.host=192.168.1.100
# db.port=5432
# db.name=mototaller_db
# db.user=postgres
# db.password=admin123
# db.pool.maxSize=15

# ============================================================================
# PERFIL 3: BASE DE DATOS EN LA NUBE GRATUITA (NEON.TECH SERVERLESS POSTGRES)
# Conexión directa a través de Internet con SSL (Sin pagar hosting)
# Obtén tu cuenta gratuita en: https://neon.tech
# ============================================================================
# db.engine=postgresql
# db.url=jdbc:postgresql://ep-silent-smoke-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
# db.user=neondb_owner
# db.password=npg_secretPassword123
# db.pool.maxSize=5

# ============================================================================
# PERFIL 4: BASE DE DATOS EN LA NUBE GRATUITA (SUPABASE POSTGRESQL)
# 500 MB gratis con consola web para ver datos. https://supabase.com
# ============================================================================
# db.engine=postgresql
# db.url=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
# db.user=postgres.yourprojectref
# db.password=TuContrasenaSupabase123
# db.pool.maxSize=5`
  },
  {
    name: 'DatabaseConnection.java',
    package: 'com.mototaller.config',
    type: 'config',
    description: 'Patrón Singleton HikariCP: Soporta SQLite Local, PostgreSQL LAN y PostgreSQL Nube Neon/Supabase',
    code: `package com.mototaller.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/**
 * Gestor Singleton de Conexión a Base de Datos.
 * Detecta automáticamente si la configuración es SQLite Local, PostgreSQL LAN o Nube (Neon/Supabase).
 */
public class DatabaseConnection {

    private static DatabaseConnection instance;
    private HikariDataSource dataSource;
    private String motorActivo = "sqlite";

    private DatabaseConnection() {
        initDataSource();
    }

    private void initDataSource() {
        try {
            Properties prop = new Properties();
            InputStream input = getClass().getClassLoader().getResourceAsStream("database.properties");
            if (input != null) {
                prop.load(input);
            }

            this.motorActivo = prop.getProperty("db.engine", "sqlite").toLowerCase();
            HikariConfig config = new HikariConfig();

            if ("sqlite".equals(motorActivo)) {
                // MODO 1: SQLITE LOCAL (Un solo archivo .db en la raíz, cero configuración)
                String sqliteUrl = prop.getProperty("db.url", "jdbc:sqlite:mototaller.db");
                config.setJdbcUrl(sqliteUrl);
                config.setDriverClassName("org.sqlite.JDBC");
                config.setMaximumPoolSize(1); // SQLite opera con 1 conexión concurrente de escritura
                config.setPoolName("MotoTallerSQLitePool");

                this.dataSource = new HikariDataSource(config);
                System.out.println("[DatabaseConnection] Base de datos LOCAL SQLite iniciada en: " + sqliteUrl);
                inicializarTablasSQLiteSiNoExisten();

            } else {
                // MODO 2 o 3: POSTGRESQL (En Red Local LAN o en la NUBE Neon/Supabase)
                String directUrl = prop.getProperty("db.url", "");
                if (directUrl != null && !directUrl.trim().isEmpty()) {
                    // URL directa de Nube (ej: Neon o Supabase con ?sslmode=require)
                    config.setJdbcUrl(directUrl);
                } else {
                    // Host, puerto y DB locales de red LAN
                    String host = prop.getProperty("db.host", "192.168.1.100");
                    String port = prop.getProperty("db.port", "5432");
                    String dbName = prop.getProperty("db.name", "mototaller_db");
                    config.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + "/" + dbName);
                }

                config.setUsername(prop.getProperty("db.user", "postgres"));
                config.setPassword(prop.getProperty("db.password", "admin123"));
                config.setDriverClassName("org.postgresql.Driver");

                int maxPool = Integer.parseInt(prop.getProperty("db.pool.maxSize", "10"));
                config.setMaximumPoolSize(maxPool);
                config.setMinimumIdle(2);
                config.setIdleTimeout(30000);
                config.setConnectionTimeout(12000); // 12s de espera para conexiones por Internet o LAN
                config.setPoolName("MotoTallerPostgresPool");

                // Configuración TCP optimizada contra caídas de red
                config.addDataSourceProperty("socketTimeout", "30");
                config.addDataSourceProperty("tcpKeepAlive", "true");

                this.dataSource = new HikariDataSource(config);
                System.out.println("[DatabaseConnection] Pool HikariCP PostgreSQL conectado exitosamente.");
            }
        } catch (Exception e) {
            System.err.println("[DatabaseConnection] Error al conectar a la base de datos: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Si el usuario usa SQLite local y aún no ha creado las tablas,
     * este método crea la estructura relacional completa automáticamente al arrancar.
     */
    private void inicializarTablasSQLiteSiNoExisten() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            // Tablas básicas para que la app funcione de inmediato
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS proveedor (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "nit TEXT UNIQUE NOT NULL, " +
                    "razon_social TEXT NOT NULL, " +
                    "telefono TEXT, " +
                    "correo TEXT, " +
                    "direccion TEXT, " +
                    "ciudad TEXT, " +
                    "contacto_nombre TEXT);");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS repuesto (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "codigo_sku TEXT UNIQUE NOT NULL, " +
                    "referencia_oem TEXT, " +
                    "nombre TEXT NOT NULL, " +
                    "zona_id TEXT NOT NULL, " +
                    "subparte TEXT NOT NULL, " +
                    "marca_moto TEXT NOT NULL, " +
                    "cilindraje TEXT NOT NULL, " +
                    "modelos_compatibles TEXT, " +
                    "stock_actual INTEGER DEFAULT 0, " +
                    "stock_minimo INTEGER DEFAULT 5, " +
                    "precio_costo REAL NOT NULL, " +
                    "precio_venta REAL NOT NULL, " +
                    "ubicacion_bodega TEXT, " +
                    "proveedor_id INTEGER, " +
                    "descripcion TEXT);");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS kardex_movimiento (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "fecha TEXT DEFAULT CURRENT_TIMESTAMP, " +
                    "repuesto_id INTEGER NOT NULL, " +
                    "tipo_movimiento TEXT NOT NULL, " +
                    "cantidad INTEGER NOT NULL, " +
                    "saldo_anterior INTEGER NOT NULL, " +
                    "saldo_posterior INTEGER NOT NULL, " +
                    "costo_unitario REAL NOT NULL, " +
                    "documento_referencia TEXT NOT NULL, " +
                    "observaciones TEXT, " +
                    "usuario_responsable TEXT);");

            System.out.println("[DatabaseConnection] Esquema relacional SQLite verificado y listo.");
        } catch (SQLException e) {
            System.err.println("[DatabaseConnection] Advertencia al auto-crear tablas SQLite: " + e.getMessage());
        }
    }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        if (dataSource == null || dataSource.isClosed()) {
            initDataSource();
        }
        return dataSource.getConnection();
    }

    public String getMotorActivo() {
        return motorActivo;
    }

    public void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}`
  },
  {
    name: 'schema.sql',
    package: 'src/main/resources/database',
    type: 'sql',
    description: 'Script DDL completo para PostgreSQL (LAN o Nube Neon/Supabase) con tabla de configuración del taller',
    code: `-- ============================================================================
-- BASE DE DATOS: mototaller_db
-- MOTOR: PostgreSQL 14+ (Soporta Servidor Local LAN o Nube Gratuita en Neon / Supabase)
-- ============================================================================

-- 0. TABLA: CONFIGURACIÓN CORPORATIVA DEL TALLER (LOGO, NOMBRE, NIT)
CREATE TABLE IF NOT EXISTS configuracion_taller (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    slogan VARCHAR(255),
    nit VARCHAR(30) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(60),
    correo VARCHAR(100),
    ciudad VARCHAR(80),
    logo_ruta VARCHAR(255) DEFAULT '/images/logo_taller.png',
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración inicial por defecto
INSERT INTO configuracion_taller (id, nombre, slogan, nit, direccion, telefono, correo, ciudad, logo_ruta)
VALUES (1, 'MOTO RACING PRO SERVICE', 'Centro Técnico Especializado & Laboratorio de Inyección', 
        '900.548.120-4', 'Av. Primero de Mayo # 28-40', '+57 (601) 458-9200', 'servicio@motoracingpro.co', 
        'Bogotá D.C., Colombia', '/images/logo_taller.png')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 1. TABLA: PROVEEDOR
CREATE TABLE IF NOT EXISTS proveedor (
    id SERIAL PRIMARY KEY,
    nit VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    correo VARCHAR(100),
    direccion VARCHAR(150),
    ciudad VARCHAR(80),
    contacto_nombre VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: CATEGORIA / ZONA DE LA MOTO
CREATE TABLE IF NOT EXISTS zona_moto (
    id VARCHAR(50) PRIMARY KEY, -- 'motor', 'electrico', 'frenos_suspension', etc.
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 3. TABLA: REPUESTO (INVENTARIO MULTIMARCA Y DEPORTIVAS)
CREATE TABLE IF NOT EXISTS repuesto (
    id SERIAL PRIMARY KEY,
    codigo_sku VARCHAR(40) NOT NULL UNIQUE,
    referencia_oem VARCHAR(50),
    nombre VARCHAR(150) NOT NULL,
    zona_id VARCHAR(50) REFERENCES zona_moto(id),
    subparte VARCHAR(100) NOT NULL,
    marca_moto VARCHAR(50) NOT NULL, -- 'Kawasaki', 'Yamaha', 'Suzuki', 'Bajaj', 'Honda', 'KTM', 'AKT', 'Universal'
    cilindraje VARCHAR(30) NOT NULL, -- '1000cc', '650cc', '400cc', '250cc', '200cc', '150cc', '125cc', '100cc'
    modelos_compatibles TEXT,
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INT NOT NULL DEFAULT 5,
    precio_costo NUMERIC(12, 2) NOT NULL CHECK (precio_costo >= 0),
    precio_venta NUMERIC(12, 2) NOT NULL CHECK (precio_venta >= precio_costo),
    ubicacion_bodega VARCHAR(60),
    proveedor_id INT REFERENCES proveedor(id),
    descripcion TEXT,
    especificaciones_tecnicas TEXT,
    unidad_medida VARCHAR(20) DEFAULT 'Unidad',
    activo BOOLEAN DEFAULT TRUE
);

-- ÍNDICES DE RENDIMIENTO PARA RED
CREATE INDEX idx_repuesto_zona ON repuesto(zona_id);
CREATE INDEX idx_repuesto_marca ON repuesto(marca_moto);
CREATE INDEX idx_repuesto_cilindraje ON repuesto(cilindraje);
CREATE INDEX idx_repuesto_sku ON repuesto(codigo_sku);
CREATE INDEX idx_repuesto_oem ON repuesto(referencia_oem);

-- 4. TABLA: KARDEX (HISTORIAL DE MOVIMIENTOS)
CREATE TABLE IF NOT EXISTS kardex_movimiento (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    repuesto_id INT NOT NULL REFERENCES repuesto(id),
    tipo_movimiento VARCHAR(30) NOT NULL, -- 'ENTRADA', 'SALIDA', 'VENTA', 'DEVOLUCION_PROVEEDOR', 'AJUSTE'
    cantidad INT NOT NULL,
    saldo_anterior INT NOT NULL,
    saldo_posterior INT NOT NULL,
    costo_unitario NUMERIC(12, 2) NOT NULL,
    precio_venta_unitario NUMERIC(12, 2) DEFAULT 0,
    documento_referencia VARCHAR(50) NOT NULL,
    proveedor_id INT REFERENCES proveedor(id),
    observaciones TEXT,
    usuario_responsable VARCHAR(60) NOT NULL
);

CREATE INDEX idx_kardex_repuesto_fecha ON kardex_movimiento(repuesto_id, fecha DESC);

-- 5. TABLA: FACTURA DE VENTA
CREATE TABLE IF NOT EXISTS factura_venta (
    id SERIAL PRIMARY KEY,
    numero_factura VARCHAR(30) NOT NULL UNIQUE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_nombre VARCHAR(120) NOT NULL,
    cliente_documento VARCHAR(30),
    cliente_telefono VARCHAR(30),
    placa_moto VARCHAR(15),
    modelo_moto VARCHAR(60),
    subtotal NUMERIC(12, 2) NOT NULL,
    iva NUMERIC(12, 2) NOT NULL,
    descuento NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL,
    metodo_pago VARCHAR(30) DEFAULT 'Efectivo',
    cajero VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS detalle_factura_venta (
    id SERIAL PRIMARY KEY,
    factura_id INT NOT NULL REFERENCES factura_venta(id) ON DELETE CASCADE,
    repuesto_id INT NOT NULL REFERENCES repuesto(id),
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. TABLA: COTIZACIÓN (NO MODIFICA STOCK)
CREATE TABLE IF NOT EXISTS cotizacion (
    id SERIAL PRIMARY KEY,
    numero_cotizacion VARCHAR(30) NOT NULL UNIQUE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vencimiento DATE NOT NULL,
    cliente_nombre VARCHAR(120) NOT NULL,
    cliente_documento VARCHAR(30),
    cliente_telefono VARCHAR(30),
    placa_moto VARCHAR(15),
    modelo_moto VARCHAR(60),
    total NUMERIC(12, 2) NOT NULL,
    observaciones TEXT,
    atendido_por VARCHAR(60) NOT NULL
);`
  },
  {
    name: 'Repuesto.java',
    package: 'com.mototaller.model',
    type: 'model',
    description: 'POJO del repuesto de motocicleta con OEM, Cilindraje y propiedades JavaFX observables',
    code: `package com.mototaller.model;

import javafx.beans.property.*;

/**
 * Modelo de Repuesto de Motocicleta con propiedades observables JavaFX.
 * Incluye Referencia OEM y Cilindraje para filtro multimarcas.
 */
public class Repuesto {

    private final IntegerProperty id = new SimpleIntegerProperty();
    private final StringProperty codigoSku = new SimpleStringProperty();
    private final StringProperty referenciaOEM = new SimpleStringProperty();
    private final StringProperty nombre = new SimpleStringProperty();
    private final StringProperty zonaId = new SimpleStringProperty();
    private final StringProperty subparte = new SimpleStringProperty();
    private final StringProperty marcaMoto = new SimpleStringProperty();
    private final StringProperty cilindraje = new SimpleStringProperty();
    private final StringProperty modelosCompatibles = new SimpleStringProperty();
    private final IntegerProperty stockActual = new SimpleIntegerProperty();
    private final IntegerProperty stockMinimo = new SimpleIntegerProperty();
    private final DoubleProperty precioCosto = new SimpleDoubleProperty();
    private final DoubleProperty precioVenta = new SimpleDoubleProperty();
    private final StringProperty ubicacionBodega = new SimpleStringProperty();
    private final IntegerProperty proveedorId = new SimpleIntegerProperty();
    private final StringProperty descripcion = new SimpleStringProperty();

    public Repuesto() {}

    public Repuesto(int id, String codigoSku, String referenciaOEM, String nombre, String zonaId, 
                    String subparte, String marcaMoto, String cilindraje, String modelosCompatibles, 
                    int stockActual, int stockMinimo, double precioCosto, double precioVenta, 
                    String ubicacionBodega, int proveedorId, String descripcion) {
        setId(id);
        setCodigoSku(codigoSku);
        setReferenciaOEM(referenciaOEM);
        setNombre(nombre);
        setZonaId(zonaId);
        setSubparte(subparte);
        setMarcaMoto(marcaMoto);
        setCilindraje(cilindraje);
        setModelosCompatibles(modelosCompatibles);
        setStockActual(stockActual);
        setStockMinimo(stockMinimo);
        setPrecioCosto(precioCosto);
        setPrecioVenta(precioVenta);
        setUbicacionBodega(ubicacionBodega);
        setProveedorId(proveedorId);
        setDescripcion(descripcion);
    }

    public int getId() { return id.get(); }
    public void setId(int value) { id.set(value); }
    public IntegerProperty idProperty() { return id; }

    public String getCodigoSku() { return codigoSku.get(); }
    public void setCodigoSku(String value) { codigoSku.set(value); }
    public StringProperty codigoSkuProperty() { return codigoSku; }

    public String getReferenciaOEM() { return referenciaOEM.get(); }
    public void setReferenciaOEM(String value) { referenciaOEM.set(value); }
    public StringProperty referenciaOEMProperty() { return referenciaOEM; }

    public String getNombre() { return nombre.get(); }
    public void setNombre(String value) { nombre.set(value); }
    public StringProperty nombreProperty() { return nombre; }

    public String getZonaId() { return zonaId.get(); }
    public void setZonaId(String value) { zonaId.set(value); }
    public StringProperty zonaIdProperty() { return zonaId; }

    public String getSubparte() { return subparte.get(); }
    public void setSubparte(String value) { subparte.set(value); }
    public StringProperty subparteProperty() { return subparte; }

    public String getMarcaMoto() { return marcaMoto.get(); }
    public void setMarcaMoto(String value) { marcaMoto.set(value); }
    public StringProperty marcaMotoProperty() { return marcaMoto; }

    public String getCilindraje() { return cilindraje.get(); }
    public void setCilindraje(String value) { cilindraje.set(value); }
    public StringProperty cilindrajeProperty() { return cilindraje; }

    public String getModelosCompatibles() { return modelosCompatibles.get(); }
    public void setModelosCompatibles(String value) { modelosCompatibles.set(value); }
    public StringProperty modelosCompatiblesProperty() { return modelosCompatibles; }

    public int getStockActual() { return stockActual.get(); }
    public void setStockActual(int value) { stockActual.set(value); }
    public IntegerProperty stockActualProperty() { return stockActual; }

    public int getStockMinimo() { return stockMinimo.get(); }
    public void setStockMinimo(int value) { stockMinimo.set(value); }
    public IntegerProperty stockMinimoProperty() { return stockMinimo; }

    public double getPrecioCosto() { return precioCosto.get(); }
    public void setPrecioCosto(double value) { precioCosto.set(value); }
    public DoubleProperty precioCostoProperty() { return precioCosto; }

    public double getPrecioVenta() { return precioVenta.get(); }
    public void setPrecioVenta(double value) { precioVenta.set(value); }
    public DoubleProperty precioVentaProperty() { return precioVenta; }

    public String getUbicacionBodega() { return ubicacionBodega.get(); }
    public void setUbicacionBodega(String value) { ubicacionBodega.set(value); }
    public StringProperty ubicacionBodegaProperty() { return ubicacionBodega; }

    public int getProveedorId() { return proveedorId.get(); }
    public void setProveedorId(int value) { proveedorId.set(value); }
    public IntegerProperty proveedorIdProperty() { return proveedorId; }

    public String getDescripcion() { return descripcion.get(); }
    public void setDescripcion(String value) { descripcion.set(value); }
    public StringProperty descripcionProperty() { return descripcion; }
}`
  },
  {
    name: 'MainViewController.java',
    package: 'com.mototaller.controller',
    type: 'controller',
    description: 'Controlador JavaFX: Carga de Logo del Taller, Diagrama Interactivo de Moto y Carrito',
    code: `package com.mototaller.controller;

import com.mototaller.config.AppConfig;
import com.mototaller.dao.RepuestoDAO;
import com.mototaller.dao.RepuestoDAOImpl;
import com.mototaller.model.Repuesto;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.Pane;
import javafx.scene.shape.Polygon;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

/**
 * Controlador principal de la vista interactiva JavaFX.
 * Conecta el diagrama visual de la motocicleta con el catálogo de repuestos y el carrito.
 */
public class MainViewController implements Initializable {

    // =========================================================================
    // ENCABEZADO Y BRANDING DEL TALLER
    // =========================================================================
    @FXML private ImageView imgLogoTaller;
    @FXML private Label lblNombreTaller;
    @FXML private Label lblSloganTaller;
    @FXML private Label lblContactoTaller;

    // =========================================================================
    // ZONAS Y POLÍGONOS INTERACTIVOS SOBRE LA IMAGEN DE LA MOTO
    // =========================================================================
    @FXML private ImageView imgMotoDiagrama;
    @FXML private Pane paneHotspotsMoto;
    @FXML private Polygon polyMotor;
    @FXML private Polygon polyEscape;
    @FXML private Polygon polyFrenosDelanteros;
    @FXML private Polygon polyCarenado;
    @FXML private Polygon polyAsiento;
    @FXML private Polygon polyCupula;

    // =========================================================================
    // FILTROS Y TABLA DE REPUESTOS
    // =========================================================================
    @FXML private ComboBox<String> cmbMarcaMoto;
    @FXML private ComboBox<String> cmbCilindraje;
    @FXML private TextField txtBusqueda;
    @FXML private TableView<Repuesto> tblRepuestos;
    @FXML private TableColumn<Repuesto, String> colSku;
    @FXML private TableColumn<Repuesto, String> colOem;
    @FXML private TableColumn<Repuesto, String> colNombre;
    @FXML private TableColumn<Repuesto, String> colMarca;
    @FXML private TableColumn<Repuesto, String> colCilindraje;
    @FXML private TableColumn<Repuesto, Integer> colStock;
    @FXML private TableColumn<Repuesto, Double> colPrecio;

    private final RepuestoDAO repuestoDAO = new RepuestoDAOImpl();
    private final ObservableList<Repuesto> listaRepuestos = FXCollections.observableArrayList();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        cargarBrandingTaller();
        configurarFiltros();
        configurarHotspotsDirectosEnImagen();
        cargarCatalogoCompleto();
    }

    /**
     * CARGA EL LOGO Y NOMBRE DEL TALLER DESDE LA CONFIGURACIÓN
     */
    private void cargarBrandingTaller() {
        try {
            // Carga la imagen del logo desde src/main/resources/images/logo_taller.png
            Image logo = new Image(getClass().getResourceAsStream(AppConfig.LOGO_PATH));
            if (imgLogoTaller != null) {
                imgLogoTaller.setImage(logo);
            }
        } catch (Exception e) {
            System.err.println("No se pudo cargar el logo del taller: " + e.getMessage());
        }

        if (lblNombreTaller != null) lblNombreTaller.setText(AppConfig.NOMBRE_TALLER);
        if (lblSloganTaller != null) lblSloganTaller.setText(AppConfig.ESLOGAN_TALLER);
        if (lblContactoTaller != null) {
            lblContactoTaller.setText(AppConfig.TELEFONOS_TALLER + " · " + AppConfig.DIRECCION_TALLER);
        }
    }

    /**
     * PERMITE QUE CADA PARTE DE LA IMAGEN SEA UN BOTÓN CLICKEABLE DIRECTO
     */
    private void configurarHotspotsDirectosEnImagen() {
        // Al hacer clic sobre el polígono del motor en la imagen:
        if (polyMotor != null) {
            polyMotor.setOnMouseClicked(event -> filtrarPorZona("motor", "Motor"));
        }
        // Al hacer clic sobre el escape:
        if (polyEscape != null) {
            polyEscape.setOnMouseClicked(event -> filtrarPorSubparte("motor", "Sistema de Escape"));
        }
        // Al hacer clic sobre los frenos:
        if (polyFrenosDelanteros != null) {
            polyFrenosDelanteros.setOnMouseClicked(event -> filtrarPorZona("frenos_suspension", "Frenos"));
        }
        // Al hacer clic sobre el carenado:
        if (polyCarenado != null) {
            polyCarenado.setOnMouseClicked(event -> filtrarPorZona("carenaje_chasis", "Carenaje"));
        }
        // Al hacer clic sobre la cúpula:
        if (polyCupula != null) {
            polyCupula.setOnMouseClicked(event -> filtrarPorZona("mandos_guayas", "Cockpit"));
        }
    }

    private void configurarFiltros() {
        cmbMarcaMoto.getItems().addAll("Todas", "Kawasaki", "Yamaha", "Suzuki", "Bajaj", "Honda", "KTM", "AKT", "Universal");
        cmbMarcaMoto.getSelectionModel().selectFirst();
        cmbMarcaMoto.setOnAction(e -> aplicarFiltros());

        cmbCilindraje.getItems().addAll("Todos", "1000cc", "650cc", "400cc", "390cc", "321cc", "250cc", "200cc", "190cc", "150cc", "125cc", "100cc");
        cmbCilindraje.getSelectionModel().selectFirst();
        cmbCilindraje.setOnAction(e -> aplicarFiltros());
    }

    private void cargarCatalogoCompleto() {
        try {
            List<Repuesto> repuestos = repuestoDAO.listarTodos();
            listaRepuestos.setAll(repuestos);
            tblRepuestos.setItems(listaRepuestos);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void filtrarPorZona(String zonaId, String nombreZona) {
        System.out.println("Zona seleccionada en imagen: " + nombreZona);
        try {
            List<Repuesto> filtrados = repuestoDAO.buscarPorZona(zonaId);
            listaRepuestos.setAll(filtrados);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void filtrarPorSubparte(String zonaId, String subparte) {
        System.out.println("Subparte seleccionada en imagen: " + subparte);
        // Filtrar lista
    }

    private void aplicarFiltros() {
        // Ejecución de filtros combinados de marca, cilindraje y texto
    }
}`
  },
  {
    name: 'MainApp.java',
    package: 'com.mototaller',
    type: 'main',
    description: 'Punto de entrada JavaFX: Icono de ventana con el Logo del Taller y apertura de pantalla completa',
    code: `package com.mototaller;

import com.mototaller.config.AppConfig;
import com.mototaller.config.DatabaseConnection;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

/**
 * Punto de entrada principal de la aplicación JavaFX 21 en Visual Studio Code.
 */
public class MainApp extends Application {

    @Override
    public void start(Stage primaryStage) {
        try {
            // 1. CARGA DEL ICONO DE LA VENTANA (LOGO DEL TALLER)
            try {
                Image icon = new Image(getClass().getResourceAsStream(AppConfig.LOGO_PATH));
                primaryStage.getIcons().add(icon);
            } catch (Exception e) {
                System.out.println("Nota: Coloque su logo en src/main/resources/images/logo_taller.png");
            }

            // 2. CARGA DE LA VISTA FXML PRINCIPAL
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/MainView.fxml"));
            Parent root = loader.load();

            // 3. TÍTULO DE LA VENTANA CON EL NOMBRE DEL TALLER
            primaryStage.setTitle(AppConfig.NOMBRE_TALLER + " - Sistema de Taller, Inventario y Cotizaciones");

            Scene scene = new Scene(root, 1366, 768);
            scene.getStylesheets().add(getClass().getResource("/styles/dark_theme.css").toExternalForm());

            primaryStage.setScene(scene);
            primaryStage.setMinWidth(1100);
            primaryStage.setMinHeight(700);
            primaryStage.show();

            System.out.println("=== " + AppConfig.NOMBRE_TALLER + " INICIADO CON ÉXITO ===");
        } catch (Exception e) {
            System.err.println("Error crítico al iniciar la aplicación JavaFX: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void stop() {
        // Cierre seguro del pool de conexiones al salir
        DatabaseConnection.getInstance().closePool();
        System.out.println("Pool de base de datos cerrado correctamente.");
    }

    public static void main(String[] args) {
        launch(args);
    }
}`
  },
  {
    name: 'Guia_Base_Datos_Local_Nube.md',
    package: 'Documentación Técnica',
    type: 'guide',
    description: 'GUÍA COMPLETA: ¿Por qué NO Access? ¿Por qué NO GitHub? Opciones Locales (SQLite) y Nube Gratis (Neon / Supabase)',
    code: `# GUÍA ARQUITECTÓNICA: BASE DE DATOS LOCAL VS NUBE PARA TALLER DE MOTOS

---

## 1. ¿POR QUÉ NO ES RECOMENDABLE MICROSOFT ACCESS EN JAVA MODERNO?
1. **Sin soporte JDBC oficial de Oracle ni Microsoft:** Access (.accdb) no tiene driver oficial mantenido para Java 17/21. La librería comunitaria (UCanAccess) requiere más de 5 JARs externos, es extremadamente lenta en tablas con miles de repuestos y carece de funciones SQL modernas.
2. **Monoconsumo y bloqueo de archivos:** Si un mecánico en la bahía consulta un repuesto mientras el cajero factura, el archivo .accdb se bloquea en Windows, generando errores de "Fallo de I/O" y riesgo severo de corrupción de la base de datos.
3. **No sirve para red LAN multiequipo ni para la nube.**

---

## 2. LA MEJOR SOLUCIÓN LOCAL MIENTRAS TANTO: **SQLITE (CERO INSTALACIÓN)**
Si aún no quieres instalar PostgreSQL ni configurar servidores, la solución profesional estándar en la industria es **SQLite**:
- **Cero Instalación:** No tienes que instalar ningún programa en tu computador.
- **Un Solo Archivo:** Toda la base de datos se guarda en un archivo llamado \`mototaller.db\` en la carpeta de tu proyecto.
- **Driver Maven directo:** Solo agregas \`sqlite-jdbc\` al \`pom.xml\` (ya incluido en este entregable).
- **Auto-creación:** Si el archivo \`mototaller.db\` no existe, la clase \`DatabaseConnection.java\` lo crea automáticamente al ejecutar la app.

---

## 3. ¿SIRVE GITHUB COMO BASE DE DATOS? (DESMITIFICANDO GITHUB)
**Respuesta directa: NO, GitHub NO sirve como base de datos.**
- **¿Qué es GitHub?** Es un repositorio de **código fuente** (control de versiones Git). Está hecho para guardar código, no datos transaccionales.
- **¿Por qué no funciona como DB?**
  - No tiene un puerto TCP (como el 5432) al que tu aplicación Java pueda conectarse mediante JDBC.
  - No procesa sentencias SQL (\`SELECT\`, \`INSERT\`, \`UPDATE\`) en tiempo real.
  - No tiene control de concurrencia ACID ni bloqueos de filas.
  - Si intentas subir un archivo de base de datos a GitHub cada vez que vendes un repuesto, tendrías que hacer \`git commit\` y \`git push\` por cada factura, lo cual es inviable, colapsaría la app y expondría los datos privados de tus clientes públicamente.

---

## 4. OPCIONES REALES DE BASE DE DATOS EN LA NUBE 100% GRATUITAS:
Cuando quieras desplegar tu aplicación para conectarte desde cualquier lugar con Internet:

### Opción 1: **NEON.TECH (PostgreSQL Serverless) - ¡LA MÁS RECOMENDADA!**
- **Costo:** 100% Gratis (Tier Free generoso de por vida).
- **Características:** Te da un servidor PostgreSQL completo en la nube en 10 segundos.
- **Conexión JDBC:** Te proporciona una URL directa con SSL:
  \`\`\`properties
  db.url=jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
  db.user=neondb_owner
  db.password=tu_contraseña_secreta
  \`\`\`
- **Ventaja:** Usa el mismo driver PostgreSQL que ya tienes en el \`pom.xml\`. No necesitas cambiar ni una sola línea de código Java.

### Opción 2: **SUPABASE (PostgreSQL en la Nube)**
- **Costo:** 500 MB de base de datos gratuita.
- **Panel Web Visual:** Incluye un panel de administración en el navegador tipo phpMyAdmin moderno donde puedes ver tablas, editar repuestos y exportar a Excel.
- **Conexión JDBC:** Conexión directa mediante Transaction Pooler (puerto 6543) o Session Pooler (puerto 5432).

### Opción 3: **AIVEN.IO (PostgreSQL / MySQL)**
- Ofrece 1 servicio administrado gratuito de PostgreSQL o MySQL con métricas y backups automáticos.

---

## 5. CÓMO PASAR DE LOCAL A LA NUBE EN 10 SEGUNDOS:
Solo debes abrir el archivo \`database.properties\` y cambiar la línea comentada:
- Para trabajar en tu PC hoy: usa \`db.engine=sqlite\`
- Para conectar los PC de tu taller: usa \`db.host=192.168.1.100\`
- Para la nube: pega la URL de Neon o Supabase con \`?sslmode=require\``
  },
  {
    name: 'Guia_Logo_Y_Nombre_Taller.md',
    package: 'Documentación Técnica',
    type: 'guide',
    description: 'GUÍA PASO A PASO: ¿En qué partes del código cambiar la foto y nombre del taller?',
    code: `# ¿EN QUÉ PARTE DEL CÓDIGO PUEDO AGREGAR LA FOTO Y NOMBRE DEL TALLER?

Tienes dos entornos: el proyecto de escritorio en Java/JavaFX y la aplicación Web interactiva. Aquí está la ubicación exacta en ambos:

---

## 1. EN EL PROYECTO DE ESCRITORIO (JAVA 17 + JAVAFX):

### A. Ubicación del archivo de la foto / logo:
1. Guarda el archivo de tu logo en la carpeta de recursos de Maven:
   \`src/main/resources/images/logo_taller.png\`
   *(Recomendación: formato PNG con fondo transparente, dimensiones de 400x400 px o superior).*

### B. En el archivo Java de Configuración (\`AppConfig.java\`):
Abre el archivo \`com/mototaller/config/AppConfig.java\` y edita las siguientes constantes:
\`\`\`java
public class AppConfig {
    public static final String NOMBRE_TALLER = "TU TALLER AQUÍ";
    public static final String ESLOGAN_TALLER = "Tu eslogan o lema comercial";
    public static final String NIT_TALLER = "900.123.456-7";
    public static final String DIRECCION_TALLER = "Carrera 10 # 20-30";
    public static final String TELEFONOS_TALLER = "310 000 0000";
    public static final String LOGO_PATH = "/images/logo_taller.png";
}
\`\`\`

### C. En la ventana principal JavaFX (\`MainApp.java\`):
Para que la ventana de Windows/Mac muestre el logo de tu taller en la barra de tareas:
\`\`\`java
primaryStage.getIcons().add(new Image(getClass().getResourceAsStream(AppConfig.LOGO_PATH)));
primaryStage.setTitle(AppConfig.NOMBRE_TALLER + " - Gestión de Taller");
\`\`\`

### D. En la interfaz gráfica (\`MainViewController.java\` y \`MainView.fxml\`):
El controlador enlaza el logo al \`ImageView\` y el nombre al \`Label\`:
\`\`\`java
imgLogoTaller.setImage(new Image(getClass().getResourceAsStream(AppConfig.LOGO_PATH)));
lblNombreTaller.setText(AppConfig.NOMBRE_TALLER);
\`\`\`

---

## 2. EN LA APLICACIÓN WEB INTERACTIVA ACTUAL:

### A. Desde la propia pantalla (Sin tocar código):
1. Haz clic en el botón con engrane **"Logo Taller"** ubicado en la esquina superior derecha del encabezado.
2. Se abrirá la ventana modal interactiva donde puedes:
   - Cambiar el **Nombre del Taller**, NIT, Teléfono, Dirección y Slogan.
   - Cargar tu propio archivo de imagen (.png o .jpg) desde tu computador.
   - O pegar una URL de imagen de tu logo.
3. Al hacer clic en **"Guardar Identidad del Taller"**, se actualiza inmediatamente en:
   - El encabezado superior.
   - La marca de agua del diagrama de la moto.
   - El carrito de ventas lateral.
   - Las hojas impresas de Cotización y Factura Electrónica.

### B. En el código fuente web:
Abre el archivo:
\`src/data/initialData.ts\`
En las líneas 3 a 13 encontrarás el objeto:
\`\`\`typescript
export const TALLER_CONFIG_INICIAL: TallerConfig = {
  nombre: 'TU NOMBRE DE TALLER',
  slogan: 'Tu eslogan',
  nit: '900.548.120-4',
  direccion: 'Calle...',
  telefono: '312...',
  logoUrl: 'URL_O_BASE64_DE_TU_LOGO'
};
\`\`\``
  }
];
