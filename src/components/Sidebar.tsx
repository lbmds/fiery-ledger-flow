import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  CircleDollarSign, 
  Wallet, 
  CalendarClock, 
  BarChart4, 
  Settings, 
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, title, isActive }) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 px-4",
          isActive && "bg-burgundy dark:bg-burgundy hover:bg-burgundy/90 dark:hover:bg-burgundy/90"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const navItems = [
    { href: "/", icon: LayoutDashboard, title: "Dashboard" },
    { href: "/transactions", icon: ArrowRightLeft, title: "Transações" },
    { href: "/categories", icon: CircleDollarSign, title: "Categorias" },
    { href: "/accounts", icon: Wallet, title: "Contas" },
    { href: "/bills", icon: CalendarClock, title: "Contas a Pagar" },
    { href: "/reports", icon: BarChart4, title: "Relatórios" },
    { href: "/settings", icon: Settings, title: "Configurações" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  if (isMobile && !isOpen) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-border z-40 flex flex-col",
        isMobile && "shadow-lg",
        isMobile && isOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "",
        "transition-transform duration-200 ease-in-out"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-burgundy w-8 h-8 rounded-md flex items-center justify-center">
            <CircleDollarSign className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg text-burgundy dark:text-coral-light">FinControl</h1>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isActive={location.pathname === item.href}
          />
        ))}
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-4 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 mt-4"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </nav>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          FinControl v1.0.0
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
