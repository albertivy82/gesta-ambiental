import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { BenfeitoriaInput } from "../../../shared/types/BenfeitoriaInput";

export const DEFAULT_BENFEITORIA_INPUT: BenfeitoriaInput =  {

    tipoBenfeitoria: '',
    funcao: '',
    tipoSolo: '',
    areaBenfeitoria: 0,
    pavimentos: 0,
    tipoConstrucao: '',
    origemMaterialConstrucao: [], 
    tipoCobertura: '',
    tipoEsquadrias: '',
    alagamentos: '',
    nivelAlagamentos:'',
    efluentes: '',
    residuos: '',
    fonteEnergia: '',
    energiaAlimentos: '',
    informativoPredominante: '',
    importanciaDeProtegerFauna: '',
    importanciaDeProtegerAmbiente: '',
    qualEspacoPrecisaSerPreservado: '',
    problemasRelacionadosAoAmbiente: '',
    imovel: {
        id:0,
    },
    }


export const UseNovaBenfeitoria =(imovelId: number, idLocal : string|undefined, sincronizado: boolean)=>{

const [novaBenfeitoria, setNovaBenfeitoria] = useState<BenfeitoriaInput>(DEFAULT_BENFEITORIA_INPUT);
const [disabled, setdisable] = useState<boolean>(true);

useEffect(()=>{
    if(

        novaBenfeitoria.tipoBenfeitoria !== '' &&
        novaBenfeitoria.funcao !== '' &&
        novaBenfeitoria.tipoSolo !== '' &&
        novaBenfeitoria.areaBenfeitoria !== 0 &&
        novaBenfeitoria.pavimentos !== 0 &&
        novaBenfeitoria.tipoConstrucao !== '' &&
        novaBenfeitoria.origemMaterialConstrucao.length > 0 &&
        novaBenfeitoria.tipoCobertura !== '' &&
        novaBenfeitoria.tipoEsquadrias !== '' &&
        novaBenfeitoria.alagamentos !== '' &&
        novaBenfeitoria.nivelAlagamentos !== '' &&
        novaBenfeitoria.efluentes !== '' &&
        novaBenfeitoria.residuos !== '' &&
        novaBenfeitoria.fonteEnergia !== '' &&
        novaBenfeitoria.energiaAlimentos !== '' &&
        novaBenfeitoria.informativoPredominante !== '' &&
        novaBenfeitoria.importanciaDeProtegerFauna !== '' &&
        novaBenfeitoria.importanciaDeProtegerAmbiente !== '' &&
        novaBenfeitoria.qualEspacoPrecisaSerPreservado !== '' &&
        novaBenfeitoria.problemasRelacionadosAoAmbiente !== ''
        

    )
    {
        setdisable(false)
    }
},[novaBenfeitoria]);


const objetoFilaA =()=>{
     
  const benfeitoriaData: BenfeitoriaInput = {
   ...novaBenfeitoria, 
    imovel: {
      id:imovelId
    },
    sincronizado: false,  
    idLocal: uuidv4(),

  }
  return benfeitoriaData
}

const objetoFilaB =()=>{
     
  const benfeitoriaData: BenfeitoriaInput = {
   ...novaBenfeitoria, 
    imovel: {
      id:0
    },
    sincronizado: false,  
    idLocal: uuidv4(),
    idFather: idLocal,
  }
  return benfeitoriaData
}



const enviarRegistro = async () =>{

 
 
  if(!sincronizado && !imovelId){

   
   

  }else{
      
    
    novaBenfeitoria.imovel = {id:imovelId};
      
    
      
      const netInfoState = await NetInfo.fetch();
     
        if(netInfoState.isConnected){

            try{
              
              
            
              const benfeitoriaOk = await connectionAPIPost('http://192.168.100.28:8080/benfeitoria', novaBenfeitoria);
              console.log(benfeitoriaOk)
            } catch (error) {
              console.error('Erro Também precisa enviar para fila:', error);
            }
         
        }else{
          
        }

   

  }

  
}


const handleTipoBenfeitoria = (tipo: string) => {
   setNovaBenfeitoria((currentBenfeitoria) => ({
      ...currentBenfeitoria,
      tipoBenfeitoria: tipo,
    }));
};

const handleFuncao = (funcao: string) => {
    setNovaBenfeitoria((currentBenfeitoria) => ({
       ...currentBenfeitoria,
       funcao: funcao,
     }));
};


const handleSolo = (solo: string) => {
    setNovaBenfeitoria((currentBenfeitoria) => ({
       ...currentBenfeitoria,
       tipoSolo: solo,
     }));
};

const handleAreaBenfeitoria = (
  event: NativeSyntheticEvent<TextInputChangeEventData>
 ) => {
  const value = event.nativeEvent.text;
  const areaNum = parseFloat(value) || 0;

  setNovaBenfeitoria((currentBenfeitoria) => ({
      ...currentBenfeitoria,
      areaBenfeitoria: areaNum,
  }));
};

const handlePavimentos = (
  event: NativeSyntheticEvent<TextInputChangeEventData>
 ) => {
  const value = event.nativeEvent.text;
  const pavimentosNum = parseInt(value) || 0; 

  setNovaBenfeitoria((currentBenfeitoria) => ({
      ...currentBenfeitoria,
      pavimentos: pavimentosNum,
  }));
};

const handleTipoConstrucao = (tipoConstrucao:string)=>{
  setNovaBenfeitoria((currentBenfeitoria)=>({...currentBenfeitoria, tipoConstrucao: tipoConstrucao}));
};

const handleMaterialConstrução = (matConstrucao:string[])=>{
  setNovaBenfeitoria((currentBenfeitoria)=>({...currentBenfeitoria, origemMaterialConstrucao: matConstrucao}));
};


const handleCobertura = (cobertura: string) => {
    setNovaBenfeitoria((currentBenfeitoria) => ({
       ...currentBenfeitoria,
       tipoCobertura: cobertura,
     }));
};

const handleEsquadrias = (esquadrias: string) => {
    setNovaBenfeitoria((currentBenfeitoria) => ({
       ...currentBenfeitoria,
       tipoEsquadrias: esquadrias,
     }));
};

const handleAlagamentos = (alagamentos: string) => {
    setNovaBenfeitoria((currentBenfeitoria) => ({
       ...currentBenfeitoria,
      alagamentos: alagamentos,
     }));
};

const handleNivelAlagamentos = (NivelAlagamentos: string) => {
  setNovaBenfeitoria((currentBenfeitoria) => ({
     ...currentBenfeitoria,
    nivelAlagamentos: NivelAlagamentos,
   }));
};


const handleEfluentes = (efluentes: string) => {
  setNovaBenfeitoria((currentBenfeitoria) => ({
     ...currentBenfeitoria,
    efluentes: efluentes,
   }));
};

const hendleResiduos = (residuos: string) => {
  setNovaBenfeitoria((currentBenfeitoria) => ({
     ...currentBenfeitoria,
     residuos: residuos,
   }));
};

const handleFonteEnergia = (fonteEnergia: string) => {
  setNovaBenfeitoria((currentBenfeitoria) => ({
     ...currentBenfeitoria,
     fonteEnergia: fonteEnergia,
   }));
};

const handleEnergiaAlimentos = (energiaAlimentos: string) => {
  setNovaBenfeitoria((currentBenfeitoria) => ({
     ...currentBenfeitoria,
     energiaAlimentos: energiaAlimentos,
   }));
};

const handleOnChangeInput = (
  event: NativeSyntheticEvent<TextInputChangeEventData>,
  name:string
 ) => {
   setNovaBenfeitoria((currentBenfeitoria) => ({
      ...currentBenfeitoria,
      [name]: event.nativeEvent.text,
  }));
};


const handleInformativoPredominante = (informativo: string) => {
  setNovaBenfeitoria((currentBenfeitoria) => ({
     ...currentBenfeitoria,
     informativoPredominante: informativo,
   }));
};


 return {novaBenfeitoria, 
          handleTipoBenfeitoria,
          handleFuncao,
          handleSolo,
          handleAreaBenfeitoria,
          handlePavimentos,
          handleTipoConstrucao,
          handleMaterialConstrução,
          handleCobertura,
          handleEsquadrias,
          handleAlagamentos,
          handleNivelAlagamentos,
          handleEfluentes,
          hendleResiduos,
          handleFonteEnergia,
          handleEnergiaAlimentos,
          handleInformativoPredominante,
          handleOnChangeInput,
          enviarRegistro,
          disabled,
        }

}