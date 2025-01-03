import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { useEscolas } from '../hooks/useEscolas';
import { useImoveis } from '../hooks/useImoveis';
import { usePostos } from '../hooks/usePostos';
import { LocalidadeContainer } from '../styles/Localidade.style';
import EditConfirmation from '../ui-components/UseEditLocalidade';
import QuadroDeItens from '../ui-components/quadroDeItens';

export interface LocalidadeParam {
  localidade: LocalidadeType;
}



//BLOCO IMOVEL
export const imoveisDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number, idsImoveis: number[])=>{
  navigate('Imovel', {localidadeId, idsImoveis})
}

/*
export const NovoImoveisDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('NovoImovel', {localidadeId})
}
*/
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
      const {contagemImoveis, idsImoveis} = useImoveis(localidade.id);
      
      
  
      
      
      //BLOCO IMOVEL
      const  handleGerenciaImoveis =  (localidadeId: number, contagemImoveis: number) =>{
       
        if(contagemImoveis>0){
         //pegar entrevistado
        imoveisDaLocalidade(navigation.navigate, localidadeId, idsImoveis || []);
        }else{
        //novo entrevistado 
        console.log(localidadeId)
        NovoEntrevistado(navigation.navigate, localidadeId)
        //NovoImoveisDaLocalidade(navigation.navigate, localidadeId);
        }
      }

       //BLOCO ESCOLAS
       const  handleGerenciaEscolas =  (localidadeId: number, contagemImoveis: number) =>{
        if(contagemImoveis>0){
          escolasDaLocalidade(navigation.navigate, localidadeId);
        }else{
          NovaEscolaDaLocalidade(navigation.navigate, localidadeId);
        }
      }

      //BLOCO POSTOS
       const  handleGerenciaPostos =  (localidadeId: number, contagemImoveis: number) =>{
        if(contagemImoveis>0){
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
          label="Imóveis Cadastrados" 
          count={contagemImoveis} 
          onPress={() => handleGerenciaImoveis(localidade.id, contagemImoveis)}
          emptyMessage="Não há imóveis cadastrados"
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
