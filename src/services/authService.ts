
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserRegistration = UserCredentials & {
  name: string;
};

export const authService = {
  async register({ email, password, name }: UserRegistration) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: 'Registro realizado com sucesso',
          description: 'Verifique seu e-mail para confirmar sua conta.',
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Erro ao realizar registro',
        description: error?.message || 'Ocorreu um erro ao tentar registrar sua conta.',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  },

  async login({ email, password }: UserCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!',
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error?.message || 'E-mail ou senha incorretos.',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logout realizado',
        description: 'Você saiu do sistema com sucesso.',
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: error?.message || 'Ocorreu um erro ao tentar sair do sistema.',
        variant: 'destructive',
      });
      return { error };
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'E-mail enviado',
        description: 'Verifique seu e-mail para redefinir sua senha.',
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: 'Erro ao redefinir senha',
        description: error?.message || 'Ocorreu um erro ao tentar redefinir sua senha.',
        variant: 'destructive',
      });
      return { error };
    }
  },

  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        title: 'Erro ao atualizar senha',
        description: error?.message || 'Ocorreu um erro ao tentar atualizar sua senha.',
        variant: 'destructive',
      });
      return { error };
    }
  },
  
  async getCurrentUser() {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user || null;
  },
  
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
