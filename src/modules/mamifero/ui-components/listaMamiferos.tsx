import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { MamiferosType } from "../../../shared/types/MamiferosType";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";

export const RenderItemMamifero  = ({ item }: { item: MamiferosType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  
  
    const handleAcaoMamifero = (mamifero: MamiferosType) => {
     
      Alert.alert(
        'Ação sobre o mamífero',
        `O que você deseja fazer com "${mamifero.especie}"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovoMamifero', { mamifero }); // reuso da tela para edição
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
    <TouchableOpacity onPress={() => handleAcaoMamifero(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Espécie: {item.especie}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#635757" : theme.colors.redTheme.red}
        >Local de incidência: {item.local}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Usos da espécie: {item.usoDaEspecie}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Porblemas causados pela espécie: {item.problemasGerados}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Alimentos da espécie: {item.alimentacao}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Outras informações: {item.desricaoEspontanea}</Text>
        
        {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                       id={item.id}
                       idLocal={item.idLocal}
                       deleteEndpoint="mamifero"
                       onDeleteSuccess={() => {
                       setMostrarModalDelete(false);}}
                    />
                    )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemMamifero;
