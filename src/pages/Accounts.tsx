
import { AppLayout } from "@/components/layout/AppLayout";

const Accounts = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Contas</h1>
        <p className="text-muted-foreground">
          Gerencie suas contas bancárias, carteiras e cartões nesta página.
        </p>
      </div>
    </AppLayout>
  );
};

export default Accounts;
