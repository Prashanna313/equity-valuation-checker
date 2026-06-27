"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const tabs = [
  { label: "Valuation Checker", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname.startsWith("/stock");
    return pathname === href;
  };

  return (
    <header className="border-b border-white/8 px-4">
      <div className="max-w-3xl mx-auto flex items-end gap-1">
        {tabs.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
              isActive(href)
                ? "border-parchment text-parchment"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </header>
  );
}
