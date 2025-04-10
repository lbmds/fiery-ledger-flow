import { supabase, Account } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    try {
      // Verificar se há um usuário autenticado
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      const userId = session.session.user.id;
      console.log("User ID:", userId);

      // Verificar se a tabela existe
      const { error: tableError } = await supabase
        .from('accounts')
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.error("Erro ao verificar tabela accounts:", tableError);
        throw tableError;
      }

      // Buscar as contas do usuário
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar contas:", error);
        throw error;
      }
      
      console.log("Contas recuperadas:", data);
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
      // Verificar se há um usuário autenticado
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('accounts')
        .insert([{
          ...account,
          user_id: userId
        }])
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
