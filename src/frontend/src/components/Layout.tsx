import { Link, useLocation } from "@tanstack/react-router";
import { Calendar, Compass, Home, User } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  hideTabBar?: boolean;
  headerContent?: ReactNode;
  showHeader?: boolean;
}

const tabs = [
  { to: "/tutors", icon: Home, label: "Home", match: ["/tutors", "/"] },
  {
    to: "/swipe",
    icon: Compass,
    label: "Explore",
    match: ["/swipe", "/mode-select", "/requirements"],
  },
  { to: "/booking", icon: Calendar, label: "Bookings", match: ["/booking"] },
  { to: "/profile", icon: User, label: "Profile", match: ["/profile"] },
] as const;

export function Layout({
  children,
  hideTabBar = false,
  headerContent,
  showHeader = false,
}: LayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const isTabActive = (match: readonly string[]) =>
    match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto relative">
      {showHeader && headerContent && (
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-subtle">
          {headerContent}
        </header>
      )}

      <main
        className={`flex-1 overflow-y-auto ${hideTabBar ? "pb-0" : "pb-20"}`}
      >
        {children}
      </main>

      {!hideTabBar && (
        <nav
          data-ocid="bottom_tab_bar"
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 bg-card border-t border-border flex items-center justify-around z-40"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {tabs.map((tab) => {
            const active = isTabActive(tab.match);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                data-ocid={`nav.${tab.label.toLowerCase()}.tab`}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-smooth"
                aria-label={tab.label}
              >
                <Icon
                  size={22}
                  className={`transition-smooth ${active ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] font-semibold tracking-wide transition-smooth ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
