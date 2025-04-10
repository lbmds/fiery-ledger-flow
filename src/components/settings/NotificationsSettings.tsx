
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type NotificationSettings = {
  billReminders: boolean;
  monthlyReports: boolean;
  budgetAlerts: boolean;
};

export function NotificationsSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    billReminders: true,
    monthlyReports: true,
    budgetAlerts: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_settings')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.notification_settings) {
          setSettings(data.notification_settings as NotificationSettings);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          notification_settings: settings 
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Configurações salvas',
        description: 'Suas preferências de notificação foram atualizadas.',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar suas preferências.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
        <CardDescription>
          Gerencie suas preferências de notificação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Lembretes de contas</h4>
            <p className="text-sm text-muted-foreground">
              Receba lembretes quando tiver contas próximas do vencimento
            </p>
          </div>
          <Switch
            checked={settings.billReminders}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, billReminders: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Relatórios mensais</h4>
            <p className="text-sm text-muted-foreground">
              Receba relatórios mensais com o resumo de suas finanças
            </p>
          </div>
          <Switch 
            checked={settings.monthlyReports}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, monthlyReports: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Alertas de orçamento</h4>
            <p className="text-sm text-muted-foreground">
              Seja notificado quando estiver próximo de atingir limites de orçamento
            </p>
          </div>
          <Switch 
            checked={settings.budgetAlerts}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, budgetAlerts: checked }))
            }
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar preferências'}
        </Button>
      </CardFooter>
    </Card>
  );
}
