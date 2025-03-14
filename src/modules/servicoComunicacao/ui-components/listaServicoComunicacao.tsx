import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";


export const detalharServicoComunicacao = (navigate: NavigationProp<ParamListBase>['navigate'], servicoComunicacao: ServicosComunicacaoType) => {
    navigate('ServicoComunicacaoDetails', { servicoComunicacao })
}

const RenderItemServicoComunicacao = ({ item }: { item: ServicosComunicacaoType }) => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const handleGoToServicoComunicacaoDetail = (servicoComunicacao: ServicosComunicacaoType) => {
        detalharServicoComunicacao(navigation.navigate, servicoComunicacao);
    }

    return (
        <TouchableOpacity onPress={() => handleGoToServicoComunicacaoDetail(item)}>
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
                    Tipo de Serviço: {item.tipoServicoComunicacao}
                </Text>

                <Text
                    type={textTypes.BUTTON_REGULAR}
                    color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
                >
                    Operadora: {item.operadoraServicoComunicacao}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default RenderItemServicoComunicacao;
