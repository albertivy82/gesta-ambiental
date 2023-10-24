import { useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import Text from '../../../shared/components/text/Text';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { Button, View, TouchableOpacity, ScrollView } from 'react-native';
import { LocalidadeContainer } from '../styles/Localidade.style';
import { Icon } from '../../../shared/components/icon/Icon';
import { connectionAPIDelete } from '../../../shared/functions/connection/connectionAPI';
import { coordenadasBody } from '../../../shared/types/coordenadaBody';
import { useCoordenadas } from '../hooks/useCoordenadas';
import { useEffect, useState } from 'react';
import { getCoordenadas } from '../../../realm/services/coordenadaService';
import useDeleteLocalidade from '../hooks/useDeleteLocalidade';
import { useImoveis } from '../hooks/useImoveis';

export interface LocalidadeParam {
  localidade: LocalidadeType;
}


//BLOCO COORDENADAS
export const novasCoorenadas = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) =>{
   navigate('Coordenadas', {localidadeId});
}

export const editarCoordenadas = (navigate: NavigationProp<ParamListBase>['navigate'], coordenadas: null) =>{
  navigate('Coordenadas', {coordenadas});
}

//BLOCO IMOVEL
export const imoveisDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('Imovel', {localidadeId})
}


const InfLocalidade = () => {

      const navigation = useNavigation<NavigationProp<ParamListBase>>();
      const { params } = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
      const { localidade } = params;
      const {coordenadas} = useCoordenadas(localidade.id);
      const {contagemImoveis, fetchImoveis} = useImoveis(localidade.id);
      const [coordenadasRealm, setCorrdenadasRealm] = useState<coordenadasBody[]>();
      const [ ContagemImoveis, setContagemImoveis] = useState<String>()
      const { deleteLocalidade } = useDeleteLocalidade(localidade.id);


      //inicializando listagens...
            useEffect(()=>{
                if(coordenadas){
                  const getCoordenadasRealm = getCoordenadas(localidade.id);
                 
                  setCorrdenadasRealm(getCoordenadasRealm);
                }
            }, [coordenadas]);

            
                   
     
     
     
      const handleDeleteLocalidade = () => {
        deleteLocalidade();
      };

      //BLOCO COORDENADAS
      const handleCoordenadasInserir =  (localidadeId: number) =>{
        novasCoorenadas(navigation.navigate, localidadeId);
      }
      const handleCoordenadasEditar =  (coordenadas: null) =>{
        editarCoordenadas(navigation.navigate, null);
      }
      
      //BLOCO IMOVEL
      const  handleGerenciaImoveis =  (localidadeId: number, contagemImoveis: number) =>{
        if(contagemImoveis>0){
        imoveisDaLocalidade(navigation.navigate, localidadeId);
        }
      }
      

        const renderField = (label: string, value: string[] | null) => {
          return (
            <View style={{ marginBottom: 10 }}>
              <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                {label}: {value && value.length > 0 ? value.join(', ') : 'Informação não cadastrada'}
              </Text>
            </View>
          );
        };

        const renderCoordenada = (label: string, values: coordenadasBody[] | null) => {
          return (
              <View style={{ marginBottom: 10 }}>
                  <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                      {label}:
              </Text>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                       {values && values.length > 0 ? values.map(coord => `${coord.latitude}, ${coord.longitude}\n`).join('') : 'Informação não cadastrada'}
            </Text>
              </View>
          );
      };

      const renderImovel = (label: string, values: number) => {
        return (
            <View style={{ marginBottom: 10 }}>
                <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                    {label}:
            </Text>
          <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                     {values && values > 0 ? values: 'Não há imóveis cadstrados'}
          </Text>
            </View>
        );
    };





  return (
    <ScrollView style={{ flex: 1 }}>
    <LocalidadeContainer>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
        {renderField('Nome', [localidade.nome])}
        {renderField('Município', [localidade.municipio])}
        {renderField('Esfera', [localidade.esfera])}
      </View>
      <View style={{ padding: 10, marginBottom: 10 }}>
        <Button title="Excluir Localidade" onPress={handleDeleteLocalidade} />
        <Button title="Editar Localidade" onPress={handleDeleteLocalidade} />
      </View>

      
      <TouchableOpacity onPress={() => handleCoordenadasEditar(null)}>
          <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
             {renderCoordenada('Coordenadas', coordenadasRealm as coordenadasBody[] )}
          </View>
      </TouchableOpacity>
     
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      <TouchableOpacity onPress={() => handleCoordenadasInserir(localidade.id)}>
          <Icon name="plus" size={10} color="blue">
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> 
                  adicionar
              </Text>
          </Icon>
      </TouchableOpacity>
      </View> 


      <TouchableOpacity>
          <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
                 {renderField('Postos de Saúde', null)}
          </View>
      </TouchableOpacity>
      
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      
      <TouchableOpacity>
            <Icon name="plus" size={10} color="blue">
                <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> 
                    adicionar
                </Text>
            </Icon>
      </TouchableOpacity>
      </View> 

      <TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      {renderField('Escolas do local', null)}
      </View>
      </TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      <TouchableOpacity>
      <Icon name="plus" size={10} color="blue">
      <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> adicionar
      </Text>
      </Icon>
      </TouchableOpacity>
      </View> 

      <TouchableOpacity onPress={() => handleGerenciaImoveis(localidade.id, contagemImoveis)}>
          <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
             {renderImovel('Imoveis Cadastrados', contagemImoveis)}
          </View>
      </TouchableOpacity>
       
      
    </LocalidadeContainer>
    </ScrollView>
  );
};

export default InfLocalidade;
