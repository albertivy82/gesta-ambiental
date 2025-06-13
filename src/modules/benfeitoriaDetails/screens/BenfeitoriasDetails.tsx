import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { BenfeitoriaDetailContainer, Icones } from '../styles/BenfeitoriaDetails.style';
import { useMoradores } from '../hooks/useMorador';
import { useAtividadesProdutivas } from '../hooks/useAtividadeProdutiva';
import { useServicosComunicacao } from '../hooks/useSevicoComunicacao';
import { useAguas } from '../hooks/useAgua';
import { useCreditos } from '../hooks/useCredito';
import { useRendasOutrasFontes } from '../hooks/useRendaOutrasfontes';
import { usePescaArtesanal } from '../hooks/usePescaArtesanal';
import { renderField } from '../../../shared/components/input/renderFilds';
import EditConfirmation from '../ui-components/UseEditBenfeitoria';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';


export const handleNavigation = <T,>(
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  data: T | T[]
) => {
  navigate(route, { data });
};

export const handleNewEntry = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  benfeitoria: BenfeitoriaType
) => {
  navigate(route, { benfeitoria });
};

export interface BenfeitoriaParam {
 benfeitoria: BenfeitoriaType;
}



const BenfeitoriaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
 


  

   const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, data);
      } else {
        handleNewEntry(navigation.navigate, newRoute, params.benfeitoria);
      }
    };
  
        


  return (
    
       <ScrollView style={{ flex: 1 }}>
        <BenfeitoriaDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Tipo', params.benfeitoria.tipoBenfeitoria)}
                {renderField('Função', params.benfeitoria.funcao)}
                {renderField('Tipo do Solo', params.benfeitoria.impermeabilizacaoSolo)}
                {renderField('Área aproximada', params.benfeitoria.areaBenfeitoria.toString()+' km²')}
                {renderField('Pavimentos', params.benfeitoria.pavimentos.toString())}
                {renderField('Tipo de construção', params.benfeitoria.paredes)}
                {renderField('Origem dos materiais de construção', params.benfeitoria.origemAreiaDaConstrucao)}
                {renderField('Cobertura', params.benfeitoria.tipoCobertura)}
                {renderField('Esquadrias', params.benfeitoria.tipoEsquadrias)}
                {renderField('Alagamentos', params.benfeitoria.alagamentos)}
                {renderField('Época de alagamentos', params.benfeitoria.epocaOcorrencia)}
                {renderField('Efluentes', params.benfeitoria.efluentes)}
                {renderField('Resíduos', params.benfeitoria.residuos)}
                {renderField('Fonte de Energia', params.benfeitoria.fonteEnergia)}
                {renderField('Fonte de Enrgia para preparar alimentos', params.benfeitoria.energiaAlimentos)}
                {renderField('Informativo predominante', params.benfeitoria.informativoPredominante)}
              
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
                      benfeitoria={params.benfeitoria} 
                      destino="NovaBenfeitoria" 
                      onEditSuccess={() => {
                       
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.benfeitoria.id} 
                      idLocal={params.benfeitoria.idLocal}
                      deleteEndpoint="benfeitoria" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
            </View>



     
       </BenfeitoriaDetailContainer>
    </ScrollView>     
   
   
  );
}

export default BenfeitoriaDetails;