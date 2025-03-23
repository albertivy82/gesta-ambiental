import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { PeixesType } from "../../../shared/types/PeixesType";

export const detalharPeixe = (navigate: NavigationProp<ParamListBase>['navigate'], peixe: PeixesType) => {
  navigate('PeixeDetails', { peixe });
};

const RenderItemPeixe = ({ item }: { item: PeixesType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToPeixeDetail = (peixe: PeixesType) => {
    detalharPeixe(navigation.navigate, peixe);
  };

  return (
    <TouchableOpacity onPress={() => handleGoToPeixeDetail(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR}>Espécie: {item.especie}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Locais Especiais: {item.locaisEspeciais}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Locais de Alimentação: {item.locaisEspecificosAlimentacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Alimentação: {item.usoAlimnetacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Comércio: {item.usoComercio}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemPeixe;
