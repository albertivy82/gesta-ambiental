import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { RepteisType } from "../../../shared/types/RepteisType";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";


export const RenderItemReptil = ({ item }: { item: RepteisType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  
  
    const handleAcaoReptil = (reptil: RepteisType) => {
     
      Alert.alert(
        'Ação sobre o reptil',
        `O que você deseja fazer com "${reptil.especie}"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovoReptil', { reptil }); // reuso da tela para edição
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
    <TouchableOpacity onPress={() => handleAcaoReptil(item)}>
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
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Local: {item.local}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >espécie: {item.especie}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Local de incidência da espécie: {item.local}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Desova: {item.desova}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Local de desova: {item.localDesova}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Período de desova: {item.periodoDesova}</Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Usos da espécie: {item.usoDaEspecie}</Text>

          <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Ameaças sofridas pela espécie no local: {item.ameacaParaEspecie}</Text>
        
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Problemas causados pela espécie no local: {item.problemasGerados}</Text>
        
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >Descrição Espontânea: {item.descricaoEspontanea}</Text>
        
        {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                       id={item.id}
                       idLocal={item.idLocal}
                       deleteEndpoint="reptil"
                       onDeleteSuccess={() => {
                       setMostrarModalDelete(false);}}
                    />
                    )}

      </View>
    </TouchableOpacity>
  );
};

export default RenderItemReptil;
