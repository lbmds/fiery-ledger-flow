
import { AppLayout } from "@/components/layout/AppLayout";

const Categories = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-muted-foreground">
          Gerencie as categorias para suas transações nesta página.
        </p>
      </div>
    </AppLayout>
  );
};

export default Categories;
