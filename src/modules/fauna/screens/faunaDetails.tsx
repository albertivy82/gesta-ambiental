import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { FaunaType } from '../../../shared/types/FaunaType';
import { FaunaDetailContainer } from '../styles/Fauna.style';

export interface FaunaParam {
  fauna: FaunaType;
}

const FaunaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, FaunaParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <FaunaDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Espécie', params.fauna.especie || 'Não informado')}
          {renderField('Ocorre na Mata', params.fauna.ocorreMata || 'Não informado')}
          {renderField('Ocorre no Rio', params.fauna.ocorreRio || 'Não informado')}
          {renderField('Ocorre no Lago', params.fauna.ocorreLago || 'Não informado')}
          {renderField('Ocorre na Rua', params.fauna.ocorreRua || 'Não informado')}
          {renderField('Ocorre no Quintal', params.fauna.ocorreQuintal || 'Não informado')}
          {renderField('Outras Ocorrências', params.fauna.outrasOcorrencias || 'Não informado')}
          {renderField('Frequência Atual', params.fauna.frequenciaAtual || 'Não informado')}
          {renderField('Frequência Passada', params.fauna.frequenciaPassada || 'Não informado')}
          {renderField('Tempo que Não Avista', params.fauna.tempoQueNaoVe || 'Não informado')}
          {renderField('Entrevistado ID', params.fauna.entrevistado.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.fauna.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </FaunaDetailContainer>
    </ScrollView>
  );
}

export default FaunaDetails;
