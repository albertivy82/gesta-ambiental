import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AguaType } from '../../../shared/types/AguaType';
import { AguaDetailContainer } from '../styles/agua.style';


export interface AguaParam {
  agua: AguaType;
}

const AguaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, AguaParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <AguaDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Tipo de Fornecimento', params.agua.tipoDeFornecimento || 'Não informado')}
          {renderField('Qualidade da Água', params.agua.qualidadeDaAgua || 'Não informado')}
          {renderField('Método de Tratamento', params.agua.metodoTratamento || 'Não informado')}
          {renderField('Cor da Água', params.agua.corDagua || 'Não informado')}
          {renderField('Cheiro da Água', params.agua.cheiroDagua || 'Não informado')}
          {renderField('Sabor da Água', params.agua.saborDagua || 'Não informado')}
          {renderField('Profundidade do Poço', params.agua.profundidadePoco?.toString() || 'Não informado')}
          {renderField('Benfeitoria ID', params.agua.benfeitoria.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.agua.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </AguaDetailContainer>
    </ScrollView>
  );
}

export default AguaDetails;
