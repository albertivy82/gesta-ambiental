import {useRoute, RouteProp} from '@react-navigation/native'
import Text from "../../../shared/components/text/Text";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { View } from 'react-native';
import { LocalidadeContainer } from '../styles/Localidade.style';

export interface LocalidadeParam{
    localidade: LocalidadeType;
}

const InfLocalidade = () =>{
   const {params} = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
   const {localidade} = params;
   
   return(
    <LocalidadeContainer>
        <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                Nome: {localidade.nome}
            </Text>
     </View>
     <View style={{marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                Município: {localidade.municipio}
            </Text>
     </View>
     <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                Iniciativa: {localidade.esfera}
            </Text>
     </View>
     <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                cordenadas: {localidade.coordenadas}
            </Text>
     </View>
     <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                escolas: {localidade.escola}
            </Text>
     </View>
     
     <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                Postos de Saúde da Localidade: {localidade.posto}
            </Text>
     </View>
     <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                Imóveis da Localidade: {localidade.residencia}
            </Text>
     </View>
    </LocalidadeContainer>
    )
};

export default InfLocalidade;