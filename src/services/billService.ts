
import { supabase, Bill } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const billService = {
  async getBills(): Promise<Bill[]> {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast({
        title: "Erro ao carregar contas a pagar",
        description: "Não foi possível carregar suas contas a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
      return [];
    }
  },

  async createBill(bill: Omit<Bill, 'id' | 'user_id' | 'created_at'>): Promise<Bill | null> {
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([bill])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Conta a pagar registrada",
        description: "Sua conta a pagar foi registrada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error creating bill:', error);
      toast({
        title: "Erro ao registrar conta a pagar",
        description: "Não foi possível registrar a conta a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill | null> {
    try {
      const { data, error } = await supabase
        .from('bills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Conta a pagar atualizada",
        description: "Sua conta a pagar foi atualizada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error updating bill:', error);
      toast({
        title: "Erro ao atualizar conta a pagar",
        description: "Não foi possível atualizar a conta a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async deleteBill(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Conta a pagar excluída",
        description: "Sua conta a pagar foi excluída com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast({
        title: "Erro ao excluir conta a pagar",
        description: "Não foi possível excluir a conta a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  }
};
