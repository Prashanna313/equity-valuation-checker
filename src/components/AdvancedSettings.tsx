"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ValuationSettings, DEFAULT_SETTINGS } from "@/lib/types";

interface AdvancedSettingsProps {
  ticker: string;
  current: ValuationSettings;
}

export function AdvancedSettings({ ticker, current }: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(current);
  const router = useRouter();

  const apply = () => {
    const params = new URLSearchParams({
      discountRate: settings.discountRate.toString(),
      multiple: settings.exitMultiple.toString(),
      horizon: settings.horizon.toString(),
    });
    router.push(`/stock/${ticker}?${params}`);
    setOpen(false);
  };

  const reset = () => setSettings(DEFAULT_SETTINGS);

  return (
    <section className="mb-10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-parchment transition-colors uppercase tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400 rounded"
        aria-expanded={open}
      >
        <span className="text-slate-600">{open ? "▲" : "▼"}</span>
        Advanced Settings
      </button>

      {open && (
        <div className="mt-4 p-5 border border-white/10 rounded bg-surface">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <SliderField
              label="Discount Rate"
              value={settings.discountRate}
              min={0.05}
              max={0.20}
              step={0.01}
              format={(v) => `${(v * 100).toFixed(0)}%`}
              onChange={(v) => setSettings((s) => ({ ...s, discountRate: v }))}
            />
            <SliderField
              label="Exit Multiple"
              value={settings.exitMultiple}
              min={2}
              max={15}
              step={1}
              format={(v) => `${v}×`}
              onChange={(v) => setSettings((s) => ({ ...s, exitMultiple: v }))}
            />
            <SliderField
              label="Time Horizon"
              value={settings.horizon}
              min={5}
              max={15}
              step={1}
              format={(v) => `${v} yr`}
              onChange={(v) => setSettings((s) => ({ ...s, horizon: v }))}
            />
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={apply}
              className="px-4 py-2 bg-parchment text-ink text-xs font-mono font-bold rounded hover:bg-parchment/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment"
            >
              Apply
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 text-slate-400 text-xs font-mono hover:text-parchment transition-colors"
            >
              Reset defaults
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, format, onChange }: SliderFieldProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">{label}</label>
        <span className="text-sm font-mono font-semibold text-parchment tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-parchment cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}
