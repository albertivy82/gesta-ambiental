import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { CreditoType } from '../../../shared/types/CreditoType';
import { CreditoDetailContainer } from '../styles/credito.style';

export interface CreditoParam {
  credito: CreditoType;
}

const CreditoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, CreditoParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <CreditoDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Nome', params.credito.nome || 'Não informado')}
          {renderField('Valor', `R$ ${params.credito.valor?.toFixed(2)}`)}
          {renderField('Benfeitoria ID', params.credito.benfeitoria.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.credito.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
          borderWidth: 2,
          borderColor: theme.colors.grayTheme.gray100
        }}>
          <TouchableOpacity onPress={() => null}>
            <View style={{ alignItems: 'center' }}>
              <Icon size={40} name='bin' color='red' />
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Crédito</Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: 1, height: '100%', borderWidth: 2.5, borderColor: theme.colors.grayTheme.gray100 }} />

          <TouchableOpacity onPress={() => null}>
            <View style={{ alignItems: 'center' }}>
              <Icon size={40} name='pencil2' color='blue' />
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Crédito</Text>
            </View>
          </TouchableOpacity>
        </View>
      </CreditoDetailContainer>
    </ScrollView>
  );
}

export default CreditoDetails;
