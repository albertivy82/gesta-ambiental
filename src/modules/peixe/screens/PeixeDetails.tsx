import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { PeixesType } from '../../../shared/types/PeixesType';
import { PeixeDetailContainer } from '../styles/peixe.style';


export interface PeixesParam {
  peixe: PeixesType;
}

const PeixesDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, PeixesParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <PeixeDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Espécie', params.peixe.especie || 'Não informado')}
          {renderField('Locais Especiais', params.peixe.locaisEspeciais || 'Não informado')}
          {renderField('Locais Específicos de Alimentação', params.peixe.locaisEspecificosAlimentacao || 'Não informado')}
          {renderField('Uso para Alimentação', params.peixe.usoAlimnetacao || 'Não informado')}
          {renderField('Uso para Comércio', params.peixe.usoComercio || 'Não informado')}
          {renderField('Entrevistado ID', params.peixe.entrevistado.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.peixe.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </PeixeDetailContainer>
    </ScrollView>
  );
}

export default PeixesDetails;
