# MANUAL DE INSTALACIÓN, DESCARGA Y DESPLIEGUE LOCAL
## SISTEMA MOTOGESTIÓN FX - DE GOOGLE AI STUDIO A LOS EQUIPOS DEL TALLER

**Para:** Administradores de TI, Soporte Técnico y Dueños de Taller  
**Versión:** 2.4.0  

---

### TABLA DE CONTENIDO
1. Cómo Descargar el Proyecto desde Google AI Studio
2. Requisitos Previos del Sistema (Hardware y Software)
3. Instalación de Java JDK 21 y Apache Maven
4. Configuración del Entorno en Visual Studio Code
5. Compilación del Proyecto con Maven (`mvn clean package`)
6. Generación de un Ejecutable Nativo (.exe) con JPackage
7. Despliegue en Red Local (LAN) para Múltiples Equipos
8. Mantenimiento y Respaldos Diarios

---

## 1. CÓMO DESCARGAR EL PROYECTO DESDE GOOGLE AI STUDIO

Para trasladar este software a las computadoras físicas de su taller, siga uno de estos métodos:

### Método A: Descarga en Archivo ZIP (Recomendado)
1. En la interfaz de **Google AI Studio Build**, ubique el menú superior derecho de opciones del proyecto (icono de tres puntos o menú de archivo).
2. Seleccione la opción **"Download Project as ZIP"** (Descargar Proyecto como ZIP) o **"Export Code"**.
3. Guarde el archivo `.zip` en su computador (ej. `motogestion-fx-main.zip`).
4. Haga clic derecho sobre el archivo y seleccione **"Extraer todo..."** en una carpeta de fácil acceso, por ejemplo:
   * En Windows: `C:\Sistemas\motogestion-fx`
   * En Linux/Mac: `~/Sistemas/motogestion-fx`

### Método B: Clonar vía Git (Si sincronizó con GitHub / GitLab)
Abra su terminal y ejecute:
```bash
git clone <URL_DE_SU_REPOSITORIO>
cd motogestion-fx
```

---

## 2. REQUISITOS PREVIOS DEL SISTEMA

### Requisitos de Hardware (Por cada PC del Taller):
* **Procesador:** Intel Core i3 / AMD Ryzen 3 o superior (2 núcleos, 2.0 GHz+).
* **Memoria RAM:** 4 GB mínimo (8 GB recomendados para mayor fluidez con gráficos HD).
* **Almacenamiento:** 500 MB libres para la aplicación + 2 GB para la base de datos local.
* **Pantalla:** Resolución mínima 1366 x 768 (Óptimo 1920 x 1080 Full HD).
* **Conexión de Red:** Tarjeta de red Ethernet o Wi-Fi conectada al router del taller.

### Requisitos de Software:
* **Sistema Operativo:** Windows 10 / Windows 11 (64-bit), Ubuntu Linux 20.04+, o macOS Sonoma/Sequoia.

---

## 3. INSTALACIÓN DE JAVA JDK 21 Y APACHE MAVEN

Para ejecutar y compilar aplicaciones JavaFX modernas, se recomienda **BellSoft Liberica JDK Full** (que ya incluye JavaFX integrado) o **Eclipse Temurin JDK 21**:

### Paso 1: Instalar JDK 21 con JavaFX
1. Ingrese a [https://bell-sw.com/pages/downloads/](https://bell-sw.com/pages/downloads/)
2. En la sección **Package Type**, asegúrese de seleccionar **"Full JDK"** (versión 21 LTS).
3. Descargue el instalador `.msi` para Windows o `.deb`/`.tar.gz` para Linux.
4. Ejecute el instalador y marque la casilla: **"Set JAVA_HOME variable"** y **"Add to PATH"**.

### Paso 2: Verificar la instalación en la Terminal
Abra `cmd` o PowerShell y escriba:
```bash
java -version
```
Debe responder: `openjdk version "21.0.x" ...`

### Paso 3: Instalar Apache Maven (Si no lo tiene)
1. Descargue el archivo binario `.zip` desde [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
2. Descomprímalo en `C:\Program Files\apache-maven-3.9.6`
3. Agregue la ruta `C:\Program Files\apache-maven-3.9.6\bin` a las **Variables de Entorno (PATH)** de Windows.
4. Verifique con:
```bash
mvn -version
```

---

## 4. CONFIGURACIÓN EN VISUAL STUDIO CODE

1. Abra Visual Studio Code.
2. Vaya a la pestaña de Extensiones (`Ctrl + Shift + X`).
3. Instale el paquete oficial de Microsoft: **"Extension Pack for Java"**.
4. Instale también **"Maven for Java"**.
5. Abra la carpeta del proyecto descargado: **Archivo -> Abrir Carpeta... -> `C:\Sistemas\motogestion-fx`**.
6. VS Code detectará automáticamente el archivo `pom.xml` y descargará las dependencias necesarias (`javafx-controls`, `javafx-fxml`, `HikariCP`, `postgresql`, `sqlite-jdbc`).

---

## 5. COMPILACIÓN DEL PROYECTO CON MAVEN

Abra la terminal integrada en VS Code (`Ctrl + ñ` o Terminal -> Nueva Terminal) y ejecute:

```bash
# Limpiar y compilar el proyecto
mvn clean compile

# Ejecutar la aplicación en modo desarrollo
mvn javafx:run

# Generar el archivo ejecutable JAR empaquetado
mvn clean package
```

Al finalizar, encontrará el archivo ejecutable en:  
`target/mototaller-javafx-1.0.0.jar`

Para probar la ejecución directa del JAR:
```bash
java -jar target/mototaller-javafx-1.0.0.jar
```

---

## 6. GENERACIÓN DE UN INSTALADOR EJECUTABLE NATIVO (.EXE)

Para que los mecánicos y cajeros no tengan que abrir consolas ni instalar Java manualmente, podemos empaquetar un instalador `.exe` independiente usando la herramienta oficial `jpackage` incluida en JDK 21:

```bash
jpackage \
  --input target/ \
  --name "MotoGestionFX" \
  --main-jar mototaller-javafx-1.0.0.jar \
  --main-class com.mototaller.MainApp \
  --type exe \
  --win-dir-chooser \
  --win-menu \
  --win-shortcut \
  --icon src/main/resources/images/icono_taller.ico
```

Esto generará un instalador `MotoGestionFX-1.0.0.exe` que crea un acceso directo en el escritorio de Windows con el logo de su taller.

---

## 7. DESPLIEGUE EN RED LOCAL (LAN) MULTIEQUIPO

Para que las 4 terminales del taller compartan la misma información en tiempo real:

```
[ Router del Taller / Wi-Fi LAN ]
           │
 ┌─────────┼──────────────────────────┬────────────────────────┐
 │ (Servidor LAN: 192.168.1.100)      │                        │
 ▼                                    ▼                        ▼
Terminal 1: Caja / Servidor      Terminal 2: Mostrador   Terminal 3: Mecánicos
PostgreSQL + MotoGestión FX      MotoGestión FX          MotoGestión FX (Tablet)
```

### Configuración en los Equipos Clientes:
En cada computadora del taller, abra el archivo `src/main/resources/database.properties`:

```properties
db.type=lan_postgres
db.url=jdbc:postgresql://192.168.1.100:5432/mototaller_db
db.user=motouser
db.password=MotoPass2026!
db.pool.size=10
```

Reemplace `192.168.1.100` por la IP fija de la computadora designada como Servidor Principal en su taller. ¡Listo! Todas las terminales compartirán stock, cotizaciones y kardex al instante.
