import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { CreditoType } from "../../../shared/types/CreditoType";

export const detalharCredito = (navigate: NavigationProp<ParamListBase>['navigate'], credito: CreditoType) => {
  navigate('CreditoDetails', { credito });
}

const RenderItemCredito = ({ item }: { item: CreditoType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToCreditoDetail = (credito: CreditoType) => {
    detalharCredito(navigation.navigate, credito);
  }

  return (
    <TouchableOpacity onPress={() => handleGoToCreditoDetail(item)}>
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
          Valor de Crédito: {item.valor}
        </Text>

      </View>
    </TouchableOpacity>
  );
};

export default RenderItemCredito;
