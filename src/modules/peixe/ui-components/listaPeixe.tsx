import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { PeixesType } from "../../../shared/types/PeixesType";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";


const RenderItemPeixe = ({ item }: { item: PeixesType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
    
    
    
      const handleAcaoPeixe = (peixe: PeixesType) => {
       
        Alert.alert(
          'Ação sobre o peixe',
          `O que você deseja fazer com "${peixe.especie}"?`,
          [
            {
              text: 'Editar',
              onPress: () => {
                navigation.navigate('NovoPeixe', { peixe }); // reuso da tela para edição
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
    <TouchableOpacity onPress={() => handleAcaoPeixe(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR}>Espécie: {item.especie}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Locais Especiais: {item.locaisEspeciais}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Locais de Alimentação: {item.locaisEspecificosAlimentacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Alimentação: {item.usoAlimnetacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Comércio: {item.usoComercio}</Text>
        {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="peixe"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
                  )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemPeixe;
