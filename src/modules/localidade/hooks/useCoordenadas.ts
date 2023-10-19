import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { getLocalidades, salvarLocalidades } from "../../../realm/services/localidadeServices";
import { coordenadasBody } from "../../../shared/types/coordenadaBody";
import { salvarCoordenadas } from "../../../realm/services/coordenadaService";



export const useCoordenadas = (localidadeId: number) =>{

  const [error, setError] = useState<Error | null>(null);
  const [localidades, setLocalidades] = useState<boolean>(false);

    

    const fetchLCoordenada = async () => {
      
      try {
          const teste = getLocalidades();
          if(teste){
            setLocalidades(true);
          }else{
             const response = await connectionAPIGet(`http://192.168.100.28:8080/coordenada/localidade-coordenadas/${localidadeId}`);
                  const data = response as coordenadasBody[];


                    if (data && Array.isArray(data) && data.length > 0) {
                        await salvarCoordenadas(data); 
                        setLocalidades(true);
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

  return { fetchLCoordenada, error, localidades };

}