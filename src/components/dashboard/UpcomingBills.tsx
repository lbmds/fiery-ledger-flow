
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

export type Bill = {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid';
  recurrent: boolean;
};

interface UpcomingBillsProps {
  bills: Bill[];
}

export function UpcomingBills({ bills }: UpcomingBillsProps) {
  const [localBills, setLocalBills] = useState<Bill[]>(bills);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getDaysRemaining = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const markAsPaid = (id: string) => {
    setLocalBills(prev => 
      prev.map(bill => 
        bill.id === id ? { ...bill, status: 'paid' } : bill
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <CalendarIcon className="h-5 w-5 text-coral" />
          Próximas Contas a Pagar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localBills.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">
              Não há contas a pagar próximas.
            </p>
          )}
          
          {localBills.map((bill) => {
            const daysRemaining = getDaysRemaining(bill.dueDate);
            const isOverdue = daysRemaining < 0;
            const isDueToday = daysRemaining === 0;
            
            return (
              <div key={bill.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{bill.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(bill.dueDate)}
                    </span>
                    {bill.recurrent && (
                      <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full">
                        Recorrente
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="font-medium">
                      {formatCurrency(bill.amount)}
                    </span>
                    <span className={`text-xs ${
                      isOverdue 
                        ? 'text-red-500 dark:text-red-400'
                        : isDueToday
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-muted-foreground'
                    }`}>
                      {isOverdue
                        ? `${Math.abs(daysRemaining)} dias atrás`
                        : isDueToday
                          ? 'Hoje'
                          : `Em ${daysRemaining} dias`
                      }
                    </span>
                  </div>
                  
                  {bill.status === 'pending' ? (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => markAsPaid(bill.id)} 
                      className="h-8 w-8"
                    >
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
