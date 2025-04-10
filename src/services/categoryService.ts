import { supabase, Category } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      // Verificar se há um usuário autenticado
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar suas categorias. Por favor, tente novamente.",
        variant: "destructive"
      });
      return [];
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'user_id' | 'created_at'>): Promise<Category | null> {
    try {
      // Obter o ID do usuário atual
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...category,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Categoria criada",
        description: "Sua nova categoria foi criada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Categoria atualizada",
        description: "Sua categoria foi atualizada com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Erro ao atualizar categoria",
        description: "Não foi possível atualizar a categoria. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Categoria excluída",
        description: "Sua categoria foi excluída com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Não foi possível excluir a categoria. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  }
};
