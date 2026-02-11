import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { getLocalidades, salvarLocalidades } from "../../../realm/services/localidadeServices";
import { testConnection } from "../../../shared/functions/connection/testConnection";



export const useLocalidades = (foccus:boolean) =>{

  const [error, setError] = useState<Error | null>(null);
  const [isPresent, setIsPresent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
    
const fetchLocalidadeFromDB = () =>{
  const teste = getLocalidades();
  if(teste.length> 0){
    setIsPresent(true);
  }
}

const fetchLocalidadeFromAPI = async () => {

      const isConnected = await testConnection();
         
         if (isConnected) {
      
                try {
                  const response = await connectionAPIGet<LocalidadeType[]>('http://192.168.100.28:8080/localidade');

                                  const data = response as LocalidadeType[];
                                  if (data && Array.isArray(data) && data.length > 0) {
                                          await salvarLocalidades(data); 
                                          setIsPresent(true);
                                  } else {
                                    //console.log('Dados de localidade inválidos:');
                                    throw new Error('Dados de localidade inválidos');
                                  }
                  
                } catch (err) {
                // console.log('Erro ao obter dados de localidade:', err);
                        if (err instanceof Error) {
                          setError(err);
                        } else {
                          setError(new Error("Ocorreu um erro desconhecido ao obter dados de localidade."));
                        }
              }
            }
    };

    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        fetchLocalidadeFromDB(); // mostra algo rápido caso já tenha cache
        await fetchLocalidadeFromAPI();
        setLoading(false);
      };
  
      loadData();
    }, [foccus]);
  
    return { error, isPresent, loading };

}