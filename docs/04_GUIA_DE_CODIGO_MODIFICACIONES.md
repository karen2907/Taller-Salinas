# GUÍA TÉCNICA DE CÓDIGO Y MODIFICACIONES
## DESARROLLO EN JAVA 17+ / JAVAFX 21 - ARQUITECTURA MVC & PATRÓN DAO

**Para:** Desarrolladores de Software, Ingenieros de Sistemas y Arquitectos Java  
**Versión:** 2.4.0  

---

### TABLA DE CONTENIDO
1. Estructura de Directorios del Proyecto Maven
2. Cómo Agregar Nuevos Repuestos y Piezas al Catálogo
3. Cómo Incorporar Nuevas Marcas, Modelos y Cilindrajes de Motos
4. Cómo Modificar o Agregar Nuevos Puntos Interactivos (Hotspots) en la Moto
5. Cómo Crear un Nuevo DAO o Agregar Consultas SQL
6. Cómo Modificar las Vistas FXML y Estilos CSS
7. Configuración de Marca y Logo por Código Java (`AppConfig.java`)
8. Gestión Transaccional con HikariCP (`DatabaseConnection.java`)

---

## 1. ESTRUCTURA DE DIRECTORIOS DEL PROYECTO MAVEN

El proyecto sigue la convención estándar de Apache Maven:

```
mototaller-javafx/
├── pom.xml                                   # Configuración de dependencias Maven
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/mototaller/
│   │   │       ├── MainApp.java              # Clase principal JavaFX Application
│   │   │       ├── config/
│   │   │       │   ├── AppConfig.java        # Constantes de marca, logo y rutas
│   │   │       │   └── DatabaseConnection.java# Pool Singleton HikariCP
│   │   │       ├── model/                    # Entidades POJO JavaFX
│   │   │       │   ├── Repuesto.java
│   │   │       │   ├── Proveedor.java
│   │   │       │   ├── MovimientoKardex.java
│   │   │       │   ├── FacturaVenta.java
│   │   │       │   └── ItemCarrito.java
│   │   │       ├── dao/                      # Contratos / Interfaces de acceso a datos
│   │   │       │   ├── RepuestoDAO.java
│   │   │       │   ├── KardexDAO.java
│   │   │       │   └── VentaDAO.java
│   │   │       ├── dao/impl/                 # Implementaciones JDBC nativas
│   │   │       │   ├── RepuestoDAOImpl.java
│   │   │       │   ├── KardexDAOImpl.java
│   │   │       │   └── VentaDAOImpl.java
│   │   │       └── controller/               # Controladores de interfaz gráfica
│   │   │           ├── MainViewController.java
│   │   │           └── MotorcycleExplorerController.java
│   │   └── resources/
│   │       ├── database.properties           # Credenciales y URL de JDBC activa
│   │       ├── sql/
│   │       │   ├── schema_postgresql.sql     # Script DDL para PostgreSQL
│   │       │   └── schema_sqlite.sql         # Script DDL para SQLite
│   │       ├── fxml/
│   │       │   ├── MainView.fxml             # Layout XML de la interfaz
│   │       │   └── MotorcycleExplorer.fxml
│   │       ├── css/
│   │       │   └── dark_theme.css            # Estilos visuales dark mode
│   │       └── images/
│   │           ├── kawasaki_ninja_zx10r.jpg  # Fotografía técnica de la moto
│   │           └── logo_taller.png           # Logo predeterminado del taller
```

---

## 2. CÓMO AGREGAR NUEVOS REPUESTOS Y PIEZAS AL CATÁLOGO

### A. Vía Script SQL (`schema_postgresql.sql` / `schema_sqlite.sql`)
Para insertar repuestos de manera masiva, ejecute una sentencia `INSERT`:

```sql
INSERT INTO repuesto (
    codigo, referencia_oem, nombre, descripcion, zona_id, subparte,
    marca_moto, cilindraje, modelo_compatible, precio_costo, precio_venta,
    stock_actual, stock_minimo, proveedor_id
) VALUES (
    'MOT-YAM-045', 
    '54P-E1631-00', 
    'Pistón Completo Estándar 50.0mm con Anillos y Pasador', 
    'Pistón forjado de alta resistencia para motor Blue Core enfriado por aire.', 
    'motor', 
    'Pistón y Cilindro', 
    'Yamaha', 
    '125cc', 
    'Yamaha Crypton 115 / YBR 125', 
    48000.00, 
    78000.00, 
    14, 
    4, 
    1
);
```

### B. Vía Modelo de Dominio Java (`Repuesto.java`)
Si crea repuestos programáticamente en tiempo de ejecución:

```java
Repuesto nuevoRepuesto = new Repuesto();
nuevoRepuesto.setCodigo("SUS-BAJ-012");
nuevoRepuesto.setReferenciaOem("JL-1210-04");
nuevoRepuesto.setNombre("Retenedores de Suspensión Delantera 37mm");
nuevoRepuesto.setZonaId("frenos_suspension");
nuevoRepuesto.setSubparte("Horquilla Telescópica y Suspensión");
nuevoRepuesto.setMarcaMoto("Bajaj");
nuevoRepuesto.setCilindraje("200cc");
nuevoRepuesto.setModeloCompatible("Pulsar NS200 / RS200 FI");
nuevoRepuesto.setPrecioCosto(18000.0);
nuevoRepuesto.setPrecioVenta(32000.0);
nuevoRepuesto.setStockActual(20);
nuevoRepuesto.setStockMinimo(6);

RepuestoDAO repuestoDAO = new RepuestoDAOImpl();
repuestoDAO.guardar(nuevoRepuesto);
```

---

## 3. CÓMO INCORPORAR NUEVAS MARCAS, MODELOS Y CILINDRAJES

En `MainViewController.java`, los filtros de marca y cilindraje se inicializan mediante listas observables de JavaFX:

```java
// Para añadir nuevas marcas (ej. Benelli, Hero, BMW):
ObservableList<String> marcas = FXCollections.observableArrayList(
    "Todas", "Kawasaki", "Yamaha", "Suzuki", "Bajaj", "AKT", "Honda", "KTM", "Benelli", "Hero", "BMW", "Universal"
);
comboMarcas.setItems(marcas);

// Para añadir nuevos cilindrajes (ej. 750cc, 800cc, 1200cc):
ObservableList<String> cilindrajes = FXCollections.observableArrayList(
    "Todos", "1000cc", "800cc", "650cc", "400cc", "390cc", "321cc", "250cc", "200cc", "150cc", "125cc", "100cc", "Universal"
);
comboCilindrajes.setItems(cilindrajes);
```

---

## 4. CÓMO AGREGAR O MODIFICAR PUNTOS INTERACTIVOS (HOTSPOTS) EN LA MOTO

Los puntos interactivos del diagrama se definen como coordenadas relativas porcentuales (0% a 100%) sobre la imagen en `MotorcycleExplorerController.java`:

```java
public class HotspotDef {
    private String id;
    private String label;
    private String zonaId;
    private String subparteFiltro;
    private double targetX; // Coordenada X del componente (0 a 100)
    private double targetY; // Coordenada Y del componente (0 a 100)
    private String hitPolygon; // Coordenadas poligonales SVG para clics directos
    
    // Constructor, getters y setters...
}

// Ejemplo: Añadir un nuevo punto para el "Farola LED Delantera":
hotspots.add(new HotspotDef(
    "farola_delantera",
    "Farola Dual LED",
    "electrico",
    "Luces LED, Farola y Direccionales",
    84.0, 36.0,
    "78,32 90,32 92,42 80,44"
));
```

---

## 5. CÓMO CREAR UN NUEVO DAO O AGREGAR CONSULTAS SQL

Para mantener el principio de desacoplamiento, cree primero la interfaz en `com.mototaller.dao` y luego su implementación en `com.mototaller.dao.impl`:

### Paso 1: Interfaz `RepuestoDAO.java`
```java
public interface RepuestoDAO {
    List<Repuesto> listarTodos() throws SQLException;
    List<Repuesto> buscarPorZonaYFiltros(String zonaId, String marca, String cilindraje) throws SQLException;
    Repuesto buscarPorCodigo(String codigo) throws SQLException;
    void actualizarStock(int id, int nuevoStock) throws SQLException;
}
```

### Paso 2: Implementación con PreparedStatement y HikariCP `RepuestoDAOImpl.java`
```java
public class RepuestoDAOImpl implements RepuestoDAO {
    @Override
    public List<Repuesto> buscarPorZonaYFiltros(String zonaId, String marca, String cilindraje) throws SQLException {
        List<Repuesto> lista = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM repuesto WHERE zona_id = ?");
        
        if (!"Todas".equalsIgnoreCase(marca)) {
            sql.append(" AND marca_moto = ?");
        }
        if (!"Todos".equalsIgnoreCase(cilindraje)) {
            sql.append(" AND cilindraje = ?");
        }

        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            
            int paramIndex = 1;
            ps.setString(paramIndex++, zonaId);
            
            if (!"Todas".equalsIgnoreCase(marca)) {
                ps.setString(paramIndex++, marca);
            }
            if (!"Todos".equalsIgnoreCase(cilindraje)) {
                ps.setString(paramIndex++, cilindraje);
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapearRepuesto(rs));
                }
            }
        }
        return lista;
    }
}
```

---

## 6. CÓMO MODIFICAR LAS VISTAS FXML Y ESTILOS CSS

* Las vistas FXML (`src/main/resources/fxml/MainView.fxml`) pueden abrirse y editarse visualmente usando **Scene Builder** o directamente en el editor de código de Visual Studio Code.
* Todos los componentes tienen identificadores `fx:id` vinculados con `@FXML` en el controlador:
  ```xml
  <TableView fx:id="tablaRepuestos" styleClass="dark-table">
      <columns>
          <TableColumn fx:id="colCodigo" text="Código" prefWidth="110"/>
          <TableColumn fx:id="colNombre" text="Repuesto" prefWidth="250"/>
          <TableColumn fx:id="colStock" text="Stock" prefWidth="70"/>
          <TableColumn fx:id="colPrecio" text="Precio Venta" prefWidth="100"/>
      </columns>
  </TableView>
  ```
* En `dark_theme.css`, personalice los colores del taller:
  ```css
  /* Fondo general estilo Dashboard Deportivo */
  .root {
      -fx-base: #0f172a;
      -fx-background-color: #020617;
  }
  /* Botón de acento ámbar / verde racing */
  .button-primary {
      -fx-background-color: #f59e0b;
      -fx-text-fill: #020617;
      -fx-font-weight: bold;
      -fx-background-radius: 8px;
  }
  ```

---

## 7. CONFIGURACIÓN DE MARCA Y LOGO POR CÓDIGO JAVA

La clase `com.mototaller.config.AppConfig.java` centraliza los datos corporativos:

```java
package com.mototaller.config;

public class AppConfig {
    public static String NOMBRE_TALLER = "MOTO RACING PRO SERVICE";
    public static String SLOGAN = "Centro Técnico Especializado & Repuestos";
    public static String NIT = "900.548.120-4";
    public static String RUTA_LOGO = "/images/logo_taller.png";
    public static String ADMIN_PASSWORD_HASH = "admin123";
    public static double IVA_PORCENTAJE = 0.19; // 19%
}
```

---

## 8. GESTIÓN TRANSACCIONAL CON HIKARICP

Para ejecutar ventas con descuento de inventario y Kardex atómico:

```java
Connection conn = null;
try {
    conn = DatabaseConnection.getInstance().getConnection();
    conn.setAutoCommit(false); // INICIO TRANSACCIÓN ACID

    // 1. Insertar Factura
    // 2. Insertar Detalles
    // 3. Descontar Stock:
    //    UPDATE repuesto SET stock_actual = stock_actual - ? WHERE id = ?
    // 4. Insertar Kardex:
    //    INSERT INTO kardex_movimiento ...

    conn.commit(); // ÉXITO: Se confirman todos los cambios juntos
} catch (SQLException ex) {
    if (conn != null) {
        conn.rollback(); // ERROR: Se deshacen todos los cambios, no hay inconsistencias
    }
    throw ex;
} finally {
    if (conn != null) {
        conn.setAutoCommit(true);
        conn.close(); // Devuelve la conexión al pool HikariCP
    }
}
```
