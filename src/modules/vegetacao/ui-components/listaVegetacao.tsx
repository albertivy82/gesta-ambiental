import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { VegetacaoType } from "../../../shared/types/VegetacaoType";

export const detalharVegetacao = (navigate: NavigationProp<ParamListBase>['navigate'], vegetacao: VegetacaoType) => {
  navigate('VegetacaoDetails', { vegetacao });
};

const RenderItemVegetacao = ({ item }: { item: VegetacaoType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleGoToVegetacaoDetail = (vegetacao: VegetacaoType) => {
    detalharVegetacao(navigation.navigate, vegetacao);
  };

  return (
    <TouchableOpacity onPress={() => handleGoToVegetacaoDetail(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR}>Espécie: {item.especie}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso Medicinal: {item.usoMedicinal}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso Alimentação: {item.usoAlimentacao}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso Ornamental: {item.usoOrnamental}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Uso Comercial: {item.usoComercial}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Flor: {item.usaFlor}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Folha: {item.usaFolha}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Semente: {item.usaSemente}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Fruto: {item.usaFruto}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Casca: {item.usaCasca}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Raiz: {item.usaRaiz}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Usa Leite/Látex: {item.usoLeiteLatex}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Outros Usos: {item.outrosUsos}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Coleta em Local Público: {item.coletaLocalPublico}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Coleta por Cultivo: {item.coletaCultivo}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Coleta por Compra: {item.coletaCompra}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Coleta no Ambiente: {item.coletaAmbienteEspecifica}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Quem Ensinou o Uso: {item.quemEnsinouUso}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Repassa o Conhecimento: {item.repassaConhecimento}</Text>
        <Text type={textTypes.BUTTON_REGULAR}>Observações Espontâneas: {item.observacoesEspontaneas}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemVegetacao;
