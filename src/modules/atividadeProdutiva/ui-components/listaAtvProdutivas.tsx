import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";

export const detalharAtividade = (navigate: NavigationProp<ParamListBase>['navigate'], atividade: AtividadeProdutivaType) => {
  navigate('AtividadeDetails', { atividade });
}

const RenderItemAtividade = ({ item }: { item: AtividadeProdutivaType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToAtividadeDetail = (atividade: AtividadeProdutivaType) => {
    detalharAtividade(navigation.navigate, atividade);
  }

  return (
    <TouchableOpacity onPress={() => handleGoToAtividadeDetail(item)}>
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
          Atividade: {item.atividade || 'Não informado'}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Pessoas envolvidas: {item.pessoasEnvolvidas}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Faturamento/mês: R$ {item.faturamentoAtividadeMesTotal.toFixed(2)}
        </Text>

      </View>
    </TouchableOpacity>
  );
};

export default RenderItemAtividade;
