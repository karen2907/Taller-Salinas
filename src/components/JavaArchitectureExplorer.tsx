import React, { useState } from 'react';
import { 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Database, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Server,
  FolderTree,
  AlertTriangle,
  Cloud,
  HardDrive,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { JAVA_PROJECT_FILES, JavaSourceFile } from '../data/javaCodeDeliverables';

export const JavaArchitectureExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedProfile, setCopiedProfile] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'codigo' | 'diagrama_arquitectura' | 'guia_bases_datos' | 'guia_logo_taller'>('codigo');
  const [selectedDbProfile, setSelectedDbProfile] = useState<'sqlite' | 'lan_postgres' | 'neon_cloud' | 'supabase_cloud'>('sqlite');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySnippet = (text: string, profileKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProfile(profileKey);
    setTimeout(() => setCopiedProfile(null), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileBadge = (type: JavaSourceFile['type']) => {
    switch (type) {
      case 'pom': return <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded font-mono">POM</span>;
      case 'sql': return <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded font-mono">SQL</span>;
      case 'config': return <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">CFG</span>;
      case 'model': return <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">POJO</span>;
      case 'dao': return <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono">DAO</span>;
      case 'controller': return <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">CTRL</span>;
      case 'fxml': return <span className="text-[10px] bg-pink-950 text-pink-300 px-1.5 py-0.5 rounded font-mono">FXML</span>;
      case 'main': return <span className="text-[10px] bg-yellow-950 text-yellow-300 px-1.5 py-0.5 rounded font-mono">APP</span>;
      case 'guide': return <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">GUÍA</span>;
    }
  };

  // Plantillas de database.properties
  const dbProfilesConfig = {
    sqlite: `# ============================================================================
# PERFIL 1: SQLITE LOCAL (RECOMENDADO MIENTRAS TANTO - CERO INSTALACIÓN)
# ============================================================================
# No requiere instalar nada ni crear usuarios.
# Crea el archivo 'mototaller.db' automáticamente al ejecutar la app.
db.engine=sqlite
db.url=jdbc:sqlite:mototaller.db
db.user=
db.password=`,
    lan_postgres: `# ============================================================================
# PERFIL 2: POSTGRESQL EN RED LOCAL (LAN) DEL TALLER
# ============================================================================
# Conecta todos los computadores del taller al PC Servidor
db.engine=postgresql
db.host=192.168.1.100
db.port=5432
db.name=mototaller_db
db.user=postgres
db.password=admin123
db.pool.maxSize=15`,
    neon_cloud: `# ============================================================================
# PERFIL 3: NEON.TECH POSTGRESQL (NUBE GRATIS DE POR VIDA)
# ============================================================================
# Regístrate gratis en https://neon.tech y pega tu URL con SSL
db.engine=postgresql
db.url=jdbc:postgresql://ep-silent-smoke-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
db.user=neondb_owner
db.password=tu_password_secreto_neon
db.pool.maxSize=5`,
    supabase_cloud: `# ============================================================================
# PERFIL 4: SUPABASE POSTGRESQL (NUBE GRATIS CON PANEL WEB)
# ============================================================================
# Regístrate gratis en https://supabase.com (500MB gratis)
db.engine=postgresql
db.url=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
db.user=postgres.yourprojectid
db.password=TuContrasenaSupabase123
db.pool.maxSize=5`
  };

  return (
    <div className="space-y-4">
      {/* CABECERA DE LA SUITE DE ARQUITECTURA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
              Arquitectura de Software Java 17+ · JavaFX 21
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              MVC + DAO · HikariCP · SQLite & PostgreSQL
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Estructura de Clases, Soluciones de Base de Datos y Personalización del Taller
          </h2>
          <p className="text-xs text-slate-400">
            Código fuente completo y estructurado listo para abrir y compilar en <strong>Visual Studio Code</strong> mediante Maven.
          </p>
        </div>

        {/* NAVEGACIÓN DE VISTAS */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('codigo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeView === 'codigo'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Explorador de Código</span>
          </button>
          <button
            onClick={() => setActiveView('guia_bases_datos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeView === 'guia_bases_datos'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Guía Base de Datos (Local vs Nube)</span>
          </button>
          <button
            onClick={() => setActiveView('guia_logo_taller')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeView === 'guia_logo_taller'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>¿Dónde cambiar Logo y Nombre?</span>
          </button>
          <button
            onClick={() => setActiveView('diagrama_arquitectura')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeView === 'diagrama_arquitectura'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Diagrama MVC/DAO</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VISTA 1: GUÍA DE BASE DE DATOS (LOCAL VS NUBE & ACLARACIÓN GITHUB)
          ========================================================================= */}
      {activeView === 'guia_bases_datos' && (
        <div className="space-y-4">
          {/* Alerta Destacada: Aclaración sobre Access y GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tarjeta 1: ¿Por qué NO Microsoft Access? */}
            <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-sm">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>¿Por qué NO usar Microsoft Access en Java?</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong>Sin soporte oficial en Java 17/21:</strong> Ni Oracle ni Microsoft dan soporte JDBC para archivos <code>.accdb</code>.</li>
                <li><strong>Bloqueo de archivos y corrupción:</strong> Cuando 2 personas en el taller (ej. mostrador y mecánico) intentan consultar o facturar al mismo tiempo, el archivo de Access se bloquea, botando errores de I/O y corrompiendo la base de datos.</li>
                <li><strong>Librería UCanAccess obsoleta:</strong> Es lenta y propensa a fallas de memoria con catálogos grandes de repuestos.</li>
              </ul>
              <div className="bg-slate-900/90 p-2 rounded border border-red-900 text-emerald-300 font-semibold">
                ✅ <strong>Solución:</strong> Usar <strong>SQLite</strong> (un solo archivo local, cero instalación y 100% compatible con Java).
              </div>
            </div>

            {/* Tarjeta 2: ¿Sirve GitHub como base de datos? */}
            <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>¿Sirve GitHub como Base de Datos? (Desmitificación)</span>
              </div>
              <p className="text-slate-300">
                <strong>Respuesta categórica: NO, GitHub no sirve como base de datos.</strong>
              </p>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong>GitHub es para Código, NO para Datos:</strong> Es un sistema de control de versiones Git para guardar archivos de texto y código fuente.</li>
                <li><strong>No tiene puerto TCP ni motor SQL:</strong> No existe una URL JDBC para conectarse a GitHub con <code>SELECT</code>, <code>INSERT</code> o <code>UPDATE</code> en milisegundos.</li>
                <li><strong>Riesgo de colapso:</strong> Si intentaras subir un archivo de DB a GitHub en cada venta, tendrías que hacer un <code>git commit</code> y <code>git push</code> por cada factura, bloqueando la aplicación y exponiendo datos de clientes.</li>
              </ul>
            </div>
          </div>

          {/* Opciones Recomendadas: SQLite Local vs Nube Gratis */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                Alternativas Profesionales y 100% Gratuitas
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                ¿Qué base de datos usar para tu Taller de Motos?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Opción 1: SQLite Local */}
              <div className="bg-slate-950 border border-emerald-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                      LOCAL (MIENTRAS TANTO)
                    </span>
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">SQLite (Archivo Único .db)</h4>
                  <p className="text-slate-400">
                    La mejor opción local sin complicaciones. <strong>No necesitas instalar NINGÚN programa</strong> ni configurar servidores ni contraseñas.
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>La base de datos es el archivo <code>mototaller.db</code>.</li>
                    <li>Cero consumo de memoria en segundo plano.</li>
                    <li>Nuestra clase <code>DatabaseConnection.java</code> auto-crea las tablas al primer inicio.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedDbProfile('sqlite')}
                  className={`w-full py-2 px-3 rounded-lg font-bold font-mono transition-colors text-center ${
                    selectedDbProfile === 'sqlite'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                  }`}
                >
                  {selectedDbProfile === 'sqlite' ? '✓ Perfil Seleccionado' : 'Ver Configuración SQLite'}
                </button>
              </div>

              {/* Opción 2: Neon.tech Nube Gratis */}
              <div className="bg-slate-950 border border-cyan-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-[10px]">
                      NUBE 100% GRATIS
                    </span>
                    <Cloud className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Neon.tech (PostgreSQL Serverless)</h4>
                  <p className="text-slate-400">
                    <strong>La mejor opción gratuita en la nube para Java.</strong> Te crea un servidor PostgreSQL real en 10 segundos sin pedir tarjeta de crédito.
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>Tier gratuito permanente con 0.5 GB.</li>
                    <li>Te entrega una URL JDBC con SSL lista para copiar.</li>
                    <li>Permite conectar tu app de escritorio desde cualquier computador con internet.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedDbProfile('neon_cloud')}
                  className={`w-full py-2 px-3 rounded-lg font-bold font-mono transition-colors text-center ${
                    selectedDbProfile === 'neon_cloud'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                  }`}
                >
                  {selectedDbProfile === 'neon_cloud' ? '✓ Perfil Seleccionado' : 'Ver Configuración Neon'}
                </button>
              </div>

              {/* Opción 3: Supabase Nube Gratis */}
              <div className="bg-slate-950 border border-purple-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold text-[10px]">
                      NUBE CON PANEL WEB
                    </span>
                    <Database className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Supabase (PostgreSQL Cloud)</h4>
                  <p className="text-slate-400">
                    Servicio en la nube con <strong>panel web visual en el navegador</strong> para ver tus tablas, productos y ventas en tiempo real.
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>500 MB de base de datos gratis.</li>
                    <li>Puedes editar precios y stock desde el navegador de tu celular.</li>
                    <li>Conexión directa JDBC compatible con el driver PostgreSQL.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setSelectedDbProfile('supabase_cloud')}
                  className={`w-full py-2 px-3 rounded-lg font-bold font-mono transition-colors text-center ${
                    selectedDbProfile === 'supabase_cloud'
                      ? 'bg-purple-500 text-slate-950'
                      : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                  }`}
                >
                  {selectedDbProfile === 'supabase_cloud' ? '✓ Perfil Seleccionado' : 'Ver Configuración Supabase'}
                </button>
              </div>
            </div>

            {/* Generador de Configuración de database.properties en vivo */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    Generador de Archivo: <code className="text-amber-400">src/main/resources/database.properties</code>
                  </span>
                </div>
                <button
                  onClick={() => handleCopySnippet(dbProfilesConfig[selectedDbProfile], selectedDbProfile)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-xs transition-colors"
                >
                  {copiedProfile === selectedDbProfile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedProfile === selectedDbProfile ? '¡Copiado al Portapapeles!' : 'Copiar este Perfil'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {dbProfilesConfig[selectedDbProfile]}
              </pre>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Solo pega este texto en tu archivo <code>database.properties</code> y ejecuta <code>mvn clean javafx:run</code> en VS Code. La app se conectará automáticamente.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 2: GUÍA DE PERSONALIZACIÓN DE LOGO Y NOMBRE DEL TALLER
          ========================================================================= */}
      {activeView === 'guia_logo_taller' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div>
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                Identidad Corporativa del Taller
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                ¿En qué parte del código puedo agregar la foto y el nombre del taller?
              </h3>
              <p className="text-xs text-slate-400">
                A continuación te mostramos exactamente los archivos y líneas tanto para la aplicación Java/JavaFX como para este simulador web.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Sección 1: En la Aplicación Java / JavaFX */}
              <div className="bg-slate-950 border border-cyan-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono pb-2 border-b border-cyan-900">
                  <Cpu className="w-4 h-4" />
                  <span>1. EN EL CÓDIGO JAVA / JAVAFX</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div>
                    <strong className="text-white">A. Dónde guardar el archivo de la foto / logo:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Copia tu imagen PNG o JPG a esta ruta dentro de la carpeta del proyecto:
                    </p>
                    <code className="block bg-slate-900 p-2 rounded text-cyan-300 font-mono text-[11px] mt-1 border border-slate-800">
                      src/main/resources/images/logo_taller.png
                    </code>
                  </div>

                  <div>
                    <strong className="text-white">B. Clase de Configuración <code>AppConfig.java</code>:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Abre <code>com/mototaller/config/AppConfig.java</code> y edita las constantes:
                    </p>
                    <pre className="bg-slate-900 p-2 rounded text-emerald-400 font-mono text-[10px] mt-1 border border-slate-800 overflow-x-auto">
{`public class AppConfig {
    public static final String NOMBRE_TALLER = "TU TALLER AQUÍ";
    public static final String NIT_TALLER = "900.123.456-7";
    public static final String DIRECCION_TALLER = "Calle 10 # 20-30";
    public static final String TELEFONOS_TALLER = "310 000 0000";
    public static final String LOGO_PATH = "/images/logo_taller.png";
}`}
                    </pre>
                  </div>

                  <div>
                    <strong className="text-white">C. Cómo se carga en la ventana JavaFX:</strong>
                    <p className="text-slate-400 mt-0.5">
                      En <code>MainApp.java</code> se establece como icono de la ventana de Windows:
                    </p>
                    <code className="block bg-slate-900 p-2 rounded text-amber-300 font-mono text-[10px] mt-1 border border-slate-800">
                      primaryStage.getIcons().add(new Image(getClass().getResourceAsStream(AppConfig.LOGO_PATH)));
                    </code>
                  </div>
                </div>
              </div>

              {/* Sección 2: En la Aplicación Web Actual */}
              <div className="bg-slate-950 border border-emerald-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono pb-2 border-b border-emerald-900">
                  <Sparkles className="w-4 h-4" />
                  <span>2. EN ESTA APLICACIÓN WEB INTERACTIVA</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div>
                    <strong className="text-white">A. Opción Rápida (Sin tocar código):</strong>
                    <p className="text-slate-400 mt-0.5">
                      Haz clic en el botón <strong>"Logo Taller"</strong> en la barra superior derecha. Se abrirá la ventana donde puedes:
                    </p>
                    <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                      <li>Cargar tu archivo de imagen desde el computador (drag & drop o selector).</li>
                      <li>Modificar el Nombre del Taller, NIT, Teléfono, Slogan y Dirección.</li>
                      <li>Guardar con persistencia automática en el navegador.</li>
                    </ul>
                  </div>

                  <div>
                    <strong className="text-white">B. En el archivo de Código Fuente Web:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Abre el archivo <code>src/data/initialData.ts</code> en las líneas 3 a 13:
                    </p>
                    <pre className="bg-slate-900 p-2 rounded text-emerald-400 font-mono text-[10px] mt-1 border border-slate-800 overflow-x-auto">
{`export const TALLER_CONFIG_INICIAL: TallerConfig = {
  nombre: 'MOTO RACING PRO SERVICE',
  slogan: 'Centro Técnico Especializado...',
  nit: '900.548.120-4',
  direccion: 'Av. Primero de Mayo # 28-40',
  telefono: '+57 (601) 458-9200',
  logoUrl: 'URL_O_ARCHIVO_BASE64_DE_TU_LOGO'
};`}
                    </pre>
                  </div>

                  <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/80 text-[11px] text-emerald-300">
                    ✨ Al cambiarlo, el logo se refleja automáticamente en la cabecera, en la marca de agua del diagrama de la moto, en el carrito lateral y en los formatos imprimibles de Cotización y Factura.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 3: EXPLORADOR DE CÓDIGO (ARCHIVOS FUENTE)
          ========================================================================= */}
      {activeView === 'codigo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* ÁRBOL DE ARCHIVOS LATERAL */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase font-mono">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>Estructura Maven</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{JAVA_PROJECT_FILES.length} archivos</span>
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {JAVA_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.name === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div className="truncate">
                        <div className="truncate font-mono text-[11px]">{file.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{file.package}</div>
                      </div>
                    </div>
                    <div className="shrink-0">{getFileBadge(file.type)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISUALIZADOR DE CÓDIGO FUENTE */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col overflow-hidden">
            {/* Cabecera del archivo seleccionado */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{selectedFile.name}</span>
                  {getFileBadge(selectedFile.type)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{selectedFile.package} · {selectedFile.description}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>

            {/* Código con resaltado */}
            <div className="p-4 bg-slate-950/90 overflow-x-auto flex-1 max-h-[600px] overflow-y-auto">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 4: DIAGRAMA ARQUITECTÓNICO MVC + DAO
          ========================================================================= */}
      {activeView === 'diagrama_arquitectura' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">
              Arquitectura Multicapa MVC + DAO para Taller de Motos
            </h3>
            <p className="text-xs text-slate-400">
              Desacoplamiento total entre la interfaz interactiva JavaFX, la lógica de ventas y el acceso a datos JDBC con HikariCP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* CAPA 1: PRESENTACIÓN */}
            <div className="bg-slate-950 border border-cyan-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono pb-2 border-b border-cyan-900">
                <Cpu className="w-4 h-4" />
                <span>1. PRESENTACIÓN (Vistas)</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">MainView.fxml</strong>
                  <div className="text-[11px] text-slate-400">Diagrama de la moto con polígonos interactivos y SplitPane de carrito lateral.</div>
                </li>
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">MainViewController.java</strong>
                  <div className="text-[11px] text-slate-400">Controlador MVC con carga de logo, filtros multimarca y ObservableList para el carrito.</div>
                </li>
              </ul>
            </div>

            {/* CAPA 2: NEGOCIO */}
            <div className="bg-slate-950 border border-amber-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono pb-2 border-b border-amber-900">
                <Layers className="w-4 h-4" />
                <span>2. NEGOCIO & MODELOS</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">Repuesto.java (POJO)</strong>
                  <div className="text-[11px] text-slate-400">Propiedades JavaFX observables para TableView con referencia OEM y cilindraje.</div>
                </li>
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">Transacciones ACID</strong>
                  <div className="text-[11px] text-slate-400">Venta atómica: descuento de stock, inserción de factura y registro en Kardex.</div>
                </li>
              </ul>
            </div>

            {/* CAPA 3: ACCESO A DATOS (DAO) */}
            <div className="bg-slate-950 border border-purple-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold font-mono pb-2 border-b border-purple-900">
                <Database className="w-4 h-4" />
                <span>3. CAPA DAO (Interfaces)</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">RepuestoDAO / KardexDAO</strong>
                  <div className="text-[11px] text-slate-400">Operaciones CRUD con PreparedStatement para máxima seguridad contra inyecciones SQL.</div>
                </li>
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">HikariCP Connection Pool</strong>
                  <div className="text-[11px] text-slate-400">Pool Singleton compartido con reconexión automática y protección TCP.</div>
                </li>
              </ul>
            </div>

            {/* CAPA 4: PERSISTENCIA */}
            <div className="bg-slate-950 border border-emerald-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono pb-2 border-b border-emerald-900">
                <Server className="w-4 h-4" />
                <span>4. PERSISTENCIA FLEXIBLE</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">SQLite Local</strong>
                  <div className="text-[11px] text-slate-400">Un solo archivo .db en tu PC para empezar hoy sin instalar servidores.</div>
                </li>
                <li className="bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-white">Nube Gratis (Neon / Supabase)</strong>
                  <div className="text-[11px] text-slate-400">PostgreSQL Cloud con conexión segura SSL para consultar desde cualquier lugar.</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
