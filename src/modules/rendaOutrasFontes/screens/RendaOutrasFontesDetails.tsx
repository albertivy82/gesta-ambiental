import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { RendaOutrasFontesType } from '../../../shared/types/RendaOutrasFontesType';
import { RendaOutrasFontesDetailContainer } from '../styles/rendaOutrasFontes.style';


export interface RendaOutrasFontesParam {
  rendaFonte: RendaOutrasFontesType;
}

const RendaOutrasFontesDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, RendaOutrasFontesParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <RendaOutrasFontesDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Fonte de Renda', params.rendaFonte.fonte || 'Não informado')}
          {renderField('Beneficiários', params.rendaFonte.beneficiarios?.toString() || '0')}
          {renderField('Renda Mensal Total', `R$ ${params.rendaFonte.rendaMesTotal?.toFixed(2)}`)}
          {renderField('Benfeitoria ID', params.rendaFonte.benfeitoria.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.rendaFonte.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Registro</Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: 1, height: '100%', borderWidth: 2.5, borderColor: theme.colors.grayTheme.gray100 }} />

          <TouchableOpacity onPress={() => null}>
            <View style={{ alignItems: 'center' }}>
              <Icon size={40} name='pencil2' color='blue' />
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Registro</Text>
            </View>
          </TouchableOpacity>
        </View>
      </RendaOutrasFontesDetailContainer>
    </ScrollView>
  );
}

export default RendaOutrasFontesDetails;
