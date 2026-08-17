import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';

import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';

import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { imovelBody } from '../../../shared/types/imovelType';

interface FilhoResumoProps {
  titulo: string;
  registros: unknown[];
  newRoute: string;

  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;

  children?: React.ReactNode;
}

const FilhoResumo = ({
  titulo,
  registros,
  newRoute,
  entrevistado,
  imovel,
  benfeitoria,
  children,
}: FilhoResumoProps) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [aberto, setAberto] = useState(false);

  const quantidade = registros.length;

  const handleAdicionar = () => {
    navigation.navigate(newRoute, {
      entrevistado,
      imovel,
      benfeitoria,
    });
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (quantidade > 0) {
            setAberto(!aberto);
          } else {
            handleAdicionar();
          }
        }}
      >
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
            color={theme.colors.greenTheme.green}
          >
            {titulo}
          </Text>

          <Text type={textTypes.BUTTON_REGULAR}>
            {quantidade > 0
              ? `${quantidade} registro(s)`
              : 'Nenhum registro cadastrado - adicionar'}
          </Text>
        </View>
      </TouchableOpacity>

      {aberto && quantidade > 0 && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingBottom: 8,
          }}
        >
          {children}

          <TouchableOpacity
            onPress={handleAdicionar}
            style={{
              paddingVertical: 8,
              marginTop: 4,
            }}
          >
            <Text
              type={textTypes.BUTTON_REGULAR}
              color={theme.colors.blueTheme.blue1}
            >
              + Adicionar outro registro
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FilhoResumo;