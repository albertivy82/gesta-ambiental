import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";
import Text from "../text/Text"; // Seu componente de texto padronizado
import { theme } from "../../themes/theme";
import { textTypes } from "../text/textTypes";

interface RenderTimePickerProps {
  label: string;
  hour: number | null;
  minute: number | null;
  onChangeHour: (value: number | null) => void;
  onChangeMinute: (value: number | null) => void;
}

export function RenderTimePicker({
  label,
  hour,
  minute,
  onChangeHour,
  onChangeMinute,
}: RenderTimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 a 23
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 a 59

  return (
    <View style={{ marginVertical: 20 }}>
      <View style={{ backgroundColor: '#808080', padding: 4, borderRadius: 4 }}>
        <Text
          margin="0px 0px 4px 8px"
          color={theme.colors.whiteTheme.white}
          type={textTypes.SUB_TITLE_BOLD}
          style={{
            textAlign: "justify",
            flexWrap: "wrap",
          }}
        >
          {label}
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Picker
            selectedValue={hour}
            onValueChange={(value) => onChangeHour(value as number | null)}
            style={{ color: theme.colors.mainTheme.black }}
          >
            <Picker.Item label="Hora" value={null} />
            {hours.map((h) => (
              <Picker.Item key={h} label={h.toString().padStart(2, "0")} value={h} />
            ))}
          </Picker>
        </View>

        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={minute}
            onValueChange={(value) => onChangeMinute(value as number | null)}
            style={{ color: theme.colors.mainTheme.black }}
          >
            <Picker.Item label="Minuto" value={null} />
            {minutes.map((m) => (
              <Picker.Item key={m} label={m.toString().padStart(2, "0")} value={m} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}
