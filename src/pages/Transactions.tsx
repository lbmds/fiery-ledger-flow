
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionService } from "@/services/transactionService";
import { categoryService } from "@/services/categoryService";
import { accountService } from "@/services/accountService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [status, setStatus] = useState("completed");
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const [transactionsData, categoriesData, accountsData] = await Promise.all([
        transactionService.getTransactions(),
        categoryService.getCategories(),
        accountService.getAccounts()
      ]);
      
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setAccounts(accountsData);
      
      // Set default category and account if available
      if (categoriesData.length > 0) {
        setCategoryId(categoriesData[0].id);
      }
      
      if (accountsData.length > 0) {
        setAccountId(accountsData[0].id);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);
  
  const filteredCategories = categories.filter(category => category.type === type);
  
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    
    if (!amount || !description || !date || !categoryId || !accountId) {
      return;
    }

    const newTransaction = {
      amount: parseFloat(amount),
      description,
      date,
      type,
      category_id: categoryId,
      account_id: accountId,
      status
    };

    const createdTransaction = await transactionService.createTransaction(newTransaction);
    if (createdTransaction) {
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split('T')[0]);
      
      // Reload transactions list
      const updatedTransactions = await transactionService.getTransactions();
      setTransactions(updatedTransactions);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">
          Gerencie suas receitas e despesas nesta página.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Suas Transações</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando transações...</p>
                ) : transactions.length === 0 ? (
                  <p>Você ainda não tem transações cadastradas.</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center space-x-4">
                          <div className={`w-2 h-10 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <h3 className="font-medium">{transaction.description}</h3>
                            <div className="flex text-sm space-x-2 text-muted-foreground">
                              <span>{formatDate(transaction.date)}</span>
                              <span>•</span>
                              <span>{transaction.categoryName || 'Sem categoria'}</span>
                              <span>•</span>
                              <span>{transaction.accountName || 'Sem conta'}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} 
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Transação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTransaction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                        // Reset category when type changes
                        if (filteredCategories.length > 0) {
                          setCategoryId(filteredCategories[0].id);
                        } else {
                          setCategoryId("");
                        }
                      }}
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Supermercado"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input 
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input 
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {filteredCategories.length === 0 ? (
                        <option value="">Cadastre categorias primeiro</option>
                      ) : (
                        filteredCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account">Conta</Label>
                    <select
                      id="account"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                    >
                      {accounts.length === 0 ? (
                        <option value="">Cadastre contas primeiro</option>
                      ) : (
                        accounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={accounts.length === 0 || filteredCategories.length === 0}
                  >
                    Adicionar Transação
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Transactions;
