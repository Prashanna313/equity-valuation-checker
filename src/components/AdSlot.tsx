"use client";

interface AdSlotProps {
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "leaderboard";
}

// Reserved ad slot — wire ADSENSE_PUBLISHER_ID env var post-launch
export function AdSlot({ slot, className = "", format = "auto" }: AdSlotProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  if (!publisherId) return null;

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ minHeight: format === "leaderboard" ? 90 : 250 }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
