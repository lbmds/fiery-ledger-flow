
import { AppLayout } from "@/components/layout/AppLayout";

const Transactions = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">
          Gerencie suas receitas e despesas nesta página.
        </p>
      </div>
    </AppLayout>
  );
};

export default Transactions;
