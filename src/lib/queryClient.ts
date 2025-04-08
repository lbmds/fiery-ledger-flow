
import { QueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: Error) => {
          toast({
            title: 'Erro',
            description: `${error.message || 'Ocorreu um erro ao carregar os dados.'}`,
            variant: 'destructive',
          });
        },
      },
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          toast({
            title: 'Erro',
            description: `${error.message || 'Ocorreu um erro ao processar a solicitação.'}`,
            variant: 'destructive',
          });
        },
      },
    },
  },
});
