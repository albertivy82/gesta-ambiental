import { TouchableOpacity, View } from 'react-native';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { Icon } from '../../../shared/components/icon/Icon';

interface QuadroDeItensProps {
    contagemItem: number
    icone: string
    elemento: string
    onPress: () => void;
 
}


const QuadroDeItens = ({ contagemItem, icone, elemento, onPress }: QuadroDeItensProps) => {
  return (
           
        <TouchableOpacity onPress={onPress}>
        <View style={{
        padding: 10,
        borderWidth: 2,
        borderColor: theme.colors.grayTheme.gray100,
        backgroundColor: '#ff4500', // Fundo laranja
        borderRadius: 8, // Cantos arredondados
        alignItems: 'center', // Centraliza os itens horizontalmente
        }}>
          {/* Ícone e Título na Mesma Linha */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
            <Icon size={30} name= {icone} color='white' style={{ marginRight: 8 }} />
            <Text 
              type={textTypes.BUTTON_BOLD} 
              color={theme.colors.whiteTheme.white}
            
            >
              {elemento}
            </Text>
          </View>
                  {/* Contagem Abaixo, Centralizada */}
                  <Text 
                    type={textTypes.PARAGRAPH_LIGHT} 
                    color={theme.colors.mainTheme.black}
                    
                  >
                    {'Itens Cadastrados: ' + contagemItem.toString()}
                  </Text>
        </View>
        </TouchableOpacity>
  );
};

export default QuadroDeItens;
