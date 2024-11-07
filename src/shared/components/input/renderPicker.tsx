import { Picker } from "@react-native-picker/picker"; 
import { View } from "react-native";
import Text from "../text/Text"; // Importação do seu componente de texto padronizado
import { theme } from "../../themes/theme";
import { textTypes } from "../text/textTypes";

// Tipos das props
interface RenderPickerProps<T> {
  label: string;
  selectedValue: T | null;
  onValueChange: (value: T | null) => void;
  options: (T | null)[];
}

// Componente tipado
export function RenderPicker<T extends string | number>({ label, selectedValue, onValueChange, options }: RenderPickerProps<T>) {
  return (
    <View style={{ marginVertical: 20 }}>

      <View style={{ backgroundColor: '#808080', padding: 4, borderRadius: 4 }}>
        <Text margin="0px 0px 4px 8px"
              color={theme.colors.whiteTheme.white}
              type={textTypes.SUB_TITLE_BOLD}>
        {label}
        </Text>
        </View>
      
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.whiteTheme.white }}>
        <Picker selectedValue={selectedValue} onValueChange={(value) => onValueChange(value as T | null)}>
          <Picker.Item label={`Selecione uma opção...`} color="black" value={null} />
          {options.map((option) => (
            <Picker.Item key={option?.toString()} label={option?.toString() || ""} value={option} />
          ))}
        </Picker>
      </View>
    </View>
  );
}
