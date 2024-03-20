import { useEffect, useState } from "react";
import { TipoBenfeitoria } from "../../../enums/TipoBenfeitoria.enum";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { Funcao } from "../../../enums/Funcao.enum";

export const DEFAULT_BENFEITORIA_INPUT: BenfeitoriaType =  {

    tipoBenfeitoria: null,
    funcao: null,
    tipoSolo: '',
    areaBenfeitoria: 0,
    pavimentos: 0,
    tipoConstrucao: '',
    OrigemMaterialConstrucao: [], 
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
    idLocalImovel: '',
    sincronizado: false,
    idLocal: '',

}


export const UseNovaBenfeitoria =()=>{

const [novaBenfeitoria, setNovaBenfeitoria] = useState<BenfeitoriaType>(DEFAULT_BENFEITORIA_INPUT);
const [disable, setdisable] = useState<boolean>(true);

useEffect(()=>{
    if(

        novaBenfeitoria.tipoBenfeitoria !== '' &&
        novaBenfeitoria.funcao !== '' &&
        novaBenfeitoria.tipoSolo !== '' &&
        novaBenfeitoria.areaBenfeitoria !== 0 &&
        novaBenfeitoria.pavimentos !== 0 &&
        novaBenfeitoria.tipoConstrucao !== '' &&
        novaBenfeitoria.OrigemMaterialConstrucao.length > 0 &&
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


const handleTipoBenfeitoria = (tipo: TipoBenfeitoria | "" | null) => {
   setNovaBenfeitoria((currentBenfeitoria) => ({
      ...currentBenfeitoria,
      tipoBenfeitoria: tipo,
    }));
};

const handleFuncao = (funcao: Funcao | "" | null) => {
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
  setNovaBenfeitoria((currentBenfeitoria)=>({...currentBenfeitoria, OrigemMaterialConstrucao: matConstrucao}));
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
    alagamentos: NivelAlagamentos,
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
        }

}