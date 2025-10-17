
import { LifeOSView } from "../store/useLifeOSStore";
import clsx from "clsx";
import { BookOpen, LayoutDashboard, MessageCircle, Upload } from "lucide-react";
import type { ElementType } from "react";

const NAV_ITEMS: Array<{
  view: LifeOSView;
  label: string;
  subtitle: string;
  icon: ElementType;
}> = [
  {
    view: "upload",
    label: "Data Studio",
    subtitle: "Import and structure files",
    icon: Upload,
  },
  {
    view: "insights",
    label: "Insight Lab",
    subtitle: "Spot patterns and trends",
    icon: LayoutDashboard,
  },
  {
    view: "chat",
    label: "Ask LifeOS",
    subtitle: "Converse with your data",
    icon: MessageCircle,
  },
  {
    view: "reports",
    label: "Reports",
    subtitle: "Curate shareable briefs",
    icon: BookOpen,
  },
];

type NavBarProps = {
  active: LifeOSView;
  onSelect: (view: LifeOSView) => void;
};

export function NavBar({ active, onSelect }: NavBarProps) {
  return (
    <nav className="flex min-h-full flex-col gap-6 bg-slate-950 px-6 py-8 text-slate-100 shadow-2xl shadow-slate-950/50">
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Offline AI Suite
        </span>
        <div className="text-3xl font-semibold">LifeOS</div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => onSelect(item.view)}
              className={clsx(
                "group flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all",
                active === item.view
                  ? "bg-white/90 text-slate-900 shadow-lg shadow-indigo-500/20"
                  : "text-slate-300 hover:bg-slate-900/70"
              )}
            >
              <div
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-xl border",
                  active === item.view
                    ? "border-indigo-200 bg-gradient-to-br from-indigo-200 via-indigo-100 to-white text-indigo-600"
                    : "border-slate-800 bg-slate-900/70 text-slate-400 group-hover:border-indigo-400/40 group-hover:text-indigo-300"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide">
                  {item.label}
                </span>
                <span className="text-xs text-slate-400">{item.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">Private-by-design</p>
        <p className="mt-1 leading-relaxed">
          All computation, embeddings, and storage run locally. Disconnect and keep working—LifeOS never leaves your device.
        </p>
      </div>
    </nav>
  );
}
