# MANUAL DE DESPLIEGUE DE EJECUTABLES (.EXE), INTEGRACIÓN CONTINUA (CI/CD) Y AUTO-ACTUALIZACIÓN AUTOMÁTICA VÍA GITHUB RELEASES
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
   * Modifica el código, prueba localmente y hace `git push` a GitHub.

2. **Las computadoras del Taller (Entorno de Producción / Usuario Final):**
   * Son operadas por cajeros, recepcionistas y mecánicos.
   * **No tienen ni deben tener instalado Git ni entornos de compilación.**
   * El usuario espera hacer doble clic en un icono en su escritorio de Windows (`MotoGestion.exe`) y trabajar sin preocuparse de comandos.

### El reto de las Actualizaciones:
Si el programador corrige un error o agrega 50 repuestos nuevos en GitHub:
* **El método anticuado e ineficiente:** Ir con una memoria USB a cada uno de los 5 computadores del taller, desinstalar la versión vieja e instalar la nueva manualmente.
* **El método moderno de ingeniería de software (Auto-Update):** El ejecutable instalado en cada PC consulta periódicamente a GitHub Releases. Al detectar una versión nueva, **descarga el parche en segundo plano y se actualiza solo**, exactamente igual a como se actualizan aplicaciones como WhatsApp Desktop, Discord, Spotify o Visual Studio Code.

---

## 2. ARQUITECTURA DE DISTRIBUCIÓN DE SOFTWARE DE ESCRITORIO

El sistema se compone de 4 capas:

```
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
```

---

## 3. EL CICLO DE AUTO-ACTUALIZACIÓN AUTOMÁTICA (AUTO-UPDATER)

El proceso de auto-actualización sigue una máquina de estados estricta:

1. **Evento de Disparo (Trigger):**
   * Al iniciar la aplicación en el PC del taller, o cada 4 horas mediante un temporizador en segundo plano, la app llama al método `autoUpdater.checkForUpdates()`.
2. **Consulta a la API Pública de GitHub Releases:**
   * La app realiza una petición HTTP GET a:
     `https://api.github.com/repos/TU_USUARIO/motogestion-fx/releases/latest`
3. **Comparación Semántica de Versiones (SemVer):**
   * La app compara:
     * Versión local instalada: `1.0.0`
     * Versión publicada en GitHub: `1.1.0`
   * Si `1.1.0 > 1.0.0`, dispara el evento `update-available`.
4. **Descarga Diferencial o Completa en Segundo Plano:**
   * La app descarga el archivo instalador sin interrumpir el trabajo del mecánico o cajero.
   * Se comprueba la firma digital y el hash SHA-512 del archivo contra el manifest `latest.yml` para garantizar que el archivo no fue manipulado.
5. **Notificación Amigable al Usuario:**
   * Aparece una barra flotante en la esquina inferior:
     *"¡Nueva versión 1.1.0 lista! Novedades: Nuevas piezas de motor y mejora de facturas. [Reiniciar e Instalar]"*.
6. **Reemplazo Atómico e Inicio de la Nueva Versión:**
   * Al hacer clic en "Reiniciar e Instalar" (o al cerrar la app por la noche), el actualizador sustituye los binarios del programa e inicia inmediatamente la versión nueva.
   * **Importante:** Las configuraciones del taller, el logo, los datos de la base de datos local o en la nube **NUNCA se borran** porque residen en la carpeta de datos de usuario de Windows (`%APPDATA%/MotoGestion/`).

---

## 4. IMPLEMENTACIÓN CON ELECTRON BUILDER + GITHUB RELEASES

Para empaquetar la aplicación actual como un `.exe` con actualizador automático:

### A. Dependencias necesarias en `package.json`:
```json
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
```

### B. Configuración de `electron-builder.yml` para GitHub Releases:
```yaml
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
```

### C. Código del proceso principal (`electron/main.js`):
```javascript
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// Configuración del logger de actualización
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

  // Cargar la aplicación compilada de Vite
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  // Verificar actualizaciones al iniciar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!app.isPackaged) {
      console.log('Modo desarrollo: Saltando autoUpdater');
    } else {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
}

// Eventos del Auto-Updater
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

// Canal para reiniciar cuando el usuario dé clic en "Actualizar Ahora"
ipcMain.on('aplicar-actualizacion', () => {
  autoUpdater.quitAndInstall();
});

app.whenReady().then(createWindow);
```

---

## 5. IMPLEMENTACIÓN EN JAVAFX CON UPDATE4J

Si se compila la versión nativa en **Java 17/21 + JavaFX**, el estándar de la industria para auto-actualización es **Update4j** o un lanzador bootstrap liviano:

### Arquitectura de Update4j:
1. Se distribuye un ejecutable lanzador (`bootstrap.jar` o `MotoGestion.exe` generado con `jpackage`).
2. El lanzador lee un archivo XML remoto alojado en GitHub:
   `https://raw.githubusercontent.com/TU_USUARIO/motogestion-fx/main/releases/config.xml`
3. El archivo `config.xml` contiene la lista de archivos JAR y sus checksums SHA-256.
4. Si el checksum del JAR principal (`motogestion-core-1.1.0.jar`) difiere del local, descarga únicamente el nuevo JAR y arranca la aplicación actualizada sin reinstalar Java.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration timestamp="2026-10-28T19:00:00" uri="https://github.com/TU_USUARIO/motogestion-fx/releases/download/v1.1.0/">
    <files>
        <file path="motogestion-app.jar" 
              checksum="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" 
              classpath="true"/>
        <file path="lib/javafx-controls.jar" 
              checksum="b5a2c3..." 
              classpath="true"/>
    </files>
</configuration>
```

---

## 6. CONFIGURACIÓN DE GITHUB ACTIONS (CI/CD)

Para que **tú no tengas que compilar a mano en tu PC**, creamos el flujo de automatización en la nube de GitHub:

Archivo: `.github/workflows/build-and-release.yml`

```yaml
name: Compilar y Publicar Ejecutable .EXE

on:
  push:
    tags:
      - 'v*' # Se activa automáticamente cuando creas una etiqueta como v1.0.1, v1.1.0, etc.

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
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx electron-builder --win --publish always
```

### ¿Cómo lanzas una nueva versión para que todos los talleres se actualicen?
Solo ejecutas estos 3 comandos en tu terminal de desarrollo:
```bash
git add .
git commit -m "Nueva versión con repuestos de carreras y módulo fiscal"
git tag v1.1.0
git push origin main --tags
```
¡Listo! Los servidores de GitHub se encargarán de compilar el `.exe` en segundo plano, publicarlo en GitHub Releases y todas las computadoras del taller recibirán la actualización automáticamente.

---

## 7. SEGURIDAD CRIPTOGRÁFICA Y PERSISTENCIA DE LA BASE DE DATOS

Un punto crítico para el profesor es la **integridad de los datos durante las actualizaciones**:

1. **¿Qué pasa con la base de datos cuando se actualiza el programa?**
   * El código ejecutable reside en: `C:\Users\Usuario\AppData\Local\Programs\MotoGestion\`
   * La base de datos (SQLite o configuración de conexión PostgreSQL/Cloud) reside en: `C:\Users\Usuario\AppData\Roaming\MotoGestion\` o en el servidor Cloud (Neon/Supabase).
   * **Resultado:** La actualización reemplaza los binarios de la aplicación, pero la base de datos, clientes, ventas y facturas históricas permanecen 100% intactas.

2. **Verificación de Seguridad:**
   * El archivo `latest.yml` en GitHub Releases incluye una firma SHA-512.
   * Si un hacker intercepta la red o el archivo se descarga corrupto por un corte de internet, el instalador compara el hash y rechaza el archivo, evitando que la aplicación quede dañada.

---

## 8. GUÍA DE DEMOSTRACIÓN PASO A PASO PARA EL PROFESOR

En la sustentación académica, explica el flujo usando el **Simulador Interactivo de Despliegue CI/CD** incluido en el sistema:

1. **Paso 1 - Mostrar el Control de Versiones:**
   * Muestra que el sistema corre en la versión `v1.0.0-PRO`.
   * Explica que el código fuente está respaldado en el repositorio GitHub.
2. **Paso 2 - Simular la Orden de Actualización:**
   * Ingresa al panel de **"Despliegue .EXE & Auto-Updater"** en el Módulo de Administrador.
   * Selecciona la versión `v1.1.0 (Mejoras en el Diagrama HD y Nuevas Motos)`.
   * Presiona el botón: **"🚀 Simular Publicación en GitHub Releases"**.
3. **Paso 3 - Mostrar la Reacción en las Terminales:**
   * Señala cómo el cliente detecta la publicación remota.
   * Muestra la descarga en segundo plano con la barra de progreso y verificación del hash criptográfico.
4. **Paso 4 - Aplicar la Actualización:**
   * Haz clic en **"Reiniciar e Instalar Ahora"**.
   * La pantalla se refrescará mostrando la nueva versión `v1.1.0` en la barra superior, con los datos de inventario y configuración del taller intactos.
5. **Conclusión Académica para el Docente:**
   * *"Profesor, de esta manera el taller no depende de soporte técnico presencial: cualquier mejora o resolución legal se despliega a todas las computadoras del negocio de forma centralizada y segura a través de GitHub Releases."*
