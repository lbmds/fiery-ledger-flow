
import { AppLayout } from "@/components/layout/AppLayout";

const Bills = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Contas a Pagar</h1>
        <p className="text-muted-foreground">
          Gerencie suas contas a pagar e recorrentes nesta página.
        </p>
      </div>
    </AppLayout>
  );
};

export default Bills;
