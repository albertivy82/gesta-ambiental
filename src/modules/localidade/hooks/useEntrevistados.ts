import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { setIdEntrevistadoFromApiOnImovel } from "../../../realm/services/imovelService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoInput } from "../../../shared/types/EntrevistadoInput";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { apagarEntrevistadoQueue, getEntrevistados, getEntrevistadosDessincronizados, salvarEntrevistados } from "../../../realm/services/entrevistado";

export const convertToEntrevistadoInput=(entrevistado:any) => {

    const entrevistadoInput: EntrevistadoInput ={
       
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
        servicosDeficitarios: entrevistado.servicosDeficitarios,
        sofreuAssaltos: entrevistado.sofreuAssaltos,
        presenciouAssalto: entrevistado.presenciouAssalto,
        problemasDeViolenciaLocal: entrevistado.problemasDeViolenciaLocal,
        conheceUcs: entrevistado.conheceUcs,
        conheceUcProposta: entrevistado.conheceUcProposta,
        conheceAreaUc: entrevistado.conheceAreaUc,
        utilizaAreaUc: entrevistado.utilizaAreaUc,
        propostaMelhorarArea: entrevistado.propostaMelhorarArea,
        indicadoConsultaPublica: entrevistado.indicadoConsultaPublica,
        contatoIndicadoConsultaPublica: entrevistado.entrevistado,
        localidade: {
            id: entrevistado.localidade
        }

    }
   
        return entrevistadoInput
    };



export const useEntrevistados = (localidadeId: number) =>{
   const [contagemEntrevistados, setContagemEntrevistados] = useState<number>(0);
   
  
  
   const fetchEntrevistadosFromLocalDb = () => {
    
    const localData = getEntrevistados(localidadeId);
    if (localData.length > 0) {
      setContagemEntrevistados(localData.length);
    }
  };


   const sinconizeQueue = async () => {
    const EntrevistadoQueue = getEntrevistadosDessincronizados(localidadeId);
    if (EntrevistadoQueue.length > 0) {
        for (const entrevistado of EntrevistadoQueue) {
            const novoEntrevistadoIput = convertToEntrevistadoInput(entrevistado);
            //console.log(novoImoveIput);
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
      try {
          const imoveisAPI = await connectionAPIGet<EntrevistadoType[]>(`http://192.168.100.28:8080/entrevistado/localidade-Entrevistado/${localidadeId}`);
         const ImData = imoveisAPI.map(Entrevistado => ({
              ...Entrevistado,
              sincronizado: true, 
              idLocal: '',         
          }));
         
          if(ImData && Array.isArray(ImData) && ImData.length> 0){
               await salvarEntrevistados(ImData)
               const contagem = ImData.length;
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
        sinconizeQueue()
        fetchEntrevistadosFromAPI();
        fetchEntrevistadosFromLocalDb();
        
      }, []);
    
      return { contagemEntrevistados};


}