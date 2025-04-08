
import { supabase, Transaction } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, categories(name), accounts(name)')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our frontend model
      const transformedData = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        date: item.date,
        description: item.description,
        type: item.type,
        category_id: item.category_id,
        categoryName: item.categories?.name,
        account_id: item.account_id,
        accountName: item.accounts?.name,
        status: item.status,
        created_at: item.created_at
      }));
      
      return transformedData || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar suas transações. Por favor, tente novamente.",
        variant: "destructive"
      });
      return [];
    }
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Transação registrada",
        description: "Sua transação foi registrada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Erro ao registrar transação",
        description: "Não foi possível registrar a transação. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Transação atualizada",
        description: "Sua transação foi atualizada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erro ao atualizar transação",
        description: "Não foi possível atualizar a transação. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Transação excluída",
        description: "Sua transação foi excluída com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Erro ao excluir transação",
        description: "Não foi possível excluir a transação. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  },

  async getMonthlyStats(year: number, month: number): Promise<{ income: number, expenses: number }> {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      
      const income = data.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
      const expenses = data.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
      
      return { income, expenses };
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return { income: 0, expenses: 0 };
    }
  }
};
