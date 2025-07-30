import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { RendaOutrasFontesType } from "../../../shared/types/rendaOutrasFontesType";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import { getBenfeitoria } from "../../../realm/services/benfeitoriaService";


const RenderItemRendaOutrasFontes = ({ item }: { item: RendaOutrasFontesType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  
  const id = typeof item.benfeitoria === 'number'
      ? item.benfeitoria
      : Number(item.benfeitoria);
      
      const benfeitoria = getBenfeitoria(id)

      const handleAcaoAgua = (renda: RendaOutrasFontesType) => {
     
      Alert.alert(
        'Ação sobre registro sobre outras fontes de renda',
        `O que você deseja fazer com este registro"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaRendaOutrasFontes', { renda, benfeitoria }); // reuso da tela para edição
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
          Fonte de Renda: {item.fonte}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Total de beneficiários: {item.beneficiarios}
        </Text>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Rendimento por mês: R$ {item.rendaMesTotal.toFixed(2)}
        </Text>
    {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="outras-fontes-de-renda"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
                  )}       
        
        
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemRendaOutrasFontes;
