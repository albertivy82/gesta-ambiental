import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AguaType } from "../../../shared/types/AguaType";


const RenderItemAgua = ({ item }: { item: AguaType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  
      const handleAcaoAgua = (agua: AguaType) => {
     
      Alert.alert(
        'Ação sobre registro sobre a água',
        `O que você deseja fazer com este registro"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaAgua', { agua }); // reuso da tela para edição
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
    <TouchableOpacity onPress={() => handleAcaoAgua(item)}>
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
          Fonte de Água: {item.tipoDeFornecimento}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Qualidade da Água: {item.qualidadeDaAgua}
         </Text>

         <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
          >
          Método de tratamento da Água: {item.metodoTratamento}
          </Text>

          <Text
           type={textTypes.BUTTON_REGULAR}
            color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
          >
            Cor da Água: {item.corDagua}
          </Text>

          <Text
            type={textTypes.BUTTON_REGULAR}
            color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
          >
            Cheiro da Água: {item.cheiroDagua}
          </Text>

          <Text
            type={textTypes.BUTTON_REGULAR}
            color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
          >
            Sabor da Água: {item.saborDagua}
          </Text>

          {item.profundidadePoco!>0 &&(  
          <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
          >
          Profundidade do Proço: {item.profundidadePoco}
          </Text>
          )}

     
      {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="agua"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
    )}  
    
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemAgua;
