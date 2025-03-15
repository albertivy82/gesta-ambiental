import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { PescaArtesanalType } from "../../../shared/types/PescaArtesanal";


export const detalharPescaArtesanal = (navigate: NavigationProp<ParamListBase>['navigate'], pescaArtesanal: PescaArtesanalType) => {
  navigate('PescaArtesanalDetails', { pescaArtesanal });
}

const RenderItemPescaArtesanal = ({ item }: { item: PescaArtesanalType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToPescaArtesanalDetail = (pescaArtesanal: PescaArtesanalType) => {
    detalharPescaArtesanal(navigation.navigate, pescaArtesanal);
  }

  return (
    <TouchableOpacity onPress={() => handleGoToPescaArtesanalDetail(item)}>
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
          Tipo de Pesca: {item.composicaoRancho}
        </Text>

       
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemPescaArtesanal;
