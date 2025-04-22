import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { ServicosComunicacaoType } from '../../../shared/types/ComunicacaoType';
import { ServicoComunicacaoDetailContainer } from '../styles/servicoComunicacao.style';


export interface ServicoComunicacaoParam {
  servico: ServicosComunicacaoType;
}

const ServicosComunicacaoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, ServicoComunicacaoParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <ServicoComunicacaoDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Tipo de Serviço', params.servico.tipoServicoComunicacao || 'Não informado')}
          {renderField('Operadora', params.servico.operadoraServicoComunicacao || 'Não informado')}
          {renderField('Benfeitoria ID', params.servico.benfeitoria.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.servico.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Serviço</Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: 1, height: '100%', borderWidth: 2.5, borderColor: theme.colors.grayTheme.gray100 }} />

          <TouchableOpacity onPress={() => null}>
            <View style={{ alignItems: 'center' }}>
              <Icon size={40} name='pencil2' color='blue' />
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Serviço</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ServicoComunicacaoDetailContainer>
    </ScrollView>
  );
}

export default ServicosComunicacaoDetails;
