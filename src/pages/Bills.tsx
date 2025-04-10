import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { billService } from "@/services/billService";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState("pending");
  const [recurrent, setRecurrent] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  useEffect(() => {
    const loadBills = async () => {
      setLoading(true);
      const billsData = await billService.getBills();
      setBills(billsData);
      setLoading(false);
    };

    loadBills();
  }, []);

  const handleCreateBill = async (e) => {
    e.preventDefault();
    
    if (!description || !amount || !dueDate) {
      return;
    }

    // Criar objeto com campos básicos
    const billData: any = {
      description,
      amount: parseFloat(amount),
      due_date: dueDate,
      status: status as 'pending' | 'paid',
      recurrent
    };
    
    // Adicionar frequency apenas se for recorrente
    if (recurrent) {
      billData.frequency = frequency;
    }

    const createdBill = await billService.createBill(billData);
    if (createdBill) {
      setDescription("");
      setAmount("");
      setDueDate(new Date().toISOString().split('T')[0]);
      setStatus("pending");
      setRecurrent(false);
      setFrequency('monthly');
      
      // Reload bills list
      const updatedBills = await billService.getBills();
      setBills(updatedBills);
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
        <h1 className="text-2xl font-bold">Contas a Pagar</h1>
        <p className="text-muted-foreground">
          Gerencie suas contas a pagar e recorrentes nesta página.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Suas Contas a Pagar</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando contas...</p>
                ) : bills.length === 0 ? (
                  <p>Você ainda não tem contas a pagar cadastradas.</p>
                ) : (
                  <div className="space-y-4">
                    {bills.map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h3 className="font-medium">{bill.description}</h3>
                          <div className="text-sm text-muted-foreground">
                            <span>Vencimento: {formatDate(bill.due_date)}</span>
                            {bill.recurrent && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-0.5 px-1.5 rounded-full">
                                {bill.frequency === 'monthly' && 'Mensal'}
                                {bill.frequency === 'weekly' && 'Semanal'}
                                {bill.frequency === 'yearly' && 'Anual'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">
                            {formatCurrency(bill.amount)}
                          </span>
                          <div>
                            <span className={`text-xs py-0.5 px-1.5 rounded-full ${
                              bill.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {bill.status === 'paid' ? 'Pago' : 'Pendente'}
                            </span>
                          </div>
                        </div>
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
                <CardTitle>Adicionar Conta a Pagar</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBill} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Aluguel"
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
                    <Label htmlFor="dueDate">Data de Vencimento</Label>
                    <Input 
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurrent"
                      checked={recurrent}
                      onCheckedChange={setRecurrent}
                    />
                    <Label htmlFor="recurrent">Conta Recorrente</Label>
                  </div>
                  
                  {recurrent && (
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequência</Label>
                      <select
                        id="frequency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as 'monthly' | 'weekly' | 'yearly')}
                      >
                        <option value="monthly">Mensal</option>
                        <option value="weekly">Semanal</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full">
                    Adicionar Conta a Pagar
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

export default Bills;
