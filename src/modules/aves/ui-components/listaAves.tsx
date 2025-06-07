import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AvesType } from "../../../shared/types/AvesType";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";


const RenderItemAve = ({ item }: { item: AvesType}) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();
const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  
  
    const handleAcaoAve = (ave: AvesType) => {
     
      Alert.alert(
        'Ação sobre o ave',
        `O que você deseja fazer com "${ave.especie}"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaAve', { ave }); // reuso da tela para edição
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
      <TouchableOpacity onPress={() => handleAcaoAve(item)}>
         <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
              
             <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
                situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
              </Text>
              
              <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Espécie: {item.especie}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Uso para consumo: {item.useCosumo}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Uso para comércio: {item.usoComercio}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Uso para criação: {item.usoCriacao}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Uso como remédio: {item.usoRemedio}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Outros usos: {item.usoOutros}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Problemas relacionados: {item.problemasRelacionados}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Ameaça sofrida: {item.ameacaSofrida}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Local de aglomeração: {item.localDeAglomeracao}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Importância da espécie: {item.qualImpotanciaDaEespecie}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Alimentação: {item.alimentacao}
            </Text>

            <Text
              type={textTypes.BUTTON_REGULAR}
              color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
            >
              Descrição espontânea: {item.descricaoEspontanea}
            </Text>
           
            {mostrarModalDelete && (
                  
                <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="ave"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
                  )}
              
        </View>
      </TouchableOpacity>
    );
  };
  
  export default RenderItemAve;