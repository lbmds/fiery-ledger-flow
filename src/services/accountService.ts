
import { supabase, Account } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Erro ao carregar contas",
        description: "Não foi possível carregar suas contas. Por favor, tente novamente.",
        variant: "destructive"
      });
      return [];
    }
  },

  async createAccount(account: Omit<Account, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Account | null> {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([account])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Conta criada",
        description: "Sua nova conta foi criada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Não foi possível criar a conta. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account | null> {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Conta atualizada",
        description: "Sua conta foi atualizada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Erro ao atualizar conta",
        description: "Não foi possível atualizar a conta. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async deleteAccount(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erro ao excluir conta",
        description: "Não foi possível excluir a conta. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  }
};
