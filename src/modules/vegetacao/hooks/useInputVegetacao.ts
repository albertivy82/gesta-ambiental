import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { salvarVegetacaoQueue } from "../../../realm/services/vegetacaoService";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export const DEFAULT_VEGETACAO_INPUT: VegetacaoInput = {
  usoMedicinal: null,
  usoAlimentacao: null,
  usoOrnamental: null,
  usoComercial: null,
  usaFlor: null,
  usaFolha: null,
  usaSemente: null,
  usaFruto: null,
  usaCasca: null,
  usaRaiz: null,
  usoLeiteLatex: null,
  outrosUsos: null,
  coletaLocalPublico: null,
  coletaCultivo: null,
  coletaCompra: null,
  coletaAmbienteEspecifica: null,
  quemEnsinouUso: '',
  repassaConhecimento: '',
  observacoesEspontaneas: '',
  entrevistado: {
    id: 0,
  },
};

export const useNovaVegetacao = (entrevistado:EntrevistadoType) => {
  const [novaVegetacao, setNovaVegetacao] = useState<VegetacaoInput>(DEFAULT_VEGETACAO_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    console.log(novaVegetacao);
    if (
      novaVegetacao.usoMedicinal !== null &&
      novaVegetacao.usoAlimentacao !== null &&
      novaVegetacao.usoOrnamental !== null &&
      novaVegetacao.usoComercial !== null &&
      novaVegetacao.usaFlor !== null &&
      novaVegetacao.usaFolha !== null &&
      novaVegetacao.usaSemente !== null &&
      novaVegetacao.usaFruto !== null &&
      novaVegetacao.usaCasca !== null &&
      novaVegetacao.usaRaiz !== null &&
      novaVegetacao.usoLeiteLatex !== null &&
      novaVegetacao.outrosUsos !== null &&
      novaVegetacao.coletaLocalPublico !== null &&
      novaVegetacao.coletaCultivo !== null &&
      novaVegetacao.coletaCompra !== null &&
      novaVegetacao.coletaAmbienteEspecifica !== null &&
      novaVegetacao.quemEnsinouUso !== '' &&
      novaVegetacao.repassaConhecimento !== '' &&
      novaVegetacao.observacoesEspontaneas !== ''
    ) {
      setDisabled(false);
  }
}, [novaVegetacao]);

  
const objetoFila = () => {
      const vegetacaoData: VegetacaoInput = {
          ...novaVegetacao, 
          sincronizado: false,  
          idLocal: uuidv4(),
    };
    
      if (entrevistado.id > 0) {
        vegetacaoData.entrevistado!.id = entrevistado.id;
        vegetacaoData.idFather = "";
      } else if (entrevistado.idLocal) {
        vegetacaoData.idFather = entrevistado.idLocal;
        vegetacaoData.entrevistado!.id = entrevistado.id;
      } else {
          console.warn("ID local do entrevistado não encontrado. Verifique se está sendo passado corretamente.");
      }
    
      return vegetacaoData;
    };


    const inputVegetacaoApi = async () => {
    
      if (!entrevistado.sincronizado && entrevistado.id <= 0) {
          const vegetacaoDataQueue = objetoFila();
          console.log("useInputVegetacao_a", novaVegetacao)
          salvarVegetacaoQueue(vegetacaoDataQueue);
      } else {
          novaVegetacao.entrevistado = { id: entrevistado.id };
          console.log(novaVegetacao.entrevistado.id, "se não estiver correto, devo obedecer o modo do de proceder do hook")
          const netInfoState = await NetInfo.fetch();
          const isConnected = await testConnection();
          console.log("useInputVegetacao_b", novaVegetacao)
    
          if (netInfoState.isConnected && isConnected) {
            console.log("useInputVegetacao_c", novaVegetacao)
              try {
                  await connectionAPIPost('http://192.168.100.28:8080/vegetacao', novaVegetacao);
                  console.log("useInputVegetacao_d", novaVegetacao)
              } catch (error) {
                  const vegetacaoDataQueue = objetoFila();
                  salvarVegetacaoQueue(vegetacaoDataQueue);
                  console.log("useInputVegetacao_e", novaVegetacao)
              }
          } else {
              const vegetacaoDataQueue = objetoFila();
              salvarVegetacaoQueue(vegetacaoDataQueue);
              console.log("useInputVegetacao_f", novaVegetacao)
          }
      }
    };

    const handleOnChangeInput = (
          value: NativeSyntheticEvent<TextInputChangeEventData> | string,
          name: string
        ) => {
          // Verifica se "value" é um evento ou uma string diretamente
          const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
        
          setNovaVegetacao((current) => ({
            ...current,
            [name]: newValue,
          }));
        };
    
      const handleEnumChange = (field: keyof VegetacaoInput, value: any) => {
        setNovaVegetacao((current) => ({
               ...current,
               [field]: value,
             }));
      };
    
      const handleArrayFieldChange = (field: keyof VegetacaoInput, values: string[]) => {
                 const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
                 setNovaVegetacao((currentState) => ({
                   ...currentState,
                   [field]: concatenatedValues,
                 }));
      };
    
    
      return {
        novaVegetacao,
        handleOnChangeInput,
        handleEnumChange,
        handleArrayFieldChange,
        disabled,
    };
    

}