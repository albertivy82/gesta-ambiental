import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { getCoordenadas } from '../../../realm/services/coordenadaService';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { coordenadasBody } from '../../../shared/types/coordenadaBody';
import { useCoordenadas } from '../hooks/useCoordenadas';
import { useEscolas } from '../hooks/useEscolas';
import { useImoveis } from '../hooks/useImoveis';
import { usePostos } from '../hooks/usePostos';
import { LocalidadeContainer } from '../styles/Localidade.style';
import EditConfirmation from '../ui-components/UseEditLocalidade';
import QuadroDeItens from '../ui-components/quadroDeItens';

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
      const {coordenadas} = useCoordenadas(localidade.id);
      const {contagemEscolas} = useEscolas(localidade.id);
      const {contagemPostos} = usePostos(localidade.id);     
      const {contagemImoveis} = useImoveis(localidade.id);
      const [coordenadasRealm, setCorrdenadasRealm] = useState<coordenadasBody[]>([]);
      


      const handleCoordinatePress = (coordenada: coordenadasBody) => {
        console.log("Coordenada selecionada:", coordenada);
       
    };
      

    useEffect(()=>{
      if(coordenadas){
        const getCoordenadasRealm = getCoordenadas(localidade.id);
       
        setCorrdenadasRealm(getCoordenadasRealm);
      }
  }, [coordenadas]);
      
      //BLOCO IMOVEL
      const  handleGerenciaImoveis =  (localidadeId: number, contagemImoveis: number) =>{
       
        if(contagemImoveis>0){
         //pegar entrevistado
        imoveisDaLocalidade(navigation.navigate, localidadeId);
        }else{
        //novo entrevistado 
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

       const renderItemList = (items: coordenadasBody[], label: string, onItemPress: (item: coordenadasBody) => void) => {
        return (
            <View style={{ padding: 10, borderWidth: 1, borderColor: "#ff4500"}}>
                <Text type={textTypes.BUTTON_BOLD} color={"#000000"}>{label}</Text>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => onItemPress(item)}>
                            <Text type={textTypes.BUTTON_REGULAR} color={"#000000"}>
                                {item.latitude}, {item.longitude}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text type={textTypes.BUTTON_REGULAR} color={"#000000"}>Não há itens cadastrados</Text>
                )}
            </View>
        );
    };
    
      

        

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LocalidadeContainer>
        {/* Informação básica da localidade */}
        <View style={{ padding: 10, borderWidth: 1, borderColor: "#ff4500" }}>
          <Text type={textTypes.BUTTON_BOLD} color="#000000">Nome: {localidade.nome}</Text>
          <Text type={textTypes.BUTTON_BOLD} color="#000000">Município: {localidade.municipio}</Text>
          <Text type={textTypes.BUTTON_BOLD} color="#000000">Esfera: {localidade.esfera}</Text>
        </View>

        {renderItemList(coordenadasRealm, 'Coordenadas', handleCoordinatePress)}
              
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
