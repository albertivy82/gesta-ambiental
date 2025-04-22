import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { MamiferosType } from '../../../shared/types/MamiferosType';
import { MamiferoDetailContainer } from '../styles/mamifero.style';


export interface MamiferosParam {
  mamifero: MamiferosType;
}

const MamiferoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, MamiferosParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <MamiferoDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Espécie', params.mamifero.especie || 'Não informado')}
          {renderField('Uso para Consumo', params.mamifero.usoConsumo || 'Não informado')}
          {renderField('Uso para Comércio', params.mamifero.usoComercio || 'Não informado')}
          {renderField('Uso para Criação', params.mamifero.usoCriacao || 'Não informado')}
          {renderField('Uso como Remédio', params.mamifero.usoRemedio || 'Não informado')}
          {renderField('Outros Usos', params.mamifero.usoOutros || 'Não informado')}
          {renderField('Problemas Relacionados', params.mamifero.problemasRelacionados || 'Não informado')}
          {renderField('Alimentação', params.mamifero.alimentacao || 'Não informado')}
          {renderField('Descrição Espontânea', params.mamifero.desricaoEspontanea || 'Não informado')}
          {renderField('Entrevistado ID', params.mamifero.entrevistado.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.mamifero.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </MamiferoDetailContainer>
    </ScrollView>
  );
}

export default MamiferoDetails;
