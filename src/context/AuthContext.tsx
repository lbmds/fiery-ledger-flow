
import { createContext, useState, useEffect, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { authService, UserCredentials, UserRegistration } from "@/services/authService";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<{ error: any }>;
  register: (data: UserRegistration) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ error: null }),
  register: async () => ({ error: null }),
  logout: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: subscription } = authService.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (event === "SIGNED_IN") {
          navigate("/dashboard");
        } else if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const login = async (credentials: UserCredentials) => {
    const response = await authService.login(credentials);
    return { error: response.error };
  };

  const register = async (data: UserRegistration) => {
    const response = await authService.register(data);
    return { error: response.error };
  };

  const logout = async () => {
    await authService.logout();
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    return authService.updatePassword(password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
