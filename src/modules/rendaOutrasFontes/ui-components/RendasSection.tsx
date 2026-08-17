import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { RendaOutrasFontesType } from '../../../shared/types/RendaOutrasFontesType';

interface RendaOutrasFontesSectionProps {
  renda: RendaOutrasFontesType;
  children?: React.ReactNode;
}

const RendaOutrasFontesSection = ({
  renda,
  children,
}: RendaOutrasFontesSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Outras Fontes de Renda"
        helperText="Toque para visualizar"
        summary={
          <>
            <Text type={textTypes.BUTTON_BOLD}>
              {renda.fonte || 'Fonte não informada'}
            </Text>

            <Text type={textTypes.BUTTON_REGULAR}>
              {renda.beneficiarios} beneficiário(s)
            </Text>
          </>
        }
      >
        {renderField(
          'Fonte',
          renda.fonte?.toString()
        )}

        {renderField(
          'Beneficiários',
          renda.beneficiarios?.toString()
        )}

        {renderField(
          'Renda mensal total',
          renda.rendaMesTotal?.toString()
        )}

        {renderField(
          'Sincronizado',
          renda.sincronizado ? 'Sim' : 'Não'
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default RendaOutrasFontesSection;