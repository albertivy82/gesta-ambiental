import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { getBenfeitoria } from "../../../realm/services/benfeitoriaService";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { CreditoType } from "../../../shared/types/CreditoType";

const RenderItemCredito = ({ item }: { item: CreditoType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  const id = typeof item.benfeitoria === 'number'
      ? item.benfeitoria
      : Number(item.benfeitoria);
      
      const benfeitoria = getBenfeitoria(id)
  
      const handleAcaoCredito = (credito: CreditoType) => {
     
      Alert.alert(
        'Ação sobre registro sobre Crédito',
        `O que você deseja fazer com este registro"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovoCredito', { credito, benfeitoria }); // reuso da tela para edição
            },
          },
          {
            text: 'Apagar',
            onPress: () => {
              setMostrarModalDelete(true);
            },
            style: 'destructive',
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    };

  return (
    <TouchableOpacity onPress={() => handleAcaoCredito(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10, padding: 10 }}>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>


        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Crédito: {item.nome}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Valor de Crédito: R$ {item.valor.toFixed(2)}
        </Text>

        {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="credito"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
                  )}  

      </View>
    </TouchableOpacity>
  );
};

export default RenderItemCredito;
