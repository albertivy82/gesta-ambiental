import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { VegetacaoType } from '../../../shared/types/VegetacaoType';
import { VegetacaoDetailContainer } from '../styles/vegetacao.style';

export interface VegetacaoParam {
  vegetacao: VegetacaoType;
}

const VegetacaoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, VegetacaoParam>>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <VegetacaoDetailContainer>
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
          {renderField('Espécie', params.vegetacao.especie || 'Não informado')}
          {renderField('Uso Medicinal', params.vegetacao.usoMedicinal || 'Não informado')}
          {renderField('Uso Alimentação', params.vegetacao.usoAlimentacao || 'Não informado')}
          {renderField('Uso Ornamental', params.vegetacao.usoOrnamental || 'Não informado')}
          {renderField('Uso Comercial', params.vegetacao.usoComercial || 'Não informado')}
          {renderField('Usa Flor', params.vegetacao.usaFlor || 'Não informado')}
          {renderField('Usa Folha', params.vegetacao.usaFolha || 'Não informado')}
          {renderField('Usa Semente', params.vegetacao.usaSemente || 'Não informado')}
          {renderField('Usa Fruto', params.vegetacao.usaFruto || 'Não informado')}
          {renderField('Usa Casca', params.vegetacao.usaCasca || 'Não informado')}
          {renderField('Usa Raiz', params.vegetacao.usaRaiz || 'Não informado')}
          {renderField('Uso de Leite/Látex', params.vegetacao.usoLeiteLatex || 'Não informado')}
          {renderField('Outros Usos', params.vegetacao.outrosUsos || 'Não informado')}
          {renderField('Coleta em Local Público', params.vegetacao.coletaLocalPublico || 'Não informado')}
          {renderField('Coleta por Cultivo', params.vegetacao.coletaCultivo || 'Não informado')}
          {renderField('Coleta por Compra', params.vegetacao.coletaCompra || 'Não informado')}
          {renderField('Coleta em Ambiente Específico', params.vegetacao.coletaAmbienteEspecifica || 'Não informado')}
          {renderField('Quem Ensinou o Uso', params.vegetacao.quemEnsinouUso || 'Não informado')}
          {renderField('Repassa Conhecimento', params.vegetacao.repassaConhecimento || 'Não informado')}
          {renderField('Observações Espontâneas', params.vegetacao.observacoesEspontaneas || 'Não informado')}
          {renderField('Entrevistado ID', params.vegetacao.entrevistado.id?.toString() || 'Não informado')}
          {renderField('Status de Sincronização', params.vegetacao.sincronizado ? 'Sincronizado' : 'Não sincronizado')}
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
      </VegetacaoDetailContainer>
    </ScrollView>
  );
}

export default VegetacaoDetails;
