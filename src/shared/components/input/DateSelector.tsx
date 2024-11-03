// DateSelector.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../../../shared/themes/theme';
import { textTypes } from '../../../shared/components/text/textTypes';
import { Icon } from '../icon/Icon';
import Text from "../text/Text";

interface DateSelectorProps {
  label: string;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ label, onDateChange }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <View >
      <View style={{ backgroundColor: '#808080', padding: 4, borderRadius: 4 }}>
        <Text margin="0px 0px 4px 8px"
              color={theme.colors.whiteTheme.white}
              type={textTypes.SUB_TITLE_BOLD}>
          {label}
        </Text>
      </View>
      {/* Botão para abrir o Date Picker */}
      <TouchableOpacity onPress={showDatePicker} style={{
        padding: 12,
        backgroundColor: '#E6E8FA',
        borderRadius: 5,
        //alignItems: 'center',
       
      }}>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon size={30} name='calendar' color={theme.colors.mainTheme.black} />
        <Text margin="0px 0px 0px 10px"  color={theme.colors.mainTheme.black} type={textTypes.PARAGRAPH_REGULAR}>
                Selecione a data
        </Text>
        </View>
       
       
      </TouchableOpacity>

      {/* Exibe a data selecionada */}
      {date && (
        <Text margin="0px 0px 0px 10px"  color={theme.colors.mainTheme.black} type={textTypes.BUTTON_REGULAR}>
             Data selecionada: {date.toLocaleDateString('pt-BR')}
        </Text>
      )}

      {/* DateTimePicker */}
      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
    </View>
  );
};

export default DateSelector;
