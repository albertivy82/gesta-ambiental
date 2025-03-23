import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { MamiferosType } from "../../../shared/types/MamiferosType";

export const detalharMamifero = (
  navigate: NavigationProp<ParamListBase>['navigate'],
  mamifero: MamiferosType
) => {
  navigate('MamiferoDetails', { mamifero });
};

const RenderItemMamifero = ({ item }: { item: MamiferosType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToMamiferoDetail = (mamifero: MamiferosType) => {
    detalharMamifero(navigation.navigate, mamifero);
  };

  return (
    <TouchableOpacity onPress={() => handleGoToMamiferoDetail(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR}>Espécie: {item.especie}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Consumo: {item.usoConsumo}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Comércio: {item.usoComercio}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso para Criação: {item.usoCriacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso como Remédio: {item.usoRemedio}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Outros Usos: {item.usoOutros}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Problemas Relacionados: {item.problemasRelacionados}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Alimentação: {item.alimentacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Descrição Espontânea: {item.desricaoEspontanea}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemMamifero;
