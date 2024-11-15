import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { connectionAPIDelete } from '../../../shared/functions/connection/connectionAPI';
import { Icon } from '../icon/Icon';
import Text from '../text/Text';
import { textTypes } from '../text/textTypes';
import { apagarImovelQueue, apagarImovelSyncronizado } from '../../../realm/services/imovelService';

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
      if(idLocal && id<0){
        
        switch (deleteEndpoint) {
          case "imovel":
            apagarImovelQueue(idLocal);
            break;
        }
              
      }else{
        //verificar se tem rede
        await await connectionAPIDelete(`http://192.168.100.28:8080/${deleteEndpoint}/${id}`);
       
        switch (deleteEndpoint) {
          case "imovel":
            apagarImovelSyncronizado(id);
            break;
        }
              
      }
      setModalVisible(false);
      onDeleteSuccess();
      navigation.goBack();
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
