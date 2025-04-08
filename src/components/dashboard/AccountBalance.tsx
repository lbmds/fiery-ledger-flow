
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export type Account = {
  id: string;
  name: string;
  balance: number;
  type: string;
};

interface AccountBalanceProps {
  accounts: Account[];
}

export function AccountBalance({ accounts }: AccountBalanceProps) {
  const [hideBalances, setHideBalances] = useState(false);

  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Saldos das Contas</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setHideBalances(!hideBalances)}
          className="h-8 w-8"
        >
          {hideBalances ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  account.balance >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">{account.name}</span>
                <span className="text-xs text-muted-foreground">{account.type}</span>
              </div>
              <span className={`font-medium text-sm ${
                account.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {hideBalances ? '••••••' : formatCurrency(account.balance)}
              </span>
            </div>
          ))}
          
          <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className={`font-semibold ${
              totalBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {hideBalances ? '••••••' : formatCurrency(totalBalance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
