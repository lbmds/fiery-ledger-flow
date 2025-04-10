import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, user, isLoading]);
  
  return null;
};

export default Index;
