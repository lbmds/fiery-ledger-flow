
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

interface QuickStatsProps {
  currentMonthIncome: number;
  currentMonthExpenses: number;
  totalBalance: number;
  previousMonthIncome?: number;
  previousMonthExpenses?: number;
}

export function QuickStats({ 
  currentMonthIncome, 
  currentMonthExpenses, 
  totalBalance,
  previousMonthIncome,
  previousMonthExpenses 
}: QuickStatsProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  const calculatePercentageChange = (current: number, previous?: number) => {
    if (!previous) return null;
    return previous === 0 ? 100 : ((current - previous) / previous) * 100;
  };
  
  const incomeChange = calculatePercentageChange(currentMonthIncome, previousMonthIncome);
  const expensesChange = calculatePercentageChange(currentMonthExpenses, previousMonthExpenses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Receitas do Mês</p>
            <h3 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(currentMonthIncome)}
            </h3>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-lg">
            <ArrowUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        
        {incomeChange !== null && (
          <div className="mt-2 flex items-center text-xs">
            <span className={incomeChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
              {incomeChange >= 0 ? "+" : ""}{incomeChange.toFixed(1)}%
            </span>
            <span className="ml-1 text-muted-foreground">em relação ao mês anterior</span>
          </div>
        )}
      </div>
      
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Despesas do Mês</p>
            <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
              {formatCurrency(currentMonthExpenses)}
            </h3>
          </div>
          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
            <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        {expensesChange !== null && (
          <div className="mt-2 flex items-center text-xs">
            <span className={expensesChange <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
              {expensesChange >= 0 ? "+" : ""}{expensesChange.toFixed(1)}%
            </span>
            <span className="ml-1 text-muted-foreground">em relação ao mês anterior</span>
          </div>
        )}
      </div>
      
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Saldo Total</p>
            <h3 className={`text-2xl font-semibold mt-1 ${
              totalBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}>
              {formatCurrency(totalBalance)}
            </h3>
          </div>
          <div className="bg-coral-light/20 p-2 rounded-lg">
            <Wallet className="h-5 w-5 text-coral" />
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          Soma de todas as suas contas
        </div>
      </div>
    </div>
  );
}
