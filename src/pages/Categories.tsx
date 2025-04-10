
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [type, setType] = useState("expense");

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
      setLoading(false);
    };

    loadCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!name || !color) {
      return;
    }

    const newCategory = {
      name,
      color,
      type
    };

    const createdCategory = await categoryService.createCategory(newCategory);
    if (createdCategory) {
      setName("");
      setColor("#3B82F6");
      // Reload categories list
      const updatedCategories = await categoryService.getCategories();
      setCategories(updatedCategories);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-muted-foreground">
          Gerencie as categorias para suas transações nesta página.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Suas Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando categorias...</p>
                ) : categories.length === 0 ? (
                  <p>Você ainda não tem categorias cadastradas.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category.id} 
                        className="p-3 rounded-md border flex items-center space-x-2"
                        style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {category.type === 'income' ? 'Receita' : 'Despesa'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Alimentação"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="color"
                        className="w-10 h-10 rounded-md cursor-pointer"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                      <Input 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Adicionar Categoria
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Categories;
