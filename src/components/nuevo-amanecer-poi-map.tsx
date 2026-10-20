// Esquema ilustrativo (no a escala) de la ubicación de Nuevo Amanecer y sus
// puntos de interés. Las posiciones son relativas dentro de un lienzo de
// 800 x 520; ajustarlas acá si cambia la referencia.

const brand = {
  forest: "#193e2e",
  moss: "#6e874c",
  lime: "#d2e7a6",
  cream: "#f7f8f0",
  field: "#eef2e4",
  town: "#dfe7cf",
  road: "#ffffff",
  rail: "#8a9a7c",
};

const project = { x: 420, y: 312 };
const finca = { x: 290, y: 326 };
const guernica = { x: 505, y: 150 };
const alejandroKorn = { x: 548, y: 418 };
const interchange = { x: 497, y: 212 };

function TownLabel({
  x,
  y,
  title,
  subtitle,
}: {
  x: number;
  y: number;
  title: string;
  subtitle: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx={74} ry={48} fill={brand.town} opacity={0.9} />
      <circle r={6} fill={brand.cream} stroke={brand.forest} strokeWidth={3} />
      <g transform="translate(14 -6)">
        <rect
          x={0}
          y={-16}
          width={Math.max(title.length * 10.5, subtitle.length * 6.2) + 26}
          height={40}
          rx={10}
          fill={brand.cream}
          stroke={brand.forest}
          strokeWidth={1.5}
        />
        <text x={13} y={2} fontSize={17} fontWeight={700} fill={brand.forest}>
          {title}
        </text>
        <text x={13} y={17} fontSize={10.5} fill={brand.moss}>
          {subtitle}
        </text>
      </g>
    </g>
  );
}

export function NuevoAmanecerPoiMap() {
  return (
    <svg
      viewBox="0 0 800 520"
      className="h-auto w-full"
      role="img"
      aria-label="Esquema de ubicación de Nuevo Amanecer junto a la Finca San Antonio, con la Autopista Presidente Perón, Guernica y Alejandro Korn"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <defs>
        <pattern id="na-poi-fields" width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill={brand.field} />
          <path d="M0 28 L28 0" stroke={brand.cream} strokeWidth={2} />
        </pattern>
        <filter id="na-poi-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={brand.forest} floodOpacity="0.25" />
        </filter>
      </defs>

      <rect width="800" height="520" fill="url(#na-poi-fields)" />

      {/* Pueblos */}
      <TownLabel x={guernica.x} y={guernica.y} title="Guernica" subtitle="Centro y estación Roca" />
      <TownLabel
        x={alejandroKorn.x}
        y={alejandroKorn.y}
        title="Alejandro Korn"
        subtitle="Centro y estación Roca"
      />

      {/* Ruta 210 + FC Roca */}
      <path
        d="M470 0 C 490 150, 500 260, 560 520"
        fill="none"
        stroke={brand.road}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        d="M455 0 C 475 150, 485 260, 545 520"
        fill="none"
        stroke={brand.rail}
        strokeWidth={2}
        strokeDasharray="10 5"
      />
      <g transform="translate(560 300)">
        <rect x={-4} y={-13} width={58} height={22} rx={6} fill={brand.road} stroke={brand.rail} />
        <text x={25} y={3} textAnchor="middle" fontSize={11} fontWeight={700} fill={brand.forest}>
          RP 210
        </text>
      </g>

      {/* Autopista Presidente Perón */}
      <path
        d={`M0 120 C 160 150, 330 200, ${interchange.x} ${interchange.y}`}
        fill="none"
        stroke={brand.forest}
        strokeWidth={16}
        strokeLinecap="round"
      />
      <path
        d={`M0 120 C 160 150, 330 200, ${interchange.x} ${interchange.y}`}
        fill="none"
        stroke={brand.lime}
        strokeWidth={1.5}
        strokeDasharray="12 10"
      />
      <circle cx={interchange.x} cy={interchange.y} r={11} fill={brand.cream} stroke={brand.forest} strokeWidth={4} />
      <g transform="translate(36 86)">
        <rect width={232} height={30} rx={15} fill={brand.forest} />
        <text x={116} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={brand.cream}>
          Autopista Presidente Perón
        </text>
      </g>

      {/* Acceso desde el loteo */}
      <path
        d={`M${project.x + 46} ${project.y - 10} C ${project.x + 90} ${project.y - 20}, ${interchange.x - 30} ${interchange.y + 50}, ${interchange.x - 4} ${interchange.y + 12}`}
        fill="none"
        stroke={brand.moss}
        strokeWidth={3.5}
        strokeDasharray="8 7"
        strokeLinecap="round"
      />

      {/* Finca San Antonio */}
      <g transform={`translate(${finca.x} ${finca.y})`}>
        <rect x={-58} y={-38} width={92} height={76} rx={12} fill={brand.lime} stroke={brand.moss} strokeWidth={2} />
        {[
          [-36, -16],
          [-12, -20],
          [12, -12],
          [-30, 12],
          [-4, 16],
          [18, 14],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={7} fill={brand.moss} opacity={0.65} />
        ))}
        <g transform="translate(-78 -70)">
          <rect width={132} height={26} rx={13} fill={brand.cream} stroke={brand.moss} strokeWidth={1.5} />
          <text x={66} y={17} textAnchor="middle" fontSize={12} fontWeight={700} fill={brand.forest}>
            Finca San Antonio
          </text>
        </g>
      </g>

      {/* Nuevo Amanecer */}
      <g transform={`translate(${project.x} ${project.y})`} filter="url(#na-poi-shadow)">
        <rect x={-46} y={-34} width={92} height={68} rx={10} fill={brand.forest} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={-38 + i * 16}
            y={-24}
            width={12}
            height={48}
            rx={2}
            fill={brand.lime}
            opacity={0.9}
          />
        ))}
      </g>
      <g transform={`translate(${project.x - 78} ${project.y + 46})`}>
        <rect width={156} height={44} rx={12} fill={brand.forest} />
        <text x={78} y={19} textAnchor="middle" fontSize={14} fontWeight={800} fill={brand.cream}>
          Nuevo Amanecer
        </text>
        <text x={78} y={34} textAnchor="middle" fontSize={10} fill={brand.lime}>
          80 lotes · 5 manzanas
        </text>
      </g>

      {/* Norte y aclaración */}
      <g transform="translate(748 52)">
        <circle r={22} fill={brand.cream} stroke={brand.forest} strokeWidth={1.5} />
        <path d="M0 -15 L7 6 L0 2 L-7 6 Z" fill={brand.forest} />
        <text y={17} textAnchor="middle" fontSize={9} fontWeight={700} fill={brand.forest}>
          N
        </text>
      </g>
      <text x={16} y={506} fontSize={11} fill={brand.moss}>
        Esquema ilustrativo, no a escala.
      </text>
    </svg>
  );
}
