import { Activity, BookOpen, FlaskConical, Route } from "lucide-react";

const stats = [
  { value: "50+", label: "Learning modules", icon: BookOpen },
  { value: "200+", label: "Hands-on labs", icon: FlaskConical },
  { value: "20+", label: "Career paths", icon: Route }
];

function NetworkArtwork() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[180px] w-full max-w-[340px] sm:h-[220px] sm:max-w-[420px] lg:h-[250px] lg:max-w-[460px]">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/20 bg-lime/[0.03] shadow-[0_0_80px_rgba(157,255,0,0.08)]" />
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[28px] border border-lime/40 bg-[#0d171b] shadow-glow" />
      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-lime/30 bg-lime/10">
        <Activity className="text-lime" size={38} strokeWidth={1.5} />
      </div>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 460 250" fill="none">
        <path d="M20 125H116L152 89H188M272 89H320L350 59H438M272 161H335L370 196H438M188 161H135L99 197H20" stroke="#2e4f00" strokeWidth="1.5" />
        <path d="M230 16V64M230 186V236" stroke="#2e4f00" strokeWidth="1.5" />
        {[[20,125],[99,197],[438,59],[438,196],[230,16],[230,236]].map(([cx, cy], index) => (
          <g key={index}>
            <circle cx={cx} cy={cy} r="8" fill="#0b141a" stroke="#426900" />
            <circle cx={cx} cy={cy} r="2.5" fill="#9DFF00" />
          </g>
        ))}
      </svg>
      <span className="absolute left-10 top-16 font-mono text-[10px] tracking-widest text-lime/60">LEARN</span>
      <span className="absolute bottom-12 right-8 font-mono text-[10px] tracking-widest text-lime/60">EXECUTE</span>
    </div>
  );
}

export function LearnHero() {
  return (
    <section className="relative overflow-hidden border-b border-panelBorder bg-[#0b1217]">
      <div className="terminal-grid absolute inset-0 opacity-35" />
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-lime/[0.04] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-10 lg:py-16">
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-lime">
            <span className="h-px w-8 bg-lime" /> Learning command center
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl">
            Build skills that hold up <span className="text-lime">in the real world.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Follow structured learning paths, master focused modules, and apply each technique in guided, hands-on environments.
          </p>
          <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 border-l border-panelBorder py-1 pl-4 first:border-lime">
                <stat.icon className="text-lime" size={19} />
                <div>
                  <p className="text-xl font-semibold text-ink">{stat.value}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <NetworkArtwork />
      </div>
    </section>
  );
}
