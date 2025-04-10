
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accountService } from "@/services/accountService";
import { useAuth } from "@/context/AuthContext";

const Accounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("Corrente");

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      const accountsData = await accountService.getAccounts();
      setAccounts(accountsData);
      setLoading(false);
    };

    loadAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (!name || !balance || !type) {
      return;
    }

    const newAccount = {
      name,
      balance: parseFloat(balance),
      type
    };

    const createdAccount = await accountService.createAccount(newAccount);
    if (createdAccount) {
      setName("");
      setBalance("");
      setType("Corrente");
      // Reload accounts list
      const updatedAccounts = await accountService.getAccounts();
      setAccounts(updatedAccounts);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Contas</h1>
        <p className="text-muted-foreground">
          Gerencie suas contas bancárias, carteiras e cartões nesta página.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Suas Contas</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando contas...</p>
                ) : accounts.length === 0 ? (
                  <p>Você ainda não tem contas cadastradas.</p>
                ) : (
                  <div className="space-y-4">
                    {accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">{account.type}</p>
                        </div>
                        <span className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.balance)}
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
                <CardTitle>Adicionar Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Conta</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Conta Corrente"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="balance">Saldo Inicial</Label>
                    <Input 
                      id="balance"
                      type="number"
                      step="0.01"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Conta</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Corrente">Conta Corrente</option>
                      <option value="Poupança">Poupança</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Crédito">Cartão de Crédito</option>
                      <option value="Investimento">Investimento</option>
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Adicionar Conta
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

export default Accounts;
