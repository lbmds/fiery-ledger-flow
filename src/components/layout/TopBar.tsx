
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { Plus, BellIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface TopBarProps {
  onCreateTransaction?: () => void;
}

export function TopBar({ onCreateTransaction }: TopBarProps) {
  const isMobile = useIsMobile();
  const [notificationCount] = useState(3);

  if (isMobile) {
    return null;
  }

  return (
    <div className="h-16 flex items-center justify-end gap-2 px-6 border-b border-border">
      <Button 
        onClick={onCreateTransaction}
        className="bg-coral hover:bg-coral-dark text-white gap-2"
      >
        <Plus className="h-4 w-4" />
        Nova Transação
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-coral text-white border-2 border-background"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Fatura próxima do vencimento</span>
                <span className="text-xs text-muted-foreground">Cartão de crédito Nubank, vence em 3 dias</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Limite orçamentário atingido</span>
                <span className="text-xs text-muted-foreground">Categoria Alimentação excedeu em 15%</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Metas de economia</span>
                <span className="text-xs text-muted-foreground">Você está próximo de atingir sua meta mensal</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeToggle />
    </div>
  );
}
