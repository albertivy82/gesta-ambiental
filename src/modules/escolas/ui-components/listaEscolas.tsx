import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { EscolaType } from "../../../shared/types/EscolaType";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";


const RenderItemEscola = ({ item }: { item: EscolaType}) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  const handleAcaoEscola = (escola: EscolaType) => {
     
      Alert.alert(
        'Ação sobre o escola',
        `O que você deseja fazer com "${escola.nome}"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaEscola', { escola }); // reuso da tela para edição
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
  <TouchableOpacity onPress={() => handleAcaoEscola(item)}>
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
      >
        Nome: {item.nome}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Iniciativa: {item.iniciativa}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Merenda: {item.merenda}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Transporte: {item.transporte}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Educação Ambiental: {item.educacaoAmbiental}
      </Text>

      {mostrarModalDelete && (
          
          <DeleteConfirmation
            id={item.id}
            idLocal={item.idLocal}
            deleteEndpoint="escola"
            onDeleteSuccess={() => {
            setMostrarModalDelete(false);
              
            }}
          />
        )}

    </View>
  </TouchableOpacity>
);
}
  
  export default RenderItemEscola;