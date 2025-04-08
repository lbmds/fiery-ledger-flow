
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { 
  TrendingDown, 
  TrendingUp, 
  ArrowRight, 
  Banknote, 
  CircleDollarSign 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface FinancialHealthProps {
  income: number;
  expenses: number;
  savings: number;
  debtPercentage: number;
}

export function FinancialHealth({ income, expenses, savings, debtPercentage }: FinancialHealthProps) {
  const savingsPercentage = income > 0 ? (savings / income) * 100 : 0;
  const expensesPercentage = income > 0 ? (expenses / income) * 100 : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  const getHealthStatus = () => {
    if (savingsPercentage >= 20 && debtPercentage <= 30) {
      return {
        label: "Excelente",
        color: "bg-emerald-500",
        description: "Suas finanças estão em ótima forma!"
      };
    } else if (savingsPercentage >= 10 && debtPercentage <= 40) {
      return {
        label: "Bom",
        color: "bg-green-500",
        description: "Você está no caminho certo."
      };
    } else if (savingsPercentage >= 5 && debtPercentage <= 50) {
      return {
        label: "Regular",
        color: "bg-amber-500",
        description: "Há espaço para melhoria."
      };
    } else {
      return {
        label: "Atenção",
        color: "bg-red-500",
        description: "Suas finanças precisam de ajustes."
      };
    }
  };
  
  const health = getHealthStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Saúde Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${health.color}`} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm font-medium">
                    {health.label}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{health.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>Receitas</span>
              </div>
              <span className="font-medium">{formatCurrency(income)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span>Despesas</span>
              </div>
              <span className="font-medium">{formatCurrency(expenses)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <ArrowRight className="h-4 w-4" />
                <span>Saldo</span>
              </div>
              <span className={`font-medium ${
                savings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(savings)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Banknote className="h-4 w-4" />
                  <span>Economia</span>
                </div>
                <span className="text-xs">{savingsPercentage.toFixed(0)}% da renda</span>
              </div>
              <Progress value={savingsPercentage} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <CircleDollarSign className="h-4 w-4" />
                  <span>Dívidas</span>
                </div>
                <span className="text-xs">{debtPercentage.toFixed(0)}% da renda</span>
              </div>
              <Progress value={debtPercentage} className="h-2 bg-secondary" indicatorClassName="bg-burgundy" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
