import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { MoradorType } from '../../../shared/types/MoradorType';

interface MoradorSectionProps {
  morador: MoradorType;
  children?: React.ReactNode;
}

const MoradorSection = ({
  morador,
  children,
}: MoradorSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Morador"
        helperText="Toque para visualizar"
        summary={
          <>
            <Text type={textTypes.BUTTON_BOLD}>
              {morador.perfil || 'Perfil não informado'}
            </Text>

            <Text type={textTypes.BUTTON_REGULAR}>
              {morador.idade} anos
              {morador.sexo ? ` • ${morador.sexo}` : ''}
            </Text>
          </>
        }
      >
        {renderField('Perfil', morador.perfil?.toString())}
        {renderField('Idade', morador.idade?.toString())}
        {renderField('Sexo', morador.sexo?.toString())}
        {renderField('Escolaridade', morador.escolaridade)}
        {renderField('Estado Civil', morador.estadoCivil)}
        {renderField('Estuda', morador.ondeEstuda)}
        {renderField('Trabalha', morador.trabalho)}
        {renderField('Religião', morador.religiao)}
        {renderField('Doenças', morador.doencas)}
        {renderField(
          'Sincronizado',
          morador.sincronizado ? 'Sim' : 'Não'
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default MoradorSection;