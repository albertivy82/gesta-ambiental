import { NavigationProp, ParamListBase, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { useEscolas } from '../hooks/useEscolas';
import { useEntrevistados } from '../hooks/useEntrevistados';
import { usePostos } from '../hooks/usePostos';
import { LocalidadeContainer } from '../styles/Localidade.style';
import EditConfirmation from '../ui-components/UseEditLocalidade';
import QuadroDeItens from '../ui-components/quadroDeItens';
import { getEscolas } from '../../../realm/services/escolaService';
import { getEntrevistados } from '../../../realm/services/entrevistado';
import { getPostos } from '../../../realm/services/postoService';
import Localidade from '../../localidades';
import { useCallback } from 'react';

export interface LocalidadeParam {
  localidade: LocalidadeType;
}



//BLOCO IMOVEL
export const entrevistadosDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('Entrevistados', {localidadeId})
}


export const NovoEntrevistado = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('NovoEntrevistado', {localidadeId})
}

//BLOCO ESCOLAS
export const escolasDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('Escolas', {localidadeId})
}

export const NovaEscolaDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('NovaEscola', {localidadeId})
}

//BLOCO POSTOS
export const postosDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('Postos', {localidadeId})
}

export const NovoPostoDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('NovoPosto', {localidadeId})
}




const InfLocalidade = () => {

      const navigation = useNavigation<NavigationProp<ParamListBase>>();
      const { params } = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
      const { localidade } = params;
      const {contagemEscolas} = useEscolas(localidade.id);
      const {contagemPostos} = usePostos(localidade.id);     
      const {contagemEntrevistados} = useEntrevistados(localidade.id);
      
           
      
      //BLOCO IMOVEL
      const  handleGerenciaEntrevistados =  (localidadeId: number, contagemEntrevistados: number) =>{
       
        if(contagemEntrevistados>0){
          entrevistadosDaLocalidade(navigation.navigate, localidadeId);
        }else{
          NovoEntrevistado(navigation.navigate, localidadeId);
        }
      }

      useFocusEffect(
            useCallback(() => {
              getEscolas(localidade.id);
              getEntrevistados(localidade.id);
              getPostos(localidade.id);
      }, [localidade.id])
      );

       //BLOCO ESCOLAS
       const  handleGerenciaEscolas =  (localidadeId: number, contagemEntrevistados: number) =>{
        if(contagemEscolas>0){
          escolasDaLocalidade(navigation.navigate, localidadeId);
        }else{
          NovaEscolaDaLocalidade(navigation.navigate, localidadeId);
        }
      }

      //BLOCO POSTOS
       const  handleGerenciaPostos =  (localidadeId: number, contagemEntrevistados: number) =>{
        if(contagemEntrevistados>0){
          postosDaLocalidade(navigation.navigate, localidadeId);
        }else{
          NovoPostoDaLocalidade(navigation.navigate, localidadeId);
          }
       }

           
      

        

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LocalidadeContainer>
        {/* Informação básica da localidade */}
        <View style={{ padding: 10, borderWidth: 1, borderColor: "#ff4500" }}>
          <Text type={textTypes.BUTTON_BOLD} color="#000000">Nome: {localidade.nome}</Text>
          <Text type={textTypes.BUTTON_BOLD} color="#000000">Município: {localidade.municipio}</Text>
          <Text type={textTypes.BUTTON_BOLD} color="#000000">Esfera: {localidade.esfera}</Text>
        </View>

                   
        <QuadroDeItens
          label="Escolas Cadastradas" 
          count={contagemEscolas} 
          onPress={() => handleGerenciaEscolas(localidade.id, contagemEscolas)}
          emptyMessage="Não há escolas cadastradas"
        />

        <QuadroDeItens
          label="Postos Cadastrados" 
          count={contagemPostos} 
          onPress={() => handleGerenciaPostos(localidade.id, contagemPostos)}
          emptyMessage="Não há postos cadastrados"
        />

         <QuadroDeItens
          label="Entrevistas" 
          count={contagemEntrevistados} 
          onPress={() => handleGerenciaEntrevistados(localidade.id, contagemEntrevistados)}
          emptyMessage="Não há Entrevistas Realizadas"
        />

      
      
           <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: "#808080", 
                      backgroundColor: '#000000'
                    }}>                     
                     <EditConfirmation 
                      localidade={localidade} 
                      destino="Localidade" 
                      onEditSuccess={() => {
                      
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={localidade.id} 
                      idLocal={undefined}
                      deleteEndpoint="localidade" 
                      onDeleteSuccess={() => {
                            
                      }} 
                      />
         </View>
    </LocalidadeContainer>
    </ScrollView>
  );
};

export default InfLocalidade;
