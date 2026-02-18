import { useEffect, useState } from "react";
import { Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { salvarBenfeitoria, salvarBenfeitoriaQueue } from "../../../realm/services/benfeitoriaService";
import { connectionAPIGet, connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { imovelBody } from "../../../shared/types/imovelType";
import { validateBenfeitoria } from "../components/validateBenfeitria";

export const DEFAULT_BENFEITORIA_INPUT: BenfeitoriaInput = {
  tipoBenfeitoria: '',
  funcao: '',
  afastamentoDaPrincipal: '',
  impermeabilizacaoSolo: '',
  limites: '',
  areaBenfeitoria: 0,
  pavimentos: 0,
  paredes: '',
  tipoCobertura: '',
  tipoEsquadrias: '',
  origemMadeiraDaConstrucao: '',
  origemPedraDaConstrucao: '',
  origemAreiaDaConstrucao: '',
  alagamentos: '',
  epocaOcorrencia: '',
  efluentes: '',
  residuos: '',
  fonteEnergia: '',
  energiaAlimentos: '',
  meiosLocomocao: '',
  informativoPredominante: '',
  imovel: {
    id: 0,
  },
};


export const UseNovaBenfeitoria =(imovel: imovelBody, benfeitoria?: BenfeitoriaType)=>{

const [novaBenfeitoria, setNovaBenfeitoria] = useState<BenfeitoriaInput>(DEFAULT_BENFEITORIA_INPUT);
const [disabled, setDisabled] = useState<boolean>(true);

 //console.log(novoImovel)
     useEffect(() => {
        const { isValid } = validateBenfeitoria(novaBenfeitoria);
        setDisabled(!isValid);
      }, [novaBenfeitoria]);



const objetoFila = () => {
  //console.log("Iniciando criação do objeto fila...");

  const benfeitoriaData: BenfeitoriaInput = {
      ...novaBenfeitoria, 
      sincronizado: false,  
      idLocal: uuidv4(), // Cria um ID único para a benfeitoria
  };
  // Verifica se o imóvel já possui um ID oficial (sincronizado)
  if (imovel.id>0) {
     // console.log("ID do imóvel encontrado:", imovel.id);
      // Se sim, usa o ID oficial
      benfeitoriaData.imovel!.id = imovel.id;
      benfeitoriaData.idFather = "";
     // console.log("ID oficial do imóvel atribuído a benfeitoriaData:", benfeitoriaData.imovel);
  } else {
     // console.log("Imóvel não possui ID oficial ainda. Verificando idLocal...");

      if (imovel.idLocal) {
        //  console.log("ID local do imóvel encontrado:", imovel.idLocal);
          // Usa o idLocal do imóvel como referência
          benfeitoriaData.idFather = imovel.idLocal;
          benfeitoriaData.imovel!.id = imovel.id;
      } else {
          console.warn("ID local do imóvel não encontrado. Verifique se está sendo passado corretamente.");
      }

    
  }

  //console.log("Objeto benfeitoriaData final:", benfeitoriaData);
  return benfeitoriaData;
};

const enviarRegistro = async () => {
  if (benfeitoria) {
    console.log("enviando?")
      return await enviaBenfeitoriaEdicao();
  } else {
    console.log("enviando?")
     return await enviaBenfeitoriaNova();
  }
};


const enviaBenfeitoriaNova = async () =>{

 
  //imovel offline
      if(!imovel.sincronizado && imovel.id<=0){
        //imovel offline
        const benfeitoriaDataQueue = objetoFila();
        const benfeitoriaQueue = await salvarBenfeitoriaQueue(benfeitoriaDataQueue);
        return benfeitoriaQueue;
       

      }else{
          novaBenfeitoria.imovel = {id:imovel.id};;
         
          const isConnected = await testConnection();
          
                if(isConnected){
                  
                  try{
                     
                    const response = await connectionAPIPost('http://192.168.100.28:8080/benfeitoria', novaBenfeitoria) as BenfeitoriaType;
                     
                    if (response && response.id) {
                          return fetchBefeitoriaAPI(response.id);
                    }

                  } catch (error) {
                      const benfeitoriaDataQueue = objetoFila();
                      const benfeitoriaQueue = await salvarBenfeitoriaQueue(benfeitoriaDataQueue);
                      return benfeitoriaQueue;
                     
                  }
                }else{
                  const benfeitoriaDataQueue = objetoFila();
                  const benfeitoriaQueue = await salvarBenfeitoriaQueue(benfeitoriaDataQueue);
                  return benfeitoriaQueue;
                     
                  
                }
      }
}


const enviaBenfeitoriaEdicao= async () =>{
 
  const testConnectionOne = await testConnection();

    if(!benfeitoria?.sincronizado && !testConnectionOne){
           
              Alert.alert("Registro Apenas Local");
             const local = await salvarBenfeitoria(buildBenfeitoriaAtualizada());
               return local;
      
      }else{
 
  const benfeitoriaCorrigida = {
    ...novaBenfeitoria,
    imovel: { id: typeof benfeitoria!.imovel === 'number' ? benfeitoria!.imovel : benfeitoria!.imovel.id }
  };
  
  
  const isConnected = await testConnection();
   if(isConnected){
    
          //este fluxo atende a objetos que estão sincronizados e estão na api. Somente podem ser edicatos se forem efetivamente salvos 
          try{
            
            const response = await connectionAPIPut(`http://192.168.100.28:8080/benfeitoria/${benfeitoria!.id}`, benfeitoriaCorrigida) as BenfeitoriaType;
                if (response && response.id) {
                return fetchBefeitoriaAPI(response.id);
                }else{
                  const local = await salvarBenfeitoria(buildBenfeitoriaAtualizada());
                  return local;
                }
          } catch (error) {
            //console.error("Erro ao enviar PUT:", error);
            const local = await salvarBenfeitoria(buildBenfeitoriaAtualizada());
            Alert.alert("Erro ao enviar edição", "Tente novamente online.");
            return local;
             
          }
        
        } else {
          if (!benfeitoria!.sincronizado && benfeitoria!.idLocal) {
           return await salvarBenfeitoria(buildBenfeitoriaAtualizada());
          } else {
            Alert.alert("Sem conexão", "Este registro já foi sincronizado.");
            return null;
          }
        }
      }
        
}

const buildBenfeitoriaAtualizada = (): BenfeitoriaType => ({
  ...benfeitoria!,
  ...novaBenfeitoria,
  imovel: { id: typeof benfeitoria!.imovel === 'number' ? benfeitoria!.imovel : benfeitoria!.imovel.id },
  sincronizado: benfeitoria?.sincronizado,
  idLocal: benfeitoria?.idLocal,
  idFather: benfeitoria?.idFather,
});

 const fetchBefeitoriaAPI = async(id:number) =>{

        try{
            const response = await connectionAPIGet<BenfeitoriaType>(`http://192.168.100.28:8080/benfeitoria/${id}`);
            if (response) {
              const bftData = {
                  ...response,
                  sincronizado: true,
                  idLocal: '',
                  idFather: '',
              };
                 return await salvarBenfeitoria(bftData);
            }else{
                    throw new Error('Dados de benfeitoria Inválidos'); 
                }
        } catch (error) {
                //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
        }
  };


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
      areaBenfeitoria: parseFloat(formattedValue), // Salva como número para enviar à API
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
         enviarRegistro,
         handleEnumChange,
         handleArrayFieldChange,
         handleOnChangeAreaBenfeitoria,
         handleNumberChange,
         handleOnChangeInput,
         validateBenfeitoria,
         disabled,
        }

}