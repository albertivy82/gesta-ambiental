import { useState } from "react";
import { connectionAPIDelete } from "../../../shared/functions/connection/connectionAPI";

const useDeleteLocalidade = (id: number) => {
    const [isLoading, setIsLoading] = useState(false);
  
    const deleteLocalidade = async () => {
      setIsLoading(true);
      try {
        await connectionAPIDelete(`http://192.168.100.28:8080/localidade/${id}`);
        // adicione lógica após a exclusão bem-sucedida aqui
      } catch (error) {
        console.error("Erro ao excluir localidade:", error);
      }
      setIsLoading(false);
    };
  
    return { deleteLocalidade, isLoading };
  };
  
  export default useDeleteLocalidade;
