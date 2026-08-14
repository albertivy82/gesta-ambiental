import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';

interface FilhoResumoProps {
  titulo: string;
  quantidade: number;
  onPress?: () => void;
}

const FilhoResumo = ({
  titulo,
  quantidade,
  onPress,
}: FilhoResumoProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 8,
          borderTopWidth: 1,
          borderTopColor: theme.colors.grayTheme.gray100,
        }}
      >
        <Text
          type={textTypes.BUTTON_BOLD}
          color={
            quantidade > 0
              ? theme.colors.grayTheme.gray80
              : theme.colors.blueTheme.blue1
          }
        >
          {titulo}
        </Text>

        <Text type={textTypes.BUTTON_REGULAR}>
          {quantidade > 0
            ? `${quantidade} registro(s)`
            : 'Nenhum registro cadastrado'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilhoResumo;