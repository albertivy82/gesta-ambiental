import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { coordenadasBody } from "../../../shared/types/coordenadaBody";
import { getCoordenadas, salvarCoordenadas } from "../../../realm/services/coordenadaService";



export const useCoordenadas = (localidadeId: number) => {
    const [error, setError] = useState<Error | null>(null);
    const [coordenadas, setCoordenadas] = useState<boolean>(false);
  
    const fetchCoordenadasFromLocalDB = () => {
      const localData = getCoordenadas(localidadeId);
      if (localData.length > 0) {
        setCoordenadas(true);
      }
    };
  
    const fetchCoordenadasFromAPI = async () => {
      try {
        const response = await connectionAPIGet(`http://192.168.100.28:8080/coordenada/localidade-coordenadas/${localidadeId}`);
        const data = response as coordenadasBody[];
        if (data && Array.isArray(data) && data.length > 0) {
          await salvarCoordenadas(data);
          setCoordenadas(true); // pode usar um state diferente se quiser diferenciar dados de cache e dados frescos
        }
      } catch (err) {
        console.error('Erro ao obter dados de coordenadas:', err);
        setError(err instanceof Error ? err : new Error("Ocorreu um erro ao obter dados de Coordenadas."));
      }
    };
  
    useEffect(() => {
      fetchCoordenadasFromLocalDB();
      fetchCoordenadasFromAPI();
    }, []);
  
    return { error, coordenadas };
  }
  