import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { RendaOutrasFontesType } from "../../../shared/types/rendaOutrasFontesType";


export const detalharRendaOutrasFontes = (navigate: NavigationProp<ParamListBase>['navigate'], rendaOutrasFontes: RendaOutrasFontesType) => {
  navigate('RendaOutrasFontesDetails', { rendaOutrasFontes })
}

const RenderItemRendaOutrasFontes = ({ item }: { item: RendaOutrasFontesType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToRendaOutrasFontesDetail = (rendaOutrasFontes: RendaOutrasFontesType) => {
    detalharRendaOutrasFontes(navigation.navigate, rendaOutrasFontes);
  }

  return (
    <TouchableOpacity onPress={() => handleGoToRendaOutrasFontesDetail(item)}>
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
          Rendimento por mês: {item.rendaMesTotal}
        </Text>
        
        
        
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemRendaOutrasFontes;
