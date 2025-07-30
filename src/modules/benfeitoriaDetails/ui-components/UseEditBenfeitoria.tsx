import NetInfo from "@react-native-community/netinfo";
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { testConnection } from '../../../shared/functions/connection/testConnection';
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";

interface EditConfirmationProps {
  benfeitoria: BenfeitoriaType;
  destino: string;
  onEditSuccess: () => void;
}

const EditConfirmation: React.FC<EditConfirmationProps> = ({ benfeitoria, destino, onEditSuccess }) => {

  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState<boolean>(false);

  const handleConfirmEdit = async () => {
    setLoading(true);
    try {
    
      navigation.navigate(destino, {benfeitoria});
      setModalVisible(false);
      onEditSuccess();
    } catch (error) {
      Alert.alert("Impossível editar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
       
        if (!!(await testConnection())) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão:', error);
        setDisable(true);
      }
    };

    checkConnection();
  }, []);

    
   
  

  return (
    <>
     <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={{ alignItems: 'center' }}>
          <Icon size={40} name='pencil2' color={disable ? '#aaa' : "#ff4500"} />
          <Text 
            type={textTypes.PARAGRAPH_LIGHT} 
            color={disable ? "#f0efef" : "#ff4500"} 
            style={{ alignItems: 'baseline' }}
          >
            Editar Item
          </Text>
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
            <Text type={textTypes.PARAGRAPH_LIGHT} color="#030303">Deseja realmente editar este item?</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#ff4500" />
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                  <Text type={textTypes.BUTTON_REGULAR} color="#0c0c0c">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmEdit} style={{ padding: 10 }}>
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

export default EditConfirmation;
