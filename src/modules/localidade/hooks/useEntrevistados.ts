import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { setIdEntrevistadoFromApiOnImovel } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { apagarEntrevistadoQueue, getEntrevistados, getEntrevistadosDessincronizados, salvarEntrevistados } from "../../../realm/services/entrevistado";


export const convertToEntrevistadoInput = (entrevistado: any): EntrevistadoInput => {
  return {
       
    nome: entrevistado.nome,
    naturalidade: entrevistado.naturalidade,
    nascimentoData: entrevistado.nascimentoData,
    sexo: entrevistado.sexo,
    apelido: entrevistado.apelido,
    escolaridade: entrevistado.escolaridade,
    estadoCivil: entrevistado.estadoCivil,
    religiao: entrevistado.religiao,
    morador: entrevistado.morador,
    dataChegada: entrevistado.dataChegada,
    pretendeMudar: entrevistado.pretendeMudar,
    motivoVontadeMudanca: entrevistado.motivoVontadeMudanca,
    relacaoAreaImovel: entrevistado.relacaoAreaImovel,
    relacaoVizinhos: entrevistado.relacaoVizinhos,
    tipoAlimentacao: entrevistado.tipoAlimentacao,
    localCompras: entrevistado.localCompras,
    comoCuidaSaudeFamilia: entrevistado.comoCuidaSaudeFamilia,
    servicosDeficitarios: entrevistado.servicosDeficitarios,
    sofreuAssaltos: entrevistado.sofreuAssaltos,
    presenciouAssalto: entrevistado.presenciouAssalto,
    problemasDeViolenciaLocal: entrevistado.problemasDeViolenciaLocal,
    instituicaoConhecida: entrevistado.instituicaoConhecida,
    importanciaDeProtegerAmbiente: entrevistado.importanciaDeProtegerAmbiente,
    importanciaDeProtegerFauna: entrevistado.importanciaDeProtegerFauna,
    qualEspacoPrecisaSerPreservado: entrevistado.qualEspacoPrecisaSerPreservado,
    problemasRelacionadosAoAmbiente: entrevistado.problemasRelacionadosAoAmbiente,
    conheceUcs: entrevistado.conheceUcs,
    conheceUcProposta: entrevistado.conheceUcProposta,
    conheceAreaUc: entrevistado.conheceAreaUc,
    utilizaAreaUc: entrevistado.utilizaAreaUc,
    propostaMelhorarArea: entrevistado.propostaMelhorarArea,
    indicadoConsultaPublica: entrevistado.indicadoConsultaPublica,
    contatoIndicadoConsultaPublica: entrevistado.contatoIndicadoConsultaPublica,
        localidade: {
            id: entrevistado.localidade,
        },
    };
  };



export const useEntrevistados = (localidadeId: number) =>{
    
   const [contagemEntrevistados, setContagemEntrevistados] = useState<number>(0);
   
  
  
   const fetchEntrevistadosFromLocalDb = () => {
    
    const localData = getEntrevistados(localidadeId);
    if (localData.length > 0) {
        console.log(localData);
      setContagemEntrevistados(localData.length);
    }
  };


   const sinconizeQueue = async () => {
    const EntrevistadoQueue = getEntrevistadosDessincronizados(localidadeId);
    if (EntrevistadoQueue.length > 0) {
        for (const entrevistado of EntrevistadoQueue) {
        
            const novoEntrevistadoIput = convertToEntrevistadoInput(entrevistado);
            
            const netInfoState = await NetInfo.fetch();
            if (netInfoState.isConnected) {
                const isConnected = await testConnection();
                if (isConnected) {
                    try {
                     
                        const response = await connectionAPIPost('http://192.168.100.28:8080/entrevistado', novoEntrevistadoIput);
                        const EntrevistadoAPI = response as EntrevistadoType;
                       
                        if (EntrevistadoAPI.id) {
                            setIdEntrevistadoFromApiOnImovel(EntrevistadoAPI.id, entrevistado.idLocal!);
                            apagarEntrevistadoQueue(entrevistado.idLocal!);
                        }
                    } catch (error) {
                        console.error('Erro na sincronização do imóvel:', error);
                    }
                }
            }
        }
    }
};

const fetchEntrevistadosFromAPI = async () => {
   
    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected ) {
        const isConnected = await testConnection();
        if (isConnected) {
            console.log("here")
      try {
          const entrevistadoAPI = await connectionAPIGet<EntrevistadoType[]>(`http://192.168.100.28:8080/entrevistado/localidade-entrevistado/${localidadeId}`);
           
          const entrevistadoData: EntrevistadoType[] = entrevistadoAPI.map(entrevistado => ({
                         ...entrevistado,
                         localidade: { id: entrevistado.localidade.id }, // ajusta a estrutura
                         sincronizado: true,
                         idLocal: '', 
                       }));
         
          
                if(entrevistadoData && Array.isArray(entrevistadoData) && entrevistadoData.length> 0){
               await salvarEntrevistados(entrevistadoData)
               const contagem = entrevistadoData.length;
                setContagemEntrevistados(contagem);
                  } else {
                        throw new Error('Dados de entrevistados Inválidos');
                  }

      } catch (error) {
        console.log("CONTAGEM DE ENTREVISTADOS-ERRO!!!:", error);
      }
    }}
      
    };

    
    
    
      useEffect(()=>{
        sinconizeQueue();
        fetchEntrevistadosFromAPI();
        fetchEntrevistadosFromLocalDb();
     }, []);
    
      return { contagemEntrevistados};


}