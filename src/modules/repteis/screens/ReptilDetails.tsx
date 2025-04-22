import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { RepteisType } from '../../../shared/types/RepteisType';
import { ReptilDetailContainer } from '../styles/Reptil.style';


export interface RepteisParam {
  reptil: RepteisType;
}

const RepteisDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, RepteisParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <ReptilDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Espécie', params.reptil.especie || 'Não informado')}
          {renderField('Local', params.reptil.local || 'Não informado')}
          {renderField('Período', params.reptil.periodo || 'Não informado')}
          {renderField('Uso', params.reptil.uso || 'Não informado')}
          {renderField('Ameaçado', params.reptil.ameacado || 'Não informado')}
          {renderField('Problemas Relacionados', params.reptil.problemasRelacionados || 'Não informado')}
          {renderField('Caçado', params.reptil.cacado || 'Não informado')}
          {renderField('Descrição Espontânea', params.reptil.descricaoEspontanea || 'Não informado')}
          {renderField('Entrevistado ID', params.reptil.entrevistado.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.reptil.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </ReptilDetailContainer>
    </ScrollView>
  );
}

export default RepteisDetails;
