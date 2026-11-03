/**
 * Neutral, light-theme project preview art. When no real screenshot is
 * configured, the slot shows an intentional placeholder: a white surface with
 * faint technical grid lines, an oversized outlined initial and a small
 * "PROJECT PREVIEW" tag.
 */
export function ProjectArt({ project, className = '' }: { project: { id: string; title: string; palette?: unknown }; className?: string }) {
  const initial = project.title.trim().charAt(0).toUpperCase();
  return (
    <div className={`absolute inset-0 overflow-hidden bg-white ${className}`} aria-hidden>
      {/* faint crop lines for a technical feel */}
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] [background-size:44px_44px] opacity-60" />
      <span
        className="text-outline absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display leading-none tracking-tight"
        style={{ fontSize: 'min(42vh, 24vw)', WebkitTextStroke: '2px rgba(0, 0, 0, 0.12)' }}
      >
        {initial}
      </span>
      <span className="absolute bottom-3 left-3 rounded-md bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.3em] text-mute ring-1 ring-line">
        PROJECT PREVIEW
      </span>
      {/* small green accent tick — decorative detail */}
      <span className="absolute right-3 top-3 h-1.5 w-6 bg-green" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
    </div>
  );
}
