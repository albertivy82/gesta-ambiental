import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { FaunaType } from "../../../shared/types/FaunaType";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import { useState } from "react";

export const RenderItemFauna = ({ item }: { item: FaunaType }) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  
  
    const handleAcaoFauna = (fauna: FaunaType) => {
     
      Alert.alert(
        'Ação sobre o este item de fauna',
        `O que você deseja fazer com "${fauna.especie}"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaFauna', { fauna }); // reuso da tela para edição
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
    <TouchableOpacity onPress={() => handleAcaoFauna(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR}>Espécie: {item.especie}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Ocorre na Mata: {item.ocorreMata}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Ocorre no Rio: {item.ocorreRio}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Ocorre no Lago: {item.ocorreLago}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Ocorre na Rua: {item.ocorreRua}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Ocorre no Quintal: {item.ocorreQuintal}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Outras Ocorrências: {item.outrasOcorrencias}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Frequência Atual: {item.frequenciaAtual}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Frequência Passada: {item.frequenciaPassada}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Tempo que não vê: {item.tempoQueNaoVe}</Text>
         {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="fauna"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
         )}
      </View>
      
    </TouchableOpacity>
  );
};

export default RenderItemFauna;
