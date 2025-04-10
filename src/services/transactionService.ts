import { supabase, Transaction } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      // Verificar se há um usuário autenticado
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Carregar nomes das categorias e contas
      const transactionsWithDetails = [] as Transaction[];
      
      for (const tx of data) {
        let categoryName = null;
        let accountName = null;

        // Carregar nome da categoria
        if (tx.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('name')
            .eq('id', tx.category_id)
            .single();
          categoryName = categoryData?.name || null;
        }

        // Carregar nome da conta
        if (tx.account_id) {
          const { data: accountData } = await supabase
            .from('accounts')
            .select('name')
            .eq('id', tx.account_id)
            .single();
          accountName = accountData?.name || null;
        }

        transactionsWithDetails.push({
          ...tx,
          categoryName,
          accountName
        });
      }
      
      return transactionsWithDetails;
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
      // Obter o ID do usuário atual
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          user_id: userId
        }])
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

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | null> {
    try {
      // Removendo o id dos updates, pois ele não deve ser alterado
      const { id: _, ...updatesWithoutId } = updates;
      
      const { data, error } = await supabase
        .from('transactions')
        .update(updatesWithoutId)
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

  async deleteTransaction(id: number): Promise<boolean> {
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
