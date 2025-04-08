
import { AppLayout } from "@/components/layout/AppLayout";

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure suas preferências do sistema nesta página.
        </p>
      </div>
    </AppLayout>
  );
};

export default Settings;
