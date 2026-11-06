# MANUAL DE CREACIÓN Y CONEXIÓN DE BASES DE DATOS
## MICROSOFT ACCESS, SQLITE, POSTGRESQL LAN Y BASES DE DATOS EN LA NUBE GRATUITAS

**Para:** Administradores de Base de Datos, Programadores y Gerentes de Taller  
**Versión:** 2.4.0  

---

### TABLA DE CONTENIDO
1. Aclaración Vital: ¿Sirve GitHub como Base de Datos?
2. Crear y Conectar una Base de Datos Local en Microsoft Access (.accdb) con Java
3. Por qué Access NO se Recomienda en Talleres Multi-Equipo
4. Alternativa Local Recomendada #1: SQLite (`mototaller.db`)
5. Alternativa Local Multi-Equipo #2: PostgreSQL Local LAN
6. Bases de Datos Gratuitas en la Nube (Neon.tech & Supabase)
7. Configuración Paso a Paso en `database.properties`

---

## 1. ACLARACIÓN VITAL: ¿SIRVE GITHUB COMO BASE DE DATOS?

**Respuesta Técnica Directa: NO.**  
Existe una confusión común entre **almacenar código** y **gestionar datos transaccionales**:

* **¿Qué es GitHub?:** Es un servicio de almacenamiento y control de versiones para **archivos y código fuente** (usando Git). Está diseñado para guardar versiones históricas de archivos de texto (`.java`, `.html`, `.css`, `.sql`).
* **¿Por qué NO sirve como base de datos de un taller?:**
  1. **No soporta lenguaje SQL:** No se pueden ejecutar consultas como `SELECT`, `UPDATE` o `JOIN`.
  2. **No tiene transacciones ACID:** Si dos mecánicos intentan descontar stock al mismo segundo, GitHub no puede bloquear la fila ni resolver la concurrencia; generaría un conflicto de fusión (*merge conflict*).
  3. **No tiene seguridad de conexión:** Exponer credenciales o datos de clientes en un repositorio público o privado es inseguro y no cumple con la legislación de protección de datos (Habeas Data).
  4. **Latencia extrema:** Hacer un `git commit` y `git push` por cada repuesto vendido tardaría entre 2 y 5 segundos, congelando la caja del taller.

**Conclusión:** GitHub se usa para **respaldar y versionar el código de su aplicación Java**, pero los datos de su inventario deben guardarse en un motor de base de datos relacional como **SQLite**, **PostgreSQL** o un servicio en la nube como **Neon.tech**.

---

## 2. CREAR Y CONECTAR BASE DE DATOS EN MICROSOFT ACCESS (.accdb)

Si por requerimiento interno de su empresa debe conectarse a un archivo de **Microsoft Access**:

### Paso 1: Crear la Base de Datos en MS Access
1. Abra Microsoft Access en Windows.
2. Seleccione **"Base de datos del escritorio en blanco"**.
3. Asígnele el nombre `mototaller.accdb` y guárdela en una ruta conocida, por ejemplo: `C:\taller\mototaller.accdb`.
4. Cree las tablas `repuesto`, `proveedor`, `kardex_movimiento` y `factura_venta` con los tipos de datos equivalentes (Texto corto, Número entero, Moneda, Fecha/Hora).

### Paso 2: Agregar el Driver JDBC de Access en `pom.xml`
Java no incluye soporte nativo para Access desde Java 8. Se debe usar la librería de código abierto **UCanAccess**:

```xml
<dependencies>
    <!-- Driver JDBC para Microsoft Access -->
    <dependency>
        <groupId>net.sf.ucanaccess</groupId>
        <artifactId>ucanaccess</artifactId>
        <version>5.0.1</version>
    </dependency>
</dependencies>
```

### Paso 3: Código de Conexión Java para Access
```java
package com.mototaller.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class AccessConnection {
    private static final String RUTA_ARCHIVO = "C:/taller/mototaller.accdb";
    private static final String URL_JDBC = "jdbc:ucanaccess://" + RUTA_ARCHIVO + ";memory=false";

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("net.sf.ucanaccess.jdbc.UcanaccessDriver");
            return DriverManager.getConnection(URL_JDBC);
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver UCanAccess no encontrado en el classpath.", e);
        }
    }
}
```

---

## 3. LIMITACIONES SEVERAS DE MICROSOFT ACCESS EN UN TALLER

Aunque Access funciona para un único usuario en una sola computadora, **presenta graves fallas cuando se usa en un taller con varias terminales en red LAN**:

1. **Bloqueo por archivo (*File Locking*):** Access no es un servidor de red; es un archivo compartido en una carpeta de Windows. Cuando la computadora de la Caja abre el archivo, frecuentemente bloquea el acceso de escritura para los mecánicos.
2. **Riesgo de Corrupción de Datos:** Si un mecánico apaga su equipo o se desconecta la red Wi-Fi mientras se grababa una factura, el archivo `.accdb` puede corromperse por completo, perdiendo todo el inventario.
3. **Límite de 2 GB:** El archivo no puede superar 2 GB de tamaño total.

Por estas razones técnicas, la industria recomienda sustituir Access por **SQLite** (local monousuario) o **PostgreSQL** (local multi-equipo o nube).

---

## 4. ALTERNATIVA LOCAL RECOMENDADA #1: SQLITE

**SQLite** es el motor de base de datos más utilizado del mundo. Al igual que Access, se almacena en un solo archivo (`mototaller.db`), pero es **inmune a la corrupción por caídas de energía**, es extremadamente rápido y no requiere instalar ningún programa adicional.

* **Driver Maven:**
  ```xml
  <dependency>
      <groupId>org.xerial</groupId>
      <artifactId>sqlite-jdbc</artifactId>
      <version>3.45.1.0</version>
  </dependency>
  ```
* **Cadena de Conexión:**
  ```properties
  db.url=jdbc:sqlite:mototaller.db
  ```
El archivo `mototaller.db` se creará automáticamente en la carpeta de la aplicación la primera vez que se ejecute.

---

## 5. ALTERNATIVA LOCAL MULTI-EQUIPO #2: POSTGRESQL LOCAL LAN

Si en su taller no hay internet estable pero tienen 4 computadoras conectadas al mismo router:

1. Instale **PostgreSQL 16** en la computadora principal del taller (ej. la de Caja).
2. Durante la instalación, asigne la contraseña del superusuario `postgres`.
3. Abra **pgAdmin 4** o la consola `psql` y cree la base de datos:
   ```sql
   CREATE DATABASE mototaller_db;
   ```
4. Ejecute el script `src/main/resources/sql/schema_postgresql.sql` que viene incluido en el proyecto.
5. Permita conexiones en red local en el archivo `postgresql.conf`:
   ```
   listen_addresses = '*'
   ```
6. En `pg_hba.conf`, autorice el rango de su red LAN:
   ```
   host  all  all  192.168.1.0/24  scram-sha-256
   ```

---

## 6. BASES DE DATOS GRATUITAS EN LA NUBE

Si desea consultar el inventario desde su casa, desde el celular o sincronizar sucursales del taller, las mejores opciones **100% gratuitas** son:

### Opción 1: Neon.tech (PostgreSQL Serverless - La Mejor Opción)
* **¿Qué ofrece gratis?:**
  * Servidor PostgreSQL 16 dedicado en la nube.
  * 500 MB de almacenamiento (suficiente para más de 100,000 repuestos y 300,000 facturas).
  * Consola web interactiva para ver y editar tablas con un clic.
  * Conexiones cifradas SSL automáticas.
* **Paso a Paso:**
  1. Ingrese a [https://neon.tech](https://neon.tech) y cree una cuenta gratuita con su correo o GitHub.
  2. Cree un nuevo proyecto: llámelo `mototaller-cloud`.
  3. En el panel principal verá su cadena de conexión JDBC lista para copiar:
     `jdbc:postgresql://ep-silent-shadow-a5abc.us-east-2.aws.neon.tech/neondb?sslmode=require`
  4. Vaya a la pestaña **"SQL Editor"** en Neon, pegue el contenido de `schema_postgresql.sql` y presione **Run**. ¡Su base de datos estará activa en 10 segundos!

### Opción 2: Supabase (PostgreSQL en la Nube)
* **¿Qué ofrece gratis?:**
  * Base de datos PostgreSQL con 500 MB de espacio gratuito.
  * Panel web estilo hoja de cálculo para editar repuestos visualmente.
  * Copias de seguridad automáticas.
* **Paso a Paso:**
  1. Ingrese a [https://supabase.com](https://supabase.com) y regístrese gratis.
  2. Cree una organización y un proyecto: `mototaller-db`.
  3. Vaya a **Project Settings -> Database -> Connection string -> JDBC**.
  4. Copie la URL e ingrésela en su software.

---

## 7. CONFIGURACIÓN EN `database.properties`

En su proyecto Java, ubique el archivo `src/main/resources/database.properties`. Simplemente descomente el bloque que vaya a utilizar:

```properties
# ========================================================
# PERFIL 1: BASE DE DATOS LOCAL SIN INSTALACIÓN (SQLITE)
# ========================================================
db.driver=org.sqlite.JDBC
db.url=jdbc:sqlite:mototaller.db
db.user=
db.password=
db.pool.size=5

# ========================================================
# PERFIL 2: RED LOCAL LAN TALLER (POSTGRESQL MULTI-PC)
# ========================================================
# db.driver=org.postgresql.Driver
# db.url=jdbc:postgresql://192.168.1.100:5432/mototaller_db
# db.user=postgres
# db.password=TuClaveSegura2026
# db.pool.size=15

# ========================================================
# PERFIL 3: NUBE GRATUITA (NEON.TECH SERVERLESS)
# ========================================================
# db.driver=org.postgresql.Driver
# db.url=jdbc:postgresql://ep-silent-shadow-a5abc.us-east-2.aws.neon.tech/neondb?sslmode=require
# db.user=neondb_owner
# db.password=TuClaveNeonSecret
# db.pool.size=10
```
