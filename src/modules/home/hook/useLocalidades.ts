import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { getLocalidades, salvarLocalidades } from "../../../realm/services/localidadeServices";



export const useLocalidades = () =>{


  const [error, setError] = useState<Error | null>(null);
  const [isPresent, setIsPresent] = useState<boolean>(false);
    
const fetchLocalidadeFromDB = () =>{
  const teste = getLocalidades();
  if(teste.length> 0){
    setIsPresent(true);
  }
}
    
  
  
  const fetchLocalidadeFromAPI = async () => {
      
      try {
            const response = await connectionAPIGet('http://192.168.100.28:8080/localidade');
                  const data = response as LocalidadeType[];
                        if (data && Array.isArray(data) && data.length > 0) {
                                await salvarLocalidades(data); 
                                setIsPresent(true);
                                
                        } else {
                          console.log('Dados de localidade inválidos:');
                          throw new Error('Dados de localidade inválidos');
                        }
        
      } catch (err) {
        console.log('Erro ao obter dados de localidade:', err);
              if (err instanceof Error) {
                setError(err);
              } else {
                setError(new Error("Ocorreu um erro desconhecido ao obter dados de localidade."));
              }
    }
    };

  useEffect(() => {
    fetchLocalidadeFromAPI();
    fetchLocalidadeFromDB();
  }, []);

  return { fetchLocalidadeFromAPI, fetchLocalidadeFromDB, error, isPresent };

}