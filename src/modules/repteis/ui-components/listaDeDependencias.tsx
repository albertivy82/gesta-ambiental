import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { DependenciaType } from '../../../shared/types/DependenciasType';
import { Row } from '../styles/Reptil.style';
import { UseDeletarRegistro } from '../hooks/useInputVegetacao';



const RenderItem = ({ item }: { item: DependenciaType}) => {

  const handleCadstrarDependencia= async (id:number)=>{
    try{
    await  UseDeletarRegistro(id)
    }catch (error){
      console.error(error)

    }
  }



 return (
       
           <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
                  <Row>
                      <Text
                      type={textTypes.BUTTON_REGULAR}
                      color={theme.colors.blueTheme.blue1}
                      >
                        id: {item.id}
                      </Text>
                    
                    
                    <Text
                      type={textTypes.BUTTON_REGULAR}
                      color={theme.colors.blueTheme.blue1}
                    >
                      Depedência: {item.dependencia}
                    </Text>

                    <Text
                      type={textTypes.BUTTON_REGULAR}
                      color={theme.colors.blueTheme.blue1}
                    >
                      Quantidade: {item.quantidade}
                    </Text>
                </Row>
                
                <TouchableOpacity onPress={() => handleCadstrarDependencia(item.id)}>
                <Text
                  type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.redTheme.red}
                >
                  Apagar registro
                </Text>
                </TouchableOpacity>
      
          </View>
          
       
      );
};

export default RenderItem;
