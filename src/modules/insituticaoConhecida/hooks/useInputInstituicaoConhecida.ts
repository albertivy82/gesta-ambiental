import NetInfo from "@react-native-community/netinfo";
import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { InstituicaoConhecidaInput } from "../../../shared/types/instituicaoConhecidaInput";
import { salvarInstituicaoConhecidaQueue } from "../../../realm/services/apagar";
import { testConnection } from "../../../shared/functions/connection/testConnection";

// Valor padrão para `InstituicaoConhecidaInput`
export const DEFAULT_INSTITUICAO_CONHECIDA_INPUT: InstituicaoConhecidaInput = {
  
  nome: '',
  atividades: '',
  benfeitoria: {
    id: 0,
  },
};

// Hook para manipular um novo registro de `InstituicaoConhecida`
export const useNovaInstituicaoConhecida = (benfeitoriaId: number, idBenfeitoriaLocal : string|undefined, sincronizado: boolean) => {
  const [novaInstituicao, setNovaInstituicao] = useState<InstituicaoConhecidaInput>(
    DEFAULT_INSTITUICAO_CONHECIDA_INPUT
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(novaInstituicao);
    if (novaInstituicao.nome !== '' && novaInstituicao.atividades !== '') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [novaInstituicao]);

  const objetoFila = () => {
    const instituicaoConhecidaData: InstituicaoConhecidaInput = {
      ...novaInstituicao,
      sincronizado: false,
      idLocal: uuidv4(), // Cria um ID único para a instituição conhecida
    };
  
    if (benfeitoriaId > 0) {
      // Caso a benfeitoria tenha um ID oficial
      instituicaoConhecidaData.benfeitoria = { id: benfeitoriaId };
      instituicaoConhecidaData.idFather = "";
    } else {
      if (idBenfeitoriaLocal) {
        // Caso a benfeitoria esteja offline, usa o ID local
        instituicaoConhecidaData.idFather = idBenfeitoriaLocal;
        instituicaoConhecidaData.benfeitoria = { id: benfeitoriaId };
      } else {
        console.warn("ID local da benfeitoria não encontrado. Verifique se está sendo passado corretamente.");
      }
    }
  
    return instituicaoConhecidaData;
  };

  const enviarRegistro = async () => {
    if (!sincronizado && benfeitoriaId <= 0) {
      // Benfeitoria offline
      const instituicaoConhecidaDataQueue = objetoFila();
      salvarInstituicaoConhecidaQueue(instituicaoConhecidaDataQueue);
      console.log("Instituição Conhecida case: benfeitoria offline");
    } else {
      novaInstituicao.benfeitoria = { id: benfeitoriaId };
     
      const isConnected = await testConnection();
  
      if (isConnected) {
        try {
          await connectionAPIPost('http://177.74.56.24/instituicao-conhecida', novaInstituicao);
        } catch (error) {
          const instituicaoConhecidaDataQueue = objetoFila();
          salvarInstituicaoConhecidaQueue(instituicaoConhecidaDataQueue);
        }
      } else {
        const instituicaoConhecidaDataQueue = objetoFila();
        salvarInstituicaoConhecidaQueue(instituicaoConhecidaDataQueue);
      }
    }
  };
  
  

  }  