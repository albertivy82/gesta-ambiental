import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { RepteisType } from "../../../shared/types/RepteisType";


export const detalharReptil = (
  navigate: NavigationProp<ParamListBase>['navigate'],
  reptil: RepteisType
) => {
  navigate('ReptilDetails', { reptil });
};

const RenderItemReptil = ({ item }: { item: RepteisType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToReptilDetail = (reptil: RepteisType) => {
    detalharReptil(navigation.navigate, reptil);
  };

  return (
    <TouchableOpacity onPress={() => handleGoToReptilDetail(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR}>Espécie: {item.especie}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Local: {item.local}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Período: {item.periodo}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso: {item.uso}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Ameaçado: {item.ameacado}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Problemas Relacionados: {item.problemasRelacionados}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Caçado: {item.cacado}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Descrição Espontânea: {item.descricaoEspontanea}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemReptil;
