"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Map, Route } from "lucide-react";
import type { Route as NextRoute } from "next";
import { LearnHero } from "@/components/learn/LearnHero";

const learnNav = [
  { label: "Roadmap", href: "/learn/roadmap" as NextRoute, icon: Map },
  { label: "Paths", href: "/learn/paths" as NextRoute, icon: Route },
  { label: "Modules", href: "/learn/modules" as NextRoute, icon: BookOpen },
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLearnIndex = ["/learn", "/learn/roadmap"].includes(pathname);

  return (
    <div className="w-full flex-1 flex flex-col">
      {isLearnIndex && <LearnHero />}
      <div className="sticky top-[72px] z-40 border-b border-divider bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center overflow-x-auto px-5 md:px-8">
          <div className="flex min-w-max gap-7 sm:gap-9">
            {learnNav.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-lime text-lime"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 py-12 md:px-8 lg:py-16">
        {children}
      </div>
    </div>
  );
}
