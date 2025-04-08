
import { AccountBalance, Account } from "@/components/dashboard/AccountBalance";
import { ExpensesByCategory, ExpenseCategory } from "@/components/dashboard/ExpensesByCategory";
import { FinancialHealth } from "@/components/dashboard/FinancialHealth";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { UpcomingBills, Bill } from "@/components/dashboard/UpcomingBills";
import { RecentTransactions, Transaction } from "@/components/transactions/RecentTransactions";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";

const Dashboard = () => {
  // Sample data for the dashboard
  const [accounts] = useState<Account[]>([
    {
      id: "1",
      name: "Conta Corrente",
      balance: 5240.75,
      type: "Corrente"
    },
    {
      id: "2",
      name: "Poupança",
      balance: 12500.00,
      type: "Poupança"
    },
    {
      id: "3",
      name: "Carteira",
      balance: 345.50,
      type: "Dinheiro"
    },
    {
      id: "4",
      name: "Cartão de Crédito",
      balance: -1890.25,
      type: "Crédito"
    }
  ]);

  const [categories] = useState<ExpenseCategory[]>([
    {
      id: "1",
      name: "Moradia",
      amount: 1500,
      color: "#e63118",
      percentage: 30
    },
    {
      id: "2",
      name: "Alimentação",
      amount: 1200,
      color: "#ff9f1c",
      percentage: 24
    },
    {
      id: "3",
      name: "Transporte",
      amount: 800,
      color: "#2ec4b6",
      percentage: 16
    },
    {
      id: "4",
      name: "Lazer",
      amount: 600,
      color: "#9b5de5",
      percentage: 12
    },
    {
      id: "5",
      name: "Saúde",
      amount: 500,
      color: "#f15bb5",
      percentage: 10
    },
    {
      id: "6",
      name: "Outros",
      amount: 400,
      color: "#380a06",
      percentage: 8
    }
  ]);

  const [bills] = useState<Bill[]>([
    {
      id: "1",
      description: "Aluguel",
      amount: 1200,
      dueDate: new Date(2025, 3, 10),
      status: "pending",
      recurrent: true
    },
    {
      id: "2",
      description: "Conta de Luz",
      amount: 150,
      dueDate: new Date(2025, 3, 15),
      status: "pending",
      recurrent: true
    },
    {
      id: "3",
      description: "Internet",
      amount: 120,
      dueDate: new Date(2025, 3, 20),
      status: "pending",
      recurrent: true
    },
    {
      id: "4",
      description: "Seguro do Carro",
      amount: 350,
      dueDate: new Date(2025, 3, 5),
      status: "paid",
      recurrent: true
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 3500,
      date: new Date(2025, 3, 5),
      description: "Salário",
      type: "income",
      categoryId: "1",
      categoryName: "Salário",
      accountId: "1",
      accountName: "Conta Corrente",
      status: "completed"
    },
    {
      id: "2",
      amount: 1200,
      date: new Date(2025, 3, 6),
      description: "Aluguel",
      type: "expense",
      categoryId: "2",
      categoryName: "Moradia",
      accountId: "1",
      accountName: "Conta Corrente",
      status: "completed"
    },
    {
      id: "3",
      amount: 150,
      date: new Date(2025, 3, 7),
      description: "Mercado",
      type: "expense",
      categoryId: "3",
      categoryName: "Alimentação",
      accountId: "1",
      accountName: "Conta Corrente",
      status: "completed"
    },
    {
      id: "4",
      amount: 200,
      date: new Date(2025, 3, 8),
      description: "Transferência para poupança",
      type: "expense",
      categoryId: "4",
      categoryName: "Economia",
      accountId: "1",
      accountName: "Conta Corrente",
      status: "completed"
    },
    {
      id: "5",
      amount: 200,
      date: new Date(2025, 3, 8),
      description: "Transferência da conta corrente",
      type: "income",
      categoryId: "4",
      categoryName: "Transferência",
      accountId: "2",
      accountName: "Poupança",
      status: "completed"
    }
  ]);

  // Calculate financial health data
  const currentMonthIncome = 4500;
  const currentMonthExpenses = 3200;
  const savings = currentMonthIncome - currentMonthExpenses;
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
  const debtPercentage = 35; // Example: debt payment as percentage of income

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <QuickStats 
          currentMonthIncome={currentMonthIncome}
          currentMonthExpenses={currentMonthExpenses}
          totalBalance={totalBalance}
          previousMonthIncome={4300}
          previousMonthExpenses={3400}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ExpensesByCategory categories={categories} />
            <RecentTransactions transactions={transactions} />
          </div>
          
          <div className="space-y-6">
            <AccountBalance accounts={accounts} />
            <UpcomingBills bills={bills} />
            <FinancialHealth 
              income={currentMonthIncome} 
              expenses={currentMonthExpenses} 
              savings={savings}
              debtPercentage={debtPercentage}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
