import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';

import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { imovelBody } from '../../../shared/types/imovelType';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';

interface EditFilhoConfirmationProps<T> {
  registro: T;
  parametro: string;
  destino: string;

  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
}

const EditFilhoConfirmation = <T,>({
  registro,
  parametro,
  destino,
  entrevistado,
  imovel,
  benfeitoria,
}: EditFilhoConfirmationProps<T>) => {

  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleConfirmEdit = () => {
    navigation.navigate(destino, {
      entrevistado,
      imovel,
      benfeitoria,
      [parametro]: registro,
    });

    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          paddingVertical: 4,
          paddingHorizontal: 8,
        }}
      >
        <Text
          type={textTypes.BUTTON_REGULAR}
          color="#ff4500"
        >
          Editar
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.35)',
          }}
        >
          <View
            style={{
              width: 280,
              padding: 18,
              backgroundColor: 'white',
              borderRadius: 8,
            }}
          >
            <Text
              type={textTypes.PARAGRAPH_LIGHT}
              color="#030303"
            >
              Deseja editar este registro?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 8 }}
              >
                <Text
                  type={textTypes.BUTTON_REGULAR}
                  color="#555"
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmEdit}
                style={{
                  padding: 8,
                  marginLeft: 10,
                }}
              >
                <Text
                  type={textTypes.BUTTON_REGULAR}
                  color="#ff4500"
                >
                  Editar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditFilhoConfirmation;