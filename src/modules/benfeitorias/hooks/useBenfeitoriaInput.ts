import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";
import { salvarBenfeitoriaQueue } from "../../../realm/services/benfeitoriaService";
import { testConnection } from "../../../shared/functions/connection/testConnection";

export const DEFAULT_BENFEITORIA_INPUT: BenfeitoriaInput =  {

    tipoBenfeitoria: null,
    funcao: null,
    afastamentoDaPrincipal: '',
    impermeabilizacaoSolo: null,
    limites: '',
    areaBenfeitoria: 0,
    pavimentos: 0,
    paredes: null,
    tipoCobertura: null,
    tipoEsquadrias: null,
    origemMadeiraDaConstrucao: '',
    origemPedraDaConstrucao: '',
    origemAreiaDaConstrucao: '',
    alagamentos: '',
    epocaOcorrencia: '',
    efluentes: null,
    residuos: null,
    fonteEnergia: null,
    energiaAlimentos: null,
    meiosLocomocao: null,
    linhasOnibus: '',
    informativoPredominante: null,
    imovel: {
        id:0,
    },
    }


export const UseNovaBenfeitoria =(imovelId: number, idImovelLocal : string|undefined, sincronizado: boolean)=>{

const [novaBenfeitoria, setNovaBenfeitoria] = useState<BenfeitoriaInput>(DEFAULT_BENFEITORIA_INPUT);
const [disabled, setdisable] = useState<boolean>(true);

useEffect(()=>{
    if(

      novaBenfeitoria.tipoBenfeitoria !== null &&
      novaBenfeitoria.funcao !== null &&
      novaBenfeitoria.afastamentoDaPrincipal !== '' &&
      novaBenfeitoria.impermeabilizacaoSolo !== null &&
      novaBenfeitoria.limites !== '' &&
      novaBenfeitoria.areaBenfeitoria > 0 &&
      novaBenfeitoria.pavimentos > 0 &&
      novaBenfeitoria.paredes !== null &&
      novaBenfeitoria.tipoCobertura !== null &&
      novaBenfeitoria.tipoEsquadrias !== null &&
      novaBenfeitoria.origemMadeiraDaConstrucao !== '' &&
      novaBenfeitoria.origemPedraDaConstrucao !== '' &&
      novaBenfeitoria.origemAreiaDaConstrucao !== '' &&
      novaBenfeitoria.alagamentos !== null &&
      novaBenfeitoria.epocaOcorrencia !== null &&
      novaBenfeitoria.efluentes !== null &&
      novaBenfeitoria.residuos !== null &&
      novaBenfeitoria.fonteEnergia !== null &&
      novaBenfeitoria.energiaAlimentos !== null &&
      novaBenfeitoria.meiosLocomocao !== null &&
      novaBenfeitoria.linhasOnibus !== '' &&
      novaBenfeitoria.informativoPredominante !== null
        

    )
    {
        setdisable(false)
    }
},[novaBenfeitoria]);


const objetoFila = () => {
  //console.log("Iniciando criação do objeto fila...");

  const benfeitoriaData: BenfeitoriaInput = {
      ...novaBenfeitoria, 
      sincronizado: false,  
      idLocal: uuidv4(), // Cria um ID único para a benfeitoria
  };
  // Verifica se o imóvel já possui um ID oficial (sincronizado)
  if (imovelId>0) {
     // console.log("ID do imóvel encontrado:", imovelId);
      // Se sim, usa o ID oficial
      benfeitoriaData.imovel!.id = imovelId;
      benfeitoriaData.idFather = "";
     // console.log("ID oficial do imóvel atribuído a benfeitoriaData:", benfeitoriaData.imovel);
  } else {
     // console.log("Imóvel não possui ID oficial ainda. Verificando idLocal...");

      if (idImovelLocal) {
        //  console.log("ID local do imóvel encontrado:", idImovelLocal);
          // Usa o idLocal do imóvel como referência
          benfeitoriaData.idFather = idImovelLocal;
          benfeitoriaData.imovel!.id = imovelId;
      } else {
          console.warn("ID local do imóvel não encontrado. Verifique se está sendo passado corretamente.");
      }

    
  }

  //console.log("Objeto benfeitoriaData final:", benfeitoriaData);
  return benfeitoriaData;
};


const enviarRegistro = async () =>{

 
  //imovel offline
      if(!sincronizado && imovelId<=0){
        //imovel offline
        const benfeitoriaDataQueue = objetoFila();
        salvarBenfeitoriaQueue(benfeitoriaDataQueue);
        console.log("benfeitoria case: imóvel offline")

      }else{
          novaBenfeitoria.imovel = {id:imovelId};
          const netInfoState = await NetInfo.fetch();
          const isConnected = await testConnection();
        
                if(netInfoState.isConnected && isConnected){
                  
                  try{
                     
                    await connectionAPIPost('http://192.168.100.28:8080/benfeitoria', novaBenfeitoria);
                      

                  } catch (error) {
                      const benfeitoriaDataQueue = objetoFila();
                      salvarBenfeitoriaQueue(benfeitoriaDataQueue);
                     
                  }
                }else{
                  const benfeitoriaDataQueue = objetoFila();
                      salvarBenfeitoriaQueue(benfeitoriaDataQueue);
                     
                  
                }
      }
}

  const handleEnumChange = (field: keyof BenfeitoriaInput, value: any) => {
     setNovaBenfeitoria((current) => ({
       ...current,
       [field]: value,
     }));
   };

   const handleArrayFieldChange = (field: keyof BenfeitoriaInput, values: string[]) => {
           const concatenatedValues = values.join(', '); // Concatena os valores com vírgulas
           setNovaBenfeitoria((currentState) => ({
             ...currentState,
             [field]: concatenatedValues,
           }));
   };


   const handleOnChangeAreaBenfeitoria = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    let value = event.nativeEvent.text;
  
    // Remove qualquer caractere não numérico
    value = value.replace(/\D/g, '');
  
    // Converte para um número decimal com duas casas, adicionando 0s à esquerda se necessário
    const formattedValue = (parseInt(value, 10) / 100).toFixed(2);
  
    // Atualiza o estado com o valor formatado como número
    setNovaBenfeitoria((currentImovel) => ({
      ...currentImovel,
      areaImovel: parseFloat(formattedValue), // Salva como número para enviar à API
    }));
  };

  const handleNumberChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>, 
    field: keyof BenfeitoriaInput
  ) => {
    let value = event.nativeEvent.text.replace(/\D/g, ''); // Remove caracteres não numéricos
  
    setNovaBenfeitoria((current) => ({
      ...current,
      [field]: value ? parseInt(value, 10) : 0, // Garante que seja um número inteiro
    }));
  };

  
  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: string
  ) => {
    // Verifica se "value" é um evento ou uma string diretamente
    const newValue = typeof value === 'string' ? value : value.nativeEvent.text;
  
    setNovaBenfeitoria((current) => ({
      ...current,
      [name]: newValue,
    }));
    };

 return {novaBenfeitoria, 
         handleEnumChange,
         handleArrayFieldChange,
         handleOnChangeAreaBenfeitoria,
         handleNumberChange,
         handleOnChangeInput,
          disabled,
        }

}