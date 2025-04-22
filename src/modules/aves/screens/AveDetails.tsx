import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AvesType } from '../../../shared/types/AvesType';
import { AveDetailContainer } from '../styles/ave.style';


export interface AvesParam {
  ave: AvesType;
}

const AvesDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, AvesParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <AveDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Espécie', params.ave.especie || 'Não informado')}
          {renderField('Uso para Consumo', params.ave.useCosumo || 'Não informado')}
          {renderField('Uso para Comércio', params.ave.usoComercio || 'Não informado')}
          {renderField('Uso para Criação', params.ave.usoCriacao || 'Não informado')}
          {renderField('Uso como Remédio', params.ave.usoRemedio || 'Não informado')}
          {renderField('Outros Usos', params.ave.usoOutros || 'Não informado')}
          {renderField('Problemas Relacionados', params.ave.problemasRelacionados || 'Não informado')}
          {renderField('Ameaça Sofrida', params.ave.ameacaSofrida || 'Não informado')}
          {renderField('Local de Aglomeração', params.ave.localDeAglomeracao || 'Não informado')}
          {renderField('Importância da Espécie', params.ave.qualImpotanciaDaEespecie || 'Não informado')}
          {renderField('Alimentação', params.ave.alimentacao || 'Não informado')}
          {renderField('Descrição Espontânea', params.ave.descricaoEspontanea || 'Não informado')}
          {renderField('Entrevistado ID', params.ave.entrevistado.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.ave.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </AveDetailContainer>
    </ScrollView>
  );
}

export default AvesDetails;
