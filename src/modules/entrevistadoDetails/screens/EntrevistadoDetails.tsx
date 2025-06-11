import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { useAves } from '../hooks/useAve';
import { useFauna } from '../hooks/usefauna';
import { useImovel } from '../hooks/useImovel';
import { useMamiferos } from '../hooks/useMamifero';
import { usePeixes } from '../hooks/usePeixe';
import { useReptil } from '../hooks/UseReptil';
import { useVegetacoes } from '../hooks/useVegetacao';
import { EntrevistadoDetailContainer, Icones } from '../styles/EntrevistadoDetails.style';
import EditConfirmation from '../ui-component/UseEditEntrevistado';
import { imovelBody } from '../../../shared/types/imovelType';


// Para entidades MULTIPLAS (vegetacao, peixes, etc.)
export const handleNavegacaoFilhas = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  rota: string, 
  entrevistado: EntrevistadoType
) => {
  navigate(rota, { entrevistado });
};

// Para entidade ÚNICA (imóvel)
export const handleImovelNavigation = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  rota: string, 
  imovel?: imovelBody,
  entrevistado?: EntrevistadoType
) => {
  if (imovel) {
    navigate(rota, { imovel });
  } else if (entrevistado) {
    navigate("NovoImovel", { entrevistado });
  }
};





export interface EntrevistadoParam {
 entrevistado: EntrevistadoType;
}

const EntrevistadoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, EntrevistadoParam>>>();
  const {imovelPresente} = useImovel(params.entrevistado.id);
  const {vegetacao} = useVegetacoes(params.entrevistado.id);
  const {fauna} = useFauna(params.entrevistado.id);
  const {peixes} = usePeixes(params.entrevistado.id);
  const {mamiferos} = useMamiferos(params.entrevistado.id);
  const {aves} = useAves(params.entrevistado.id);
  const {reptil} = useReptil(params.entrevistado.id);

 
   // Alerta caso não haja imóveis
   useEffect(() => {
    if (!imovelPresente) {
      Alert.alert(
        "O entrevistado não possui imóveis cadastrados.",
        "Siga até o final da página para inserir dados do imóvel"
      );
    }
  }, [imovelPresente]);

  useEffect(() => {
    if ([fauna, vegetacao, peixes, mamiferos, aves].some((arr) => arr.length === 0)) {
      Alert.alert(
        "Atenção!",
        "Tem itens sobre a biodiversidade que não foram coletados. Confira os itens no final da página."
      );
    }
  }, [fauna, vegetacao, peixes, mamiferos, aves]);

  /**
   * Método genérico para decisão de navegação
   */
  const handleDecision = (
    data: any[] | undefined,
    detailRoute: string,
    newRoute: string
  ) => {
    if (data && data.length > 0) {
      handleNavegacaoFilhas(navigation.navigate, detailRoute, params.entrevistado);
    } else {
      handleNavegacaoFilhas(navigation.navigate, newRoute, params.entrevistado);
    }
  };
  
  return (
    
       <ScrollView style={{ flex: 1 }}>
        <EntrevistadoDetailContainer>
              <View style={{ padding: 10, borderWidth: 1,  borderColor: theme.colors.grayTheme.gray100 }}>
            {renderField('Nome', params.entrevistado.nome)}
            {renderField('Naturalidade', params.entrevistado.naturalidade)}
            {renderField('Data de Nascimento', params.entrevistado.nascimentoData)}
            {renderField('Sexo', params.entrevistado.sexo)}
            {renderField('Apelido', params.entrevistado.apelido)}
            {renderField('Escolaridade', params.entrevistado.escolaridade)}
            {renderField('Estado Civil', params.entrevistado.estadoCivil)}
            {renderField('Religião', params.entrevistado.religiao)}
            {renderField('Morador do imóvel', params.entrevistado.morador)}
            {renderField('Data de Chegada', params.entrevistado.dataChegada)}
            {renderField('Pretende Mudar', params.entrevistado.pretendeMudar)}
            {renderField('Motivo de Querer Mudar-se', params.entrevistado.motivoVontadeMudanca)}
            {renderField('Relação com a Área do Imóvel', params.entrevistado.relacaoAreaImovel)}
            {renderField('Relação com os Vizinhos', params.entrevistado.relacaoVizinhos)}
            {renderField('Tipo de Alimentação', params.entrevistado.tipoAlimentacao)}
            {renderField('Locais de Compras', params.entrevistado.localCompras)}
            {renderField('Como Cuida da Saúde da Família', params.entrevistado.comoCuidaSaudeFamilia)} 
            {renderField('Quantos assaltos já sofreu:', params.entrevistado.sofreuAssaltos?.toString())}
            {renderField('Quantos assaltos já presenciou:', params.entrevistado.presenciouAssalto?.toString())}
            {renderField('Problemas de Violência no Local', params.entrevistado.problemasDeViolenciaLocal)}
            {renderField('Instituição Conhecida', params.entrevistado.instituicaoConhecida)} 
            {renderField('Importância de Proteger o Meio Ambiente', params.entrevistado.importanciaDeProtegerAmbiente)} 
            {renderField('Importância de Proteger a Fauna', params.entrevistado.importanciaDeProtegerFauna)} 
            {renderField('Qual Espaço Precisa ser Preservado', params.entrevistado.qualEspacoPrecisaSerPreservado)}
            {renderField('Problemas Relacionados ao Meio Ambiente', params.entrevistado.problemasRelacionadosAoAmbiente)}
            {renderField('Conhece UCs', params.entrevistado.conheceUcs)}
            {renderField('Conhece Proposta de UC', params.entrevistado.conheceUcProposta)}
            {renderField('Conhece Área da UC', params.entrevistado.conheceAreaUc)}
            {renderField('Utiliza Área da UC', params.entrevistado.utilizaAreaUc)}
            {renderField('Proposta de Melhoria da Área', params.entrevistado.propostaMelhorarArea)}
            {renderField('Indicado para Consulta Pública', params.entrevistado.indicadoConsultaPublica)}
            {renderField('Contato do Indicado', params.entrevistado.contatoIndicadoConsultaPublica)}

            </View>

            

            <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: "#808080", 
                      backgroundColor: '#000000'
                    }}>                     
                     <EditConfirmation 
                      entrevistado={params.entrevistado} 
                      destino="NovoEntrevistado" 
                      onEditSuccess={() => {
                       //voltar para listagem de entrevistados
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.entrevistado.id} 
                      idLocal={params.entrevistado.idLocal}
                      deleteEndpoint="entrevistado" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
            </View>

            <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                 
          </View>
                
          <TouchableOpacity
                 onPress={() => handleImovelNavigation(navigation.navigate, "ImovelDetail", imovelPresente, params.entrevistado)}>
                  {imovelPresente ? (
                    <View style={{ alignItems: 'center' }}> 
                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                        Imóvel Cadastrado
                      </Text>
                      <View style={{ marginTop: 10 }}>  
                      {renderField('  Imóvel Cadastrado',
                      `Documentação: ${imovelPresente.documentacaoImovel ?? 
                        'Não informado'}\nSincronizado: ${imovelPresente.sincronizado ? 'Sim' : 'Não'}`
                        )}

                      </View>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                      padding: 10,
                      borderWidth: 2, 
                      borderColor: theme.colors.grayTheme.gray100 
                    }}>
                      <Icon size={30} name='home3' color='red' />
                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.redTheme.red}> Adicionar Imovel</Text>
                  </View>
                  )}
        </TouchableOpacity>

         

        <TouchableOpacity onPress={() => handleDecision(vegetacao, "VegetacaoLista", "NovaVegetacao")}>
          <View style={{
            alignItems: 'stretch',
            flexDirection: 'row',
            padding: 10,
            borderWidth: 2,
            borderColor: theme.colors.grayTheme.gray100
          }}>
            <Icon size={30} name='leaf' color='green' />
            <Text
              type={textTypes.BUTTON_BOLD}
              color={vegetacao.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
              style={{ marginLeft: 10 }}
            >
              {vegetacao.length > 0
                ? `Vegetações registradas: ${vegetacao.length}`
                : 'Vegetação'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDecision(peixes, "PeixesLista", "NovoPeixe")}>
            <View style={{
              alignItems: 'stretch',
              flexDirection: 'row',
              padding: 10,
              borderWidth: 2,
              borderColor: theme.colors.grayTheme.gray100
            }}>
              <Icones resizeMode="contain" source={require('../../../assets/images/peixes.png')} />
              <Text
                type={textTypes.BUTTON_BOLD}
                color={peixes.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                style={{ marginLeft: 10 }}
              >
                {peixes.length > 0 ? `Peixes registrados: ${peixes.length}` : 'Peixes'}
              </Text>
            </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDecision(mamiferos, "Mamiferos", "NovoMamifero")}>
        <View style={{
          alignItems: 'stretch',
          flexDirection: 'row',
          padding: 10,
          borderWidth: 2,
          borderColor: theme.colors.grayTheme.gray100
        }}>
          <Icones resizeMode="contain" source={require('../../../assets/images/macaco.png')} />
          <Text
            type={textTypes.BUTTON_BOLD}
            color={mamiferos.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
            style={{ marginLeft: 10 }}
          >
            {mamiferos.length > 0 ? `Mamíferos registrados: ${mamiferos.length}` : 'Mamíferos'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDecision(fauna, "FaunaLista", "NovaFauna")}>
        <View style={{
          alignItems: 'stretch',
          flexDirection: 'row',
          padding: 10,
          borderWidth: 2,
          borderColor: theme.colors.grayTheme.gray100
        }}>
          <Icones resizeMode="contain" source={require('../../../assets/images/fauna.png')} />
          <Text
            type={textTypes.BUTTON_BOLD}
            color={fauna.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
            style={{ marginLeft: 10 }}
          >
            {fauna.length > 0 ? `Fauna registrada: ${fauna.length}` : 'Fauna'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDecision(aves, "AvesLista", "NovaAve")}>
        <View style={{
          alignItems: 'stretch',
          flexDirection: 'row',
          padding: 10,
          borderWidth: 2,
          borderColor: theme.colors.grayTheme.gray100
        }}>
          <Icones resizeMode="contain" source={require('../../../assets/images/aves.png')} />
          <Text
            type={textTypes.BUTTON_BOLD}
            color={aves.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
            style={{ marginLeft: 10 }}
          >
            {aves.length > 0 ? `Aves registradas: ${aves.length}` : 'Aves'}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDecision(reptil, "RepteisLista", "NovoReptil")}>
        <View style={{
          alignItems: 'stretch',
          flexDirection: 'row',
          padding: 10,
          borderWidth: 2,
          borderColor: theme.colors.grayTheme.gray100
        }}>
          <Icones resizeMode="contain" source={require('../../../assets/images/reptil.png')} />
          <Text
            type={textTypes.BUTTON_BOLD}
            color={reptil.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
            style={{ marginLeft: 10 }}
          >
            {reptil.length > 0 ? `Répteis registrados: ${reptil.length}` : 'Répteis'}
          </Text>
        </View>
      </TouchableOpacity>


              
     
       </EntrevistadoDetailContainer>
    </ScrollView>     
   
   
  );
}

export default EntrevistadoDetails;