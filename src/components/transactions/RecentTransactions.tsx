
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: "income" | "expense";
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  status: "completed" | "pending";
};

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              Não há transações recentes.
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                      transaction.type === "income"
                        ? "bg-emerald-100 dark:bg-emerald-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpIcon
                        className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <ArrowDownIcon
                        className="h-4 w-4 text-red-600 dark:text-red-400"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {transaction.description}
                      </span>
                      {transaction.status === "pending" && (
                        <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded-sm">
                          Pendente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      <span className="px-1">•</span>
                      <span>{transaction.categoryName}</span>
                      <span className="px-1">•</span>
                      <span>{transaction.accountName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>

                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
