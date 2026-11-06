import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Zap, 
  Disc, 
  Compass, 
  ShieldCheck, 
  Search, 
  Plus, 
  AlertCircle, 
  Info, 
  MapPin, 
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Gauge,
  Tag,
  Crosshair,
  ExternalLink,
  MousePointerClick
} from 'lucide-react';
import { ZonaMotoId, MarcaMoto, Repuesto, ZonaMoto, TallerConfig } from '../types/workshop';
import { ZONAS_MOTO } from '../data/initialData';

interface MotorcycleExplorerProps {
  repuestos: Repuesto[];
  onAddToCart: (repuesto: Repuesto, cantidad: number) => void;
  tallerConfig: TallerConfig;
  onOpenBrandingModal?: () => void;
}

// Definición de las partes señaladas interactivas de la Kawasaki Ninja ZX-10RR
interface InteractivePartHotspot {
  id: string;
  label: string;
  sublabel: string;
  zonaId: ZonaMotoId;
  subparteFiltro: string;
  targetX: number; // Punto exacto en la moto en %
  targetY: number;
  labelX: number;  // Posición de la etiqueta/botón en %
  labelY: number;
  tipo: 'exterior' | 'mecanico' | 'electrico';
  descripcionCorta: string;
  hitPolygon: string; // Polígono SVG clickeable directamente sobre la foto
}

const KAWASAKI_HOTSPOTS: InteractivePartHotspot[] = [
  {
    id: 'cupula',
    label: 'Cúpula / Parabrisas',
    sublabel: 'Doble burbuja Racing Fumé',
    zonaId: 'mandos_guayas',
    subparteFiltro: 'Cúpula y Parabrisas Aerodinámico',
    targetX: 71,
    targetY: 17,
    labelX: 63,
    labelY: 9,
    tipo: 'exterior',
    descripcionCorta: 'Cúpula aerodinámica en metacrilato de 3mm ensayada en túnel de viento para alta velocidad.',
    hitPolygon: '63,8 77,8 79,22 66,22 62,14'
  },
  {
    id: 'espejos',
    label: 'Espejos Retrovisores',
    sublabel: 'Con direccionales LED',
    zonaId: 'mandos_guayas',
    subparteFiltro: 'Espejos Retrovisores Homologados',
    targetX: 76,
    targetY: 24,
    labelX: 84,
    labelY: 8,
    tipo: 'exterior',
    descripcionCorta: 'Retrovisores aerodinámicos de carenado con intermitentes LED secuenciales homologados.',
    hitPolygon: '72,15 83,15 83,27 72,27'
  },
  {
    id: 'faros',
    label: 'Faros Delanteros',
    sublabel: 'Óptica dual Full LED',
    zonaId: 'electrico',
    subparteFiltro: 'Iluminación y Farolas LED',
    targetX: 80,
    targetY: 34,
    labelX: 91,
    labelY: 31,
    tipo: 'electrico',
    descripcionCorta: 'Faros delanteros elipsoidales Full LED de 6500 lúmenes con luces DRL integradas.',
    hitPolygon: '76,27 89,29 89,41 77,41 74,33'
  },
  {
    id: 'manillar',
    label: 'Semimanillares y Levas',
    sublabel: 'Comandos y Bomba Radial',
    zonaId: 'mandos_guayas',
    subparteFiltro: 'Manubrio, Semimanillares y Puños',
    targetX: 63,
    targetY: 27,
    labelX: 52,
    labelY: 12,
    tipo: 'mecanico',
    descripcionCorta: 'Semimanillares clip-on con contrapesos mecanizados, puños Domino y bomba radial Brembo RCS 19.',
    hitPolygon: '57,22 68,22 68,34 57,34'
  },
  {
    id: 'tanque',
    label: 'Tanque de Gasolina',
    sublabel: 'Aluminio 17L con Tapa Rápida',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Tanque de Combustible y Tapas',
    targetX: 47,
    targetY: 28,
    labelX: 38,
    labelY: 8,
    tipo: 'exterior',
    descripcionCorta: 'Depósito en aleación de aluminio conformado para acople aerodinámico del piloto y tapa rápida.',
    hitPolygon: '41,20 55,20 57,36 43,36'
  },
  {
    id: 'guardabarros',
    label: 'Guardabarros Frontal',
    sublabel: 'Fibra de carbono con tomas',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Guardabarros y Tapas Carenaje',
    targetX: 78,
    targetY: 53,
    labelX: 90,
    labelY: 48,
    tipo: 'exterior',
    descripcionCorta: 'Guardabarros en carbono 3K con conductos de ventilación a calipers de freno.',
    hitPolygon: '71,45 85,45 90,53 83,60 74,57 70,51'
  },
  {
    id: 'carenado',
    label: 'Carenado Lateral KRT',
    sublabel: 'Verde Lima / Ébano ABS',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Guardabarros y Tapas Carenaje',
    targetX: 58,
    targetY: 54,
    labelX: 68,
    labelY: 86,
    tipo: 'exterior',
    descripcionCorta: 'Carenado lateral integral en ABS termo-sellado con calcomanías oficiales del equipo KRT.',
    hitPolygon: '46,33 63,33 74,42 78,48 73,61 66,69 54,68 47,71 43,62 45,47'
  },
  {
    id: 'asiento',
    label: 'Sillín Piloto',
    sublabel: 'Espuma racing antideslizante',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Sillín Piloto/Copiloto y Subchasis',
    targetX: 35,
    targetY: 32,
    labelX: 25,
    labelY: 18,
    tipo: 'exterior',
    descripcionCorta: 'Asiento ergonómico con forro antideslizante grip diamante y espuma de alta densidad.',
    hitPolygon: '26,24 38,28 44,34 40,41 31,40 23,32 19,25'
  },
  {
    id: 'colin',
    label: 'Colín y Subchasis',
    sublabel: 'Stop LED y Portaplacas',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Sillín Piloto/Copiloto y Subchasis',
    targetX: 18,
    targetY: 30,
    labelX: 8,
    labelY: 22,
    tipo: 'exterior',
    descripcionCorta: 'Estructura trasera en aluminio con luz de freno LED integrada y soporte de placa aligerado.',
    hitPolygon: '12,23 25,23 25,37 12,37'
  },
  {
    id: 'radiador',
    label: 'Radiador de Refrigeración',
    sublabel: 'Curvado de Aluminio Sobredimensionado',
    zonaId: 'motor',
    subparteFiltro: 'Radiador y Sistema de Refrigeración',
    targetX: 62,
    targetY: 46,
    labelX: 74,
    labelY: 39,
    tipo: 'mecanico',
    descripcionCorta: 'Intercambiador térmico de aluminio con 30% más de flujo de refrigerante para circuito.',
    hitPolygon: '57,40 68,40 68,52 57,52'
  },
  {
    id: 'motor',
    label: 'Motor y Transmisión',
    sublabel: '4 cilindros DOHC 16V 998cc',
    zonaId: 'motor',
    subparteFiltro: 'Cárter y Cigüeñal',
    targetX: 49,
    targetY: 58,
    labelX: 47,
    labelY: 43,
    tipo: 'mecanico',
    descripcionCorta: 'Planta motriz de 998cc, cigüeñal forjado, bielas de titanio, pistones con recubrimiento DLC.',
    hitPolygon: '42,46 56,46 56,66 42,66'
  },
  {
    id: 'estriberas',
    label: 'Estriberas y Quickshifter',
    sublabel: 'Regulables Ergal CNC',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Sliders, Defensas y Estriberas CNC',
    targetX: 37,
    targetY: 62,
    labelX: 26,
    labelY: 74,
    tipo: 'mecanico',
    descripcionCorta: 'Posapiés y estriberas en aluminio aeronáutico 7075 con sensor KQS de varillaje bidireccional.',
    hitPolygon: '32,56 42,56 42,68 32,68'
  },
  {
    id: 'pata',
    label: 'Pata Lateral',
    sublabel: 'Soporte con switch de corte',
    zonaId: 'electrico',
    subparteFiltro: 'Switches, Comandos y Pata',
    targetX: 45,
    targetY: 76,
    labelX: 43,
    labelY: 86,
    tipo: 'mecanico',
    descripcionCorta: 'Pata de apoyo forjada con resorte doble y micro-interruptor inductivo de seguridad.',
    hitPolygon: '40,69 50,69 50,83 40,83'
  },
  {
    id: 'frenos',
    label: 'Frenos Delanteros Brembo',
    sublabel: 'Discos 330mm & Calipers Stylema',
    zonaId: 'frenos_suspension',
    subparteFiltro: 'Discos de Freno Delantero / Trasero',
    targetX: 75,
    targetY: 68,
    labelX: 86,
    labelY: 72,
    tipo: 'mecanico',
    descripcionCorta: 'Discos flotantes Brembo T-Drive 330mm, calipers monobloque radiales y pastillas sinterizadas.',
    hitPolygon: '66,53 87,53 87,90 66,90'
  },
  {
    id: 'suspension_delantera',
    label: 'Horquilla Showa BFF',
    sublabel: 'Barras Invertidas 43mm TiN',
    zonaId: 'frenos_suspension',
    subparteFiltro: 'Barras Telescópicas / Horquilla Invertida',
    targetX: 68,
    targetY: 48,
    labelX: 78,
    labelY: 38,
    tipo: 'mecanico',
    descripcionCorta: 'Horquilla presurizada con cámara externa de nitrógeno y recubrimiento dorado anti-fricción.',
    hitPolygon: '64,36 73,36 73,62 64,62'
  },
  {
    id: 'escape',
    label: 'Escape Deportivo',
    sublabel: 'Akrapovic Titanio y Carbono',
    zonaId: 'motor',
    subparteFiltro: 'Sistema de Escape y Silenciador',
    targetX: 24,
    targetY: 56,
    labelX: 12,
    labelY: 53,
    tipo: 'mecanico',
    descripcionCorta: 'Silenciador Akrapovic cónico en titanio con tapa final de fibra de carbono (+3.2 HP).',
    hitPolygon: '14,44 33,44 39,63 20,63'
  },
  {
    id: 'arrastre_cadena',
    label: 'Kit de Arrastre RK',
    sublabel: 'Cadena 525 Dorada XW-Ring',
    zonaId: 'carenaje_chasis',
    subparteFiltro: 'Kit de Arrastre (Cadena, Piñón, Corona)',
    targetX: 28,
    targetY: 68,
    labelX: 18,
    labelY: 78,
    tipo: 'mecanico',
    descripcionCorta: 'Cadena de alta tracción 42 kN con retenes XW y corona duraluminio 7075-T6.',
    hitPolygon: '20,62 35,62 35,76 20,76'
  },
  {
    id: 'monoshock',
    label: 'Monoshock Showa BFRC',
    sublabel: 'Amortiguador con Piggyback',
    zonaId: 'frenos_suspension',
    subparteFiltro: 'Amortiguador Monoshock Trasero',
    targetX: 38,
    targetY: 48,
    labelX: 32,
    labelY: 40,
    tipo: 'mecanico',
    descripcionCorta: 'Amortiguador de competición con depósito separado y bieletas progresivas horizontales.',
    hitPolygon: '33,42 42,42 42,54 33,54'
  }
];

export const MotorcycleExplorer: React.FC<MotorcycleExplorerProps> = ({
  repuestos,
  onAddToCart,
  tallerConfig,
  onOpenBrandingModal
}) => {
  const [selectedZona, setSelectedZona] = useState<ZonaMotoId>('carenaje_chasis');
  const [selectedSubparte, setSelectedSubparte] = useState<string>('Todas');
  const [selectedMarca, setSelectedMarca] = useState<string>('Todas');
  const [selectedCilindraje, setSelectedCilindraje] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [showCalloutLines, setShowCalloutLines] = useState<boolean>(() => tallerConfig.diagrama?.mostrarLineasGuia ?? true);
  const [addedItemAnim, setAddedItemAnim] = useState<number | null>(null);
  const [copiedOem, setCopiedOem] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);

  const currentZonaConfig: ZonaMoto = useMemo(() => {
    return ZONAS_MOTO.find(z => z.id === selectedZona) || ZONAS_MOTO[0];
  }, [selectedZona]);

  const activeHotspot = useMemo(() => {
    if (!activeHotspotId) return null;
    return KAWASAKI_HOTSPOTS.find(h => h.id === activeHotspotId) || null;
  }, [activeHotspotId]);

  const marcasList: (MarcaMoto | 'Todas')[] = [
    'Todas',
    'Kawasaki',
    'Yamaha',
    'Suzuki',
    'Bajaj',
    'AKT',
    'Honda',
    'KTM',
    'Universal'
  ];

  const cilindrajesList = [
    'Todos',
    '1000cc',
    '650cc',
    '400cc',
    '390cc',
    '321cc',
    '250cc',
    '200cc',
    '190cc',
    '155cc',
    '150cc',
    '125cc',
    '100cc',
    'Universal'
  ];

  // Filtrado reactivo de repuestos
  const repuestosFiltrados = useMemo(() => {
    return repuestos.filter(r => {
      // Zona
      if (r.zonaId !== selectedZona) return false;

      // Subparte
      if (selectedSubparte !== 'Todas' && r.subparte !== selectedSubparte) return false;

      // Marca
      if (selectedMarca !== 'Todas') {
        if (selectedMarca === 'Universal') {
          if (r.marcaMoto !== 'Universal') return false;
        } else {
          if (r.marcaMoto !== selectedMarca && r.marcaMoto !== 'Universal') return false;
        }
      }

      // Cilindraje
      if (selectedCilindraje !== 'Todos') {
        if (!r.cilindraje.includes(selectedCilindraje) && r.cilindraje !== 'Universal') {
          return false;
        }
      }

      // Búsqueda de texto
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchSku = r.codigo.toLowerCase().includes(query);
        const matchOem = (r.referenciaOEM || '').toLowerCase().includes(query);
        const matchNombre = r.nombre.toLowerCase().includes(query);
        const matchModelos = r.modelosCompatibles.some(m => m.toLowerCase().includes(query));
        const matchDesc = r.descripcion.toLowerCase().includes(query);
        const matchSpecs = (r.especificacionesTecnicas || '').toLowerCase().includes(query);
        if (!matchSku && !matchOem && !matchNombre && !matchModelos && !matchDesc && !matchSpecs) return false;
      }

      return true;
    });
  }, [repuestos, selectedZona, selectedSubparte, selectedMarca, selectedCilindraje, searchQuery]);

  const handleSelectHotspot = (hotspot: InteractivePartHotspot) => {
    setActiveHotspotId(hotspot.id);
    setSelectedZona(hotspot.zonaId);
    
    // Si hay repuestos que coinciden exactamente con la subparte de este hotspot, la filtramos
    const hasExact = repuestos.some(r => r.zonaId === hotspot.zonaId && r.subparte === hotspot.subparteFiltro);
    if (hasExact) {
      setSelectedSubparte(hotspot.subparteFiltro);
    } else {
      setSelectedSubparte('Todas');
    }

    setClickRipple({ x: hotspot.targetX, y: hotspot.targetY });
    setTimeout(() => setClickRipple(null), 800);
  };

  // Clic directo en cualquier parte de la imagen/SVG de la moto (calcula la parte más cercana)
  const handleSvgBackgroundClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Buscar el hotspot más cercano a donde se hizo clic
    let closest = KAWASAKI_HOTSPOTS[0];
    let minDistance = Number.MAX_VALUE;

    for (const h of KAWASAKI_HOTSPOTS) {
      const dist = Math.hypot(clickX - h.targetX, clickY - h.targetY);
      if (dist < minDistance) {
        minDistance = dist;
        closest = h;
      }
    }

    handleSelectHotspot(closest);
  };

  const handleQuantityChange = (id: number, delta: number, maxStock: number) => {
    const current = itemQuantities[id] || 1;
    const next = Math.max(1, Math.min(maxStock, current + delta));
    setItemQuantities(prev => ({ ...prev, [id]: next }));
  };

  const handleAdd = (repuesto: Repuesto) => {
    const qty = itemQuantities[repuesto.id] || 1;
    onAddToCart(repuesto, qty);
    setAddedItemAnim(repuesto.id);
    setTimeout(() => {
      setAddedItemAnim(null);
    }, 1200);
  };

  const handleCopyOEM = (oem: string) => {
    navigator.clipboard.writeText(oem);
    setCopiedOem(oem);
    setTimeout(() => setCopiedOem(null), 1800);
  };

  const getZoneIcon = (id: ZonaMotoId) => {
    switch (id) {
      case 'motor': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'electrico': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'frenos_suspension': return <Disc className="w-4 h-4 text-sky-400" />;
      case 'mandos_guayas': return <Compass className="w-4 h-4 text-purple-400" />;
      case 'carenaje_chasis': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* =========================================================================
          SECCIÓN 1: FOTOGRAFÍA ESTUDIO KAWASAKI NINJA ZX-10RR INTERACTIVA CON LABELS
          ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
        {/* Barra superior de control del Diagrama */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <span>Diagrama Interactivo de Motocicleta</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-normal">
                  Kawasaki Ninja ZX-10RR & Multimarca
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowCalloutLines(!showCalloutLines)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${
                showCalloutLines
                  ? 'bg-slate-800 text-emerald-400 border-slate-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showCalloutLines ? 'Ocultar Líneas Guía' : 'Mostrar Líneas Guía'}</span>
            </button>
          </div>
        </div>

        {/* MARCA DE AGUA DEL TALLER EN EL FONDO DEL DIAGRAMA */}
        {tallerConfig.logoMarcaAgua && tallerConfig.logoUrl && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none z-0">
            <img 
              src={tallerConfig.logoUrl} 
              alt="Marca de Agua Taller" 
              className="w-96 h-96 object-contain filter grayscale"
            />
          </div>
        )}

        {/* CONTENEDOR DE LA MOTO FOTOGRÁFICA CON HITBOXES CLICKEABLES DIRECTOS */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl">
          {/* CONTENEDOR RELATIVO PARA LA FOTO + OVERLAY SVG INTERACTIVO */}
          <div className="relative w-full aspect-[16/9] max-h-[580px] flex items-center justify-center bg-black">
            {/* Imagen Principal de la Kawasaki Ninja ZX-10RR */}
            <img 
              src="/kawasaki_ninja_zx10r.jpg"
              alt="Kawasaki Ninja ZX-10RR"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/src/assets/kawasaki_ninja_zx10r.jpg';
              }}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
            />

            {/* OVERLAY SVG CON ZONAS CLICKEABLES DIRECTAS SOBRE LA IMAGEN (HITPOLYGONS) */}
            <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              onClick={handleSvgBackgroundClick}
              className="absolute inset-0 w-full h-full z-15 pointer-events-auto cursor-crosshair"
            >
              <defs>
                <filter id="glow-green-point" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-zone-active" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. ZONAS POLIGONALES INTERACTIVAS SOBRE EL CUERPO DE LA MOTO */}
              {KAWASAKI_HOTSPOTS.map((h) => {
                const isActive = activeHotspotId === h.id;
                const isHovered = hoveredHotspot === h.id;

                return (
                  <polygon
                    key={`hit-${h.id}`}
                    points={h.hitPolygon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHotspot(h);
                    }}
                    onMouseEnter={() => setHoveredHotspot(h.id)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className="cursor-pointer transition-all duration-200"
                    fill={
                      isActive 
                        ? 'rgba(34, 197, 94, 0.40)' 
                        : isHovered 
                          ? 'rgba(163, 230, 53, 0.32)' 
                          : 'rgba(34, 197, 94, 0.08)'
                    }
                    stroke={
                      isActive 
                        ? '#22c55e' 
                        : isHovered 
                          ? '#a3e635' 
                          : 'rgba(34, 197, 94, 0.25)'
                    }
                    strokeWidth={isActive ? 0.9 : isHovered ? 0.7 : 0.35}
                    strokeDasharray={isActive ? '' : '1.5 1'}
                    filter={isActive ? 'url(#glow-zone-active)' : ''}
                  >
                    <title>{`${h.label} - Haz clic en la moto para ver repuestos`}</title>
                  </polygon>
                );
              })}

              {/* 2. LÍNEAS SEÑALADORAS Y DIANAS PÚLSANTES */}
              {showCalloutLines && KAWASAKI_HOTSPOTS.map((h) => {
                const isActive = activeHotspotId === h.id;
                const isHovered = hoveredHotspot === h.id;
                const strokeColor = isActive 
                  ? '#22c55e' 
                  : isHovered 
                    ? '#a3e635' 
                    : '#475569';
                const strokeWidth = isActive ? 0.7 : isHovered ? 0.5 : 0.28;

                return (
                  <g key={`line-${h.id}`} className="transition-all duration-200 pointer-events-none">
                    {/* Línea que conecta la etiqueta con el punto en la motocicleta */}
                    <line 
                      x1={h.labelX} 
                      y1={h.labelY} 
                      x2={h.targetX} 
                      y2={h.targetY} 
                      stroke={strokeColor} 
                      strokeWidth={strokeWidth} 
                      strokeDasharray={isActive ? '' : '1 0.8'}
                      opacity={isActive ? 1 : isHovered ? 0.9 : 0.45}
                    />

                    {/* Círculo diana en la parte física de la moto */}
                    <circle 
                      cx={h.targetX} 
                      cy={h.targetY} 
                      r={isActive ? 1.8 : 1.2} 
                      fill={isActive ? '#22c55e' : '#0f172a'} 
                      stroke={isActive ? '#ffffff' : strokeColor} 
                      strokeWidth={isActive ? 0.6 : 0.4}
                      filter={isActive ? 'url(#glow-green-point)' : ''}
                    />
                    {isActive && (
                      <circle 
                        cx={h.targetX} 
                        cy={h.targetY} 
                        r="3.2" 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="0.3" 
                        opacity="0.8"
                      />
                    )}
                  </g>
                );
              })}

              {/* 3. ONDA EXPANSIVA RIPPLE AL HACER CLIC */}
              {clickRipple && (
                <circle
                  cx={clickRipple.x}
                  cy={clickRipple.y}
                  r="5"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="0.8"
                  className="animate-ping pointer-events-none"
                />
              )}
            </svg>

            {/* BOTONES FLOTANTES CON EL NOMBRE DE LA PARTE (TAMBIÉN CLICKEABLES) */}
            <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
              {KAWASAKI_HOTSPOTS.map((h) => {
                const isActive = activeHotspotId === h.id;
                const isHovered = hoveredHotspot === h.id;

                return (
                  <button
                    key={h.id}
                    onClick={() => handleSelectHotspot(h)}
                    onMouseEnter={() => setHoveredHotspot(h.id)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    style={{
                      left: `${h.labelX}%`,
                      top: `${h.labelY}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute pointer-events-auto px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-all duration-150 flex items-center gap-1 shadow-xl border cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 border-white shadow-emerald-500/50 scale-110 z-30 ring-2 ring-emerald-400/50'
                        : isHovered
                          ? 'bg-slate-900 text-emerald-300 border-emerald-400 scale-105 z-20'
                          : 'bg-slate-950/85 backdrop-blur-sm text-slate-200 border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-slate-950 animate-ping' : 'bg-emerald-400'}`}></span>
                    <span>{h.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BARRA INFERIOR DE ACCESO RÁPIDO A TODAS LAS PARTES SEÑALADAS */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Crosshair className="w-3.5 h-3.5" />
                Partes Señaladas (Haz clic en la foto o en el botón):
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {KAWASAKI_HOTSPOTS.length} partes interactivas activas
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {KAWASAKI_HOTSPOTS.map((h) => {
                const isActive = activeHotspotId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => handleSelectHotspot(h)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 scale-105'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-slate-950' : 'bg-emerald-400'}`}></span>
                    <span>{h.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECCIÓN 2: CATÁLOGO TÉCNICO FILTRABLE POR MARCA, CILINDRAJE Y PARTE
          (SOLO SE MUESTRA SEGÚN LA SELECCIÓN EN EL DIAGRAMA)
          ========================================================================= */}
      {activeHotspot !== null ? (
        <div id="seccion-repuestos-compatibles" className="bg-slate-900 border border-emerald-700/80 rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-emerald-500/30">
          {/* Cabecera de Filtros con botón para cerrar selección */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-bold">
                  Repuestos Compatibles para:
                </span>
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  {activeHotspot.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                {getZoneIcon(selectedZona)}
                <span>{currentZonaConfig.nombre}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  · {repuestosFiltrados.length} referencias coincidentes
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Buscador Integral */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por referencia OEM, SKU, modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Botón para Cerrar Selección y Volver a Ver Solo la Moto */}
              <button
                onClick={() => setActiveHotspotId(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                title="Cerrar repuestos y ver solo el diagrama de la moto"
              >
                <span>✕ Ver Solo la Moto</span>
              </button>
            </div>
          </div>

        {/* FILTRO 1: SUBPARTES DE LA ZONA */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Subparte / Componente:</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSubparte('Todas')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedSubparte === 'Todas'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              Todas las Subpartes
            </button>
            {currentZonaConfig.subpartes.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubparte(sub)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedSubparte === sub
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* FILTRO 2: MARCA DE MOTO Y CILINDRAJE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Marcas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Marca de la Moto:</label>
            <div className="flex flex-wrap gap-1.5">
              {marcasList.map((marca) => (
                <button
                  key={marca}
                  onClick={() => setSelectedMarca(marca)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedMarca === marca
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {marca === 'Todas' ? 'Todas' : marca}
                </button>
              ))}
            </div>
          </div>

          {/* Cilindrajes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cilindraje del Motor:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {cilindrajesList.map((cc) => (
                <button
                  key={cc}
                  onClick={() => setSelectedCilindraje(cc)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    selectedCilindraje === cc
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================================
            LISTA DETALLADA DE COMPONENTES CON REFERENCIA OEM Y ESPECIFICACIONES
            ===================================================================== */}
        {repuestosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-slate-950 rounded-xl border border-dashed border-slate-800 p-6 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No se encontraron componentes con estos filtros</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Intenta cambiar la subparte a "Todas las Subpartes" o selecciona "Todas" en marcas o cilindrajes.
            </p>
            <button
              onClick={() => {
                setSelectedSubparte('Todas');
                setSelectedMarca('Todas');
                setSelectedCilindraje('Todos');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Restablecer Todos los Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pt-2">
            {repuestosFiltrados.map((rep) => {
              const qty = itemQuantities[rep.id] || 1;
              const isLowStock = rep.stockActual <= rep.stockMinimo;
              const isOut = rep.stockActual === 0;

              return (
                <div
                  key={rep.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between space-y-3 shadow-md transition-all group"
                >
                  <div className="space-y-2">
                    {/* Fila superior: Marca, Cilindraje y Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                          {rep.marcaMoto}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
                          {rep.cilindraje}
                        </span>
                      </div>

                      {/* Stock Badge */}
                      {isOut ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                          AGOTADO
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Stock Bajo ({rep.stockActual})</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Stock: {rep.stockActual}
                        </span>
                      )}
                    </div>

                    {/* Nombre del repuesto */}
                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                      {rep.nombre}
                    </h4>

                    {/* Referencia OEM & SKU */}
                    <div className="flex items-center justify-between bg-slate-900/80 px-2 py-1 rounded border border-slate-800 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-400 truncate">
                        <Tag className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">OEM: {rep.referenciaOEM || 'N/A'}</span>
                      </div>
                      {rep.referenciaOEM && (
                        <button
                          onClick={() => handleCopyOEM(rep.referenciaOEM!)}
                          className="text-slate-500 hover:text-white p-0.5 shrink-0"
                          title="Copiar Referencia OEM"
                        >
                          {copiedOem === rep.referenciaOEM ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Descripción Técnica */}
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {rep.descripcion}
                    </p>

                    {/* Especificaciones Técnicas */}
                    {rep.especificacionesTecnicas && (
                      <div className="text-[10px] text-slate-400 font-mono bg-slate-900 p-1.5 rounded border border-slate-850">
                        <strong className="text-slate-300">Ficha:</strong> {rep.especificacionesTecnicas}
                      </div>
                    )}

                    {/* Modelos Compatibles */}
                    <div className="text-[11px] text-slate-300 pt-0.5">
                      <span className="text-slate-500 font-semibold">Modelos: </span>
                      <span>{rep.modelosCompatibles.join(', ')}</span>
                      {rep.anoCompatibilidad && (
                        <span className="text-slate-500"> ({rep.anoCompatibilidad})</span>
                      )}
                    </div>
                  </div>

                  {/* Fila Inferior: Precios y Agregar al Carrito Persistente */}
                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">Precio Venta</div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        ${rep.precioVenta.toLocaleString('es-CO')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Selector de cantidad */}
                      {!isOut && (
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden text-xs">
                          <button
                            onClick={() => handleQuantityChange(rep.id, -1, rep.stockActual)}
                            className="px-2 py-1 text-slate-300 hover:bg-slate-800 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-white">{qty}</span>
                          <button
                            onClick={() => handleQuantityChange(rep.id, 1, rep.stockActual)}
                            className="px-2 py-1 text-slate-300 hover:bg-slate-800 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {/* Botón de Agregar al Carrito */}
                      <button
                        onClick={() => handleAdd(rep)}
                        disabled={isOut}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isOut
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : addedItemAnim === rep.id
                              ? 'bg-emerald-500 text-slate-950 scale-105'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                        }`}
                      >
                        {addedItemAnim === rep.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Agregado!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agregar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ) : null}
    </div>
  );
};
