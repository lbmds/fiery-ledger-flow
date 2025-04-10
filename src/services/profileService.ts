
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type ProfileData = {
  name?: string;
  avatar_url?: string;
};

export const profileService = {
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }
  },

  async updateProfile(userId: string, profileData: ProfileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error?.message || 'Ocorreu um erro ao atualizar seu perfil.',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  },

  async uploadAvatar(userId: string, file: File) {
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // Update user profile with avatar URL
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({
        title: 'Avatar atualizado',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Erro ao fazer upload do avatar',
        description: error?.message || 'Ocorreu um erro ao atualizar sua foto de perfil.',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  }
};
