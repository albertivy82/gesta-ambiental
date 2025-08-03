import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, TouchableOpacity, View } from 'react-native';
import { apagarAguaQueue, apagarAguaSyncronizada } from "../../../realm/services/aguasService";
import { apagarAtividadeProdutivaQueue, apagarAtividadeProdutivaSyncronizada } from "../../../realm/services/atividadeProdutivaService";
import { apagarBenfeitiaQueue, apagarBenfeitoriaSyncronizada } from "../../../realm/services/benfeitoriaService";
import { apagarCreditoQueue, apagarCreditoSyncronizada } from "../../../realm/services/creditoService";
import { apagarEntrevistadoQueue, apagarEntrevistadoSyncronizado } from "../../../realm/services/entrevistado";
import { apagarEscolaQueue, apagarEscolaSyncronizada } from "../../../realm/services/escolaService";
import { apagarImovelQueue, apagarImovelSyncronizado } from '../../../realm/services/imovelService';
import { apagarMoradorQueue, apagarMoradorSyncronizada } from "../../../realm/services/moradorService";
import { apagarParticipacaoInstituicaoQueue, apagarParticipacaoInstituicaoSyncronizada } from "../../../realm/services/ParticipacaoInstituicaoService";
import { apagarPostoQueue, apagarPostoSaudeSyncronizado } from '../../../realm/services/postoService';
import { apagarRendaOutrasFontesQueue, apagarRendaOutrasFontesSyncronizada } from "../../../realm/services/rendaOutrasFontes";
import { apagarServicoComunicacaoQueue, apagarServicosComunicacaoSyncronizada } from "../../../realm/services/servicosComunicacaoService";
import { connectionAPIDelete } from '../../../shared/functions/connection/connectionAPI';
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { Icon } from '../icon/Icon';
import Text from '../text/Text';
import { textTypes } from '../text/textTypes';

interface DeleteConfirmationProps {
  id: number;
  idLocal: string | undefined;
  deleteEndpoint: string;
  onDeleteSuccess: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ id, idLocal, deleteEndpoint, onDeleteSuccess }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Inicialização do hook de navegação

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      if (idLocal && id < 0) {
        switch (deleteEndpoint) {
          case "imovel":
            apagarImovelQueue(idLocal);
            break;
          case "posto-de-saude":
            apagarPostoQueue(idLocal);
            break;
          case "escola":
            apagarEscolaQueue(idLocal);
            break;
          case "entrevistado":
            apagarEntrevistadoQueue(idLocal);
            break;
          case "benfeitoria":
            apagarBenfeitiaQueue(idLocal);
            break;
          case "agua":
            apagarAguaQueue(idLocal);
            break;
          case "atividade-produtiva":
            apagarAtividadeProdutivaQueue(idLocal);
            break;
          case "credito":
            apagarCreditoQueue(idLocal);
            break;
          case "outras-fontes-de-renda":
            apagarRendaOutrasFontesQueue(idLocal);
            break;
          case "morador":
            apagarMoradorQueue(idLocal);
            break;
          case "servico-de-comunicacao":
            apagarServicoComunicacaoQueue(idLocal);
            break;
          case "participacao-instituicao":
            apagarParticipacaoInstituicaoQueue(idLocal);
            break;
                     
        }
  
        setModalVisible(false);
        onDeleteSuccess();
        navigation.goBack();
  
      } else {
       
        const isConnected = await testConnection();
  
        if (isConnected) {

          
          await connectionAPIDelete(`http://177.74.56.24/${deleteEndpoint}/${id}`);
  
          switch (deleteEndpoint) {
            case "imovel":
              apagarImovelSyncronizado(id);
              break;
            case "posto-de-saude":
              apagarPostoSaudeSyncronizado(id);
              break;
            case "escola":
              apagarEscolaSyncronizada(id);
              break;
            case "entrevistado":
              apagarEntrevistadoSyncronizado(id);
              break;
            case "benfeitoria":
              apagarBenfeitoriaSyncronizada(id);
              break;
            case "agua":
              apagarAguaSyncronizada(id);
            break;
            case "atividade-produtiva":
              apagarAtividadeProdutivaSyncronizada(id);
            break;
            case "credito":
              apagarCreditoSyncronizada(id);
            break;
            case "outras-fontes-de-renda":
              apagarRendaOutrasFontesSyncronizada(id);
            break;
            case "servico-de-comunicacao":
              apagarServicosComunicacaoSyncronizada(id);
            break;
            case "morador":
              apagarMoradorSyncronizada(id);
            break;
            case "participacao-instituicao":
              apagarParticipacaoInstituicaoSyncronizada(id);
            break;
          }
  
          setModalVisible(false);
          onDeleteSuccess();
          navigation.goBack();
  
        } else {
          Alert.alert(
            "Sem conexão",
            "Este item já foi sincronizado. Para excluir, conecte-se à internet."
          );
        }
      }
    } catch (error) {
      Alert.alert("Erro ao excluir", "Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => setModalVisible(true)}>
        <View style={{ alignItems: 'center' }}>
          <Icon size={40} name='bin' color="#ff4500" />
          <Text type={textTypes.PARAGRAPH_LIGHT} color="#ff4500">Apagar Item</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={{
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            width: 300, 
            padding: 20, 
            backgroundColor: 'white', 
            borderRadius: 10, 
            alignItems: 'center'
          }}>
            <Text type={textTypes.PARAGRAPH_LIGHT } color="#888">Deseja realmente excluir este item?</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#ff4500" />
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                  <Text type={textTypes.BUTTON_REGULAR} color="#888">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmDelete} style={{ padding: 10 }}>
                  <Text type={textTypes.BUTTON_REGULAR} color="#ff4500">Confirmar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DeleteConfirmation;
