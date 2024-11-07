import { View, TouchableOpacity } from 'react-native'; 
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { Icon } from '../../../shared/components/icon/Icon';

interface QuadroDeItensProps {
  label: string;
  count: number;
  onPress: () => void;
  emptyMessage: string;
}

const QuadroDeItens = ({ label, count, onPress, emptyMessage }: QuadroDeItensProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 10, borderWidth: 1, borderColor: "#ff4500" }}>
        <Text type={textTypes.BUTTON_BOLD} color="#000000">
          {label}
        </Text>
        
        <Text type={textTypes.BUTTON_REGULAR} color="#000000">
          {count > 0 ? `Quantidade de itens: ${count}` : emptyMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default QuadroDeItens;
