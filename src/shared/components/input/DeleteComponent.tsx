import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, TouchableOpacity, View } from 'react-native';
import { apagarAveSyncronizada } from "../../../realm/services/avesService";
import { apagarEntrevistadoQueue, apagarEntrevistadoSyncronizado } from "../../../realm/services/entrevistado";
import { apagarEscolaQueue, apagarEscolaSyncronizada } from "../../../realm/services/escolaService";
import { apagarFaunaQueue, apagarFaunaSyncronizada } from "../../../realm/services/faunaService";
import { apagarImovelQueue, apagarImovelSyncronizado } from '../../../realm/services/imovelService';
import { apagarMamiferoQueue, apagarMamiferoSyncronizado } from "../../../realm/services/mamiferosService";
import { apagarPeixeQueue, apagarPeixeSyncronizado } from "../../../realm/services/peixesService";
import { apagarPostoQueue, apagarPostoSaudeSyncronizado } from '../../../realm/services/postoService';
import { apagarReptilQueue, apagarReptilSyncronizado } from "../../../realm/services/repteisService";
import { apagarVegetacaoQueue, apagarVegetacaoSyncronizada } from "../../../realm/services/vegetacaoService";
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
          case "vegetacao":
            apagarVegetacaoQueue(idLocal);
            break;
          case "ave":
            apagarPeixeQueue(idLocal);
            break;
          case "fauna":
            apagarFaunaQueue(idLocal);
            break;
          case "reptil":
            apagarReptilQueue(idLocal);
            break;
          case "mamifero":
            apagarMamiferoQueue(idLocal);
            break;
          case "peixe":
            apagarPeixeQueue(idLocal);
            break;
        }
  
        setModalVisible(false);
        onDeleteSuccess();
        navigation.goBack();
  
      } else {
        const netInfoState = await NetInfo.fetch();
        const isConnected = await testConnection();
  
        if (netInfoState.isConnected && isConnected) {
          await connectionAPIDelete(`http://192.168.100.28:8080/${deleteEndpoint}/${id}`);
  
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
            case "vegetacao":
              apagarVegetacaoSyncronizada(id);
              break;
            case "ave":
              apagarAveSyncronizada(id);
              break;
            case "fauna":
              apagarFaunaSyncronizada(id);
              break;
            case "reptil":
              apagarReptilSyncronizado(id);
              break;
            case "mamifero":
              apagarMamiferoSyncronizado(id);
              break;
            case "peixe":
              apagarPeixeSyncronizado(id);
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
