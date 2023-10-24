import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { getLocalidades, salvarLocalidades } from "../../../realm/services/localidadeServices";
import { coordenadasBody } from "../../../shared/types/coordenadaBody";
import { getCoordenadas, salvarCoordenadas } from "../../../realm/services/coordenadaService";



export const useCoordenadas = (localidadeId: number) =>{

  const [error, setError] = useState<Error | null>(null);
  const [coordenadas, setCoordenadas] = useState<boolean>(false);

    

    const fetchLCoordenada = async () => {
      
      try {
          const teste = getCoordenadas(localidadeId);

         console.log(teste, localidadeId)
          if(teste.length>0){
            console.log('ok')
            setCoordenadas(true);
          }else{
            console.log('not ok')
             const response = await connectionAPIGet(`http://192.168.100.28:8080/coordenada/localidade-coordenadas/${localidadeId}`);
                  const data = response as coordenadasBody[];

                  
                    if (data && Array.isArray(data) && data.length > 0) {

                      
                        await salvarCoordenadas(data); 
                        setCoordenadas(true);
                    } else {
                        throw new Error('Dados de Coordenadas Inválidos');
                    }
          }
       } catch (err) {
          console.error('Erro ao obter dados de coordenadas:', err);
          
                  if (err instanceof Error) {
                      setError(err);
                  } else {
                      setError(new Error("Ocorreu um erro desconhecido ao obter dados de Coordenadas."));
                  }
      
      }
    };

  useEffect(() => {
    fetchLCoordenada();
  }, []);

  return { fetchLCoordenada, error, coordenadas };

}