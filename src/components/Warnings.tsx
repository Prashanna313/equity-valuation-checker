interface WarningsProps {
  warnings: string[];
  dataWarnings?: string[];
}

export function Warnings({ warnings, dataWarnings = [] }: WarningsProps) {
  if (warnings.length === 0 && dataWarnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-6">
      {dataWarnings.map((w, i) => (
        <div
          key={`data-${i}`}
          className="flex gap-3 items-start px-4 py-3 rounded border border-red-700/40 bg-red-950/20 text-red-300 text-sm font-mono"
        >
          <span className="shrink-0 mt-0.5">⚠</span>
          <span className="leading-relaxed">{w}</span>
        </div>
      ))}
      {warnings.map((w, i) => (
        <div
          key={`warn-${i}`}
          className="flex gap-3 items-start px-4 py-3 rounded border border-amber-700/40 bg-amber-950/30 text-amber-300 text-sm font-mono"
        >
          <span className="shrink-0 mt-0.5">⚠</span>
          <span className="leading-relaxed">{w}</span>
        </div>
      ))}
    </div>
  );
}
