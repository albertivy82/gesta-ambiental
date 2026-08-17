import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { AguaType } from '../../../shared/types/AguaType';

interface AguaSectionProps {
  agua: AguaType;
  children?: React.ReactNode;
}

const AguaSection = ({
  agua,
  children,
}: AguaSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Água"
        helperText="Toque para visualizar"
        summary={
          <>
            <Text type={textTypes.BUTTON_REGULAR} >
              {agua.tipoDeFornecimento || 'Fonte não informada'}
            </Text>

            <Text type={textTypes.BUTTON_REGULAR}>
              {agua.qualidadeDaAgua || 'Qualidade não informada'}
            </Text>
          </>
        }
      >
        {renderField(
          'Tipo de fornecimento',
          agua.tipoDeFornecimento
        )}

        {renderField(
          'Qualidade da água',
          agua.qualidadeDaAgua
        )}

        {renderField(
          'Método de tratamento',
          agua.metodoTratamento
        )}

        {renderField(
          'Cor da água',
          agua.corDagua
        )}

        {renderField(
          'Cheiro da água',
          agua.cheiroDagua
        )}

        {renderField(
          'Sabor da água',
          agua.saborDagua
        )}

        {agua.profundidadePoco != null &&
          agua.profundidadePoco > 0 &&
          renderField(
            'Profundidade do poço',
            `${agua.profundidadePoco} m`
          )}

        {renderField(
          'Sincronizado',
          agua.sincronizado ? 'Sim' : 'Não'
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default AguaSection;
