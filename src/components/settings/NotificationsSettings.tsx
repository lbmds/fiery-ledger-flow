
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export function NotificationsSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    billReminders: true,
    monthlyReports: true,
    budgetAlerts: true,
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Configurações salvas',
        description: 'Suas preferências de notificação foram atualizadas.',
      });
    }, 800);
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
