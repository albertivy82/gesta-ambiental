import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AtividadeProdutivaType } from '../../../shared/types/AtividadeProdutiva';
import { AtividadeDetailContainer } from '../styles/ativdade.style';



export interface AtividadeParam {
  atividade: AtividadeProdutivaType;
}

const AtividadeDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, AtividadeParam>>>();
  
  

  return (
    <ScrollView style={{ flex: 1 }}>
      <AtividadeDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Atividade', params.atividade.atividade || 'Não informado')}
          {renderField('Pessoas Envolvidas', params.atividade.pessoasEnvolvidas?.toString() || '0')}
          {renderField('Faturamento Mensal', `R$ ${params.atividade.faturamentoAtividadeMesTotal?.toFixed(2)}`)}
          {renderField('Benfeitoria ID', params.atividade.benfeitoria.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.atividade.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Atividade</Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: 1, height: '100%', borderWidth: 2.5, borderColor: theme.colors.grayTheme.gray100 }} />

          <TouchableOpacity onPress={() => null}>
            <View style={{ alignItems: 'center' }}>
              <Icon size={40} name='pencil2' color='blue' />
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Atividade</Text>
            </View>
          </TouchableOpacity>
        </View>

      </AtividadeDetailContainer>
    </ScrollView>
  );
}

export default AtividadeDetails;
