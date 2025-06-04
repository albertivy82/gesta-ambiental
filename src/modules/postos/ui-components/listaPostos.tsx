import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { PostoType } from "../../../shared/types/postoTypes";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import { useState } from "react";


const RenderItemPosto = ({ item }: { item: PostoType}) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();
const [mostrarModalDelete, setMostrarModalDelete] = useState(false);



  const handleAcaoPosto = (posto: PostoType) => {
    Alert.alert(
      'Ação sobre o posto',
      `O que você deseja fazer com "${posto.nome}"?`,
      [
        {
          text: 'Editar',
          onPress: () => {
            navigation.navigate('NovoPosto', { posto }); // reuso da tela para edição
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
      <TouchableOpacity onPress={() => handleAcaoPosto(item)}>
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
          Ambulatorial: {item.ambulatorial}
        </Text>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Urgência/Emergência: {item.urgenciaEmergencia}
        </Text>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Médicos por Turno: {item.medicosPorTurno}
        </Text>

        {mostrarModalDelete && (
          
          <DeleteConfirmation
            id={item.id}
            idLocal={item.idLocal}
            deleteEndpoint="posto-de-saude"
            onDeleteSuccess={() => {
             setMostrarModalDelete(false);
              
            }}
          />
        )}

    
      </View>
    </TouchableOpacity>
    
    );
  };
  
  export default RenderItemPosto;