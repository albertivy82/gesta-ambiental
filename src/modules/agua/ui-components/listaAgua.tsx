import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AguaType } from "../../../shared/types/AguaType";


export const detalharAgua = (navigate: NavigationProp<ParamListBase>['navigate'], agua: AguaType) => {
  navigate('AguaDetails', { agua })
}

const RenderItemAgua = ({ item }: { item: AguaType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToAguaDetail = (agua: AguaType) => {
    detalharAgua(navigation.navigate, agua);
  }

  return (
    <TouchableOpacity onPress={() => handleGoToAguaDetail(item)}>
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
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemAgua;
