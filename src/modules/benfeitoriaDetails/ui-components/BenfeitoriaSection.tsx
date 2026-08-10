import React from 'react';
import { View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';

interface BenfeitoriaSectionProps {
  benfeitoria: BenfeitoriaType;
  children?: React.ReactNode;
  title?: string;
}

const BenfeitoriaSection = ({
  benfeitoria,
  children,
  title = 'Benfeitoria',
}: BenfeitoriaSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title={title}
        helperText="Toque para visualizar"
        summary={
          <>
            <Text style={{ color: 'gray' }}>
              {benfeitoria.tipoBenfeitoria || 'Tipo não informado'}
              {` `}
              {benfeitoria.funcao || 'Função não informada'}
            </Text>
          </>
        }
      >
        {renderField('Tipo', benfeitoria.tipoBenfeitoria)}
        {renderField('Função', benfeitoria.funcao)}
        {renderField(
          'Tipo do Solo',
          benfeitoria.impermeabilizacaoSolo
        )}
        {renderField(
          'Área aproximada',
          benfeitoria.areaBenfeitoria != null
            ? `${benfeitoria.areaBenfeitoria} km²`
            : undefined
        )}
        {renderField(
          'Pavimentos',
          benfeitoria.pavimentos?.toString()
        )}
        {renderField(
          'Tipo de construção',
          benfeitoria.paredes
        )}
        {renderField(
          'Origem dos materiais de construção',
          benfeitoria.origemAreiaDaConstrucao
        )}
        {renderField(
          'Cobertura',
          benfeitoria.tipoCobertura
        )}
        {renderField(
          'Esquadrias',
          benfeitoria.tipoEsquadrias
        )}
        {renderField(
          'Alagamentos',
          benfeitoria.alagamentos
        )}
        {renderField(
          'Época de alagamentos',
          benfeitoria.epocaOcorrencia
        )}
        {renderField(
          'Efluentes',
          benfeitoria.efluentes
        )}
        {renderField(
          'Resíduos',
          benfeitoria.residuos
        )}
        {renderField(
          'Fonte de Energia',
          benfeitoria.fonteEnergia
        )}
        {renderField(
          'Fonte de Energia para preparar alimentos',
          benfeitoria.energiaAlimentos
        )}
        {renderField(
          'Informativo predominante',
          benfeitoria.informativoPredominante
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default BenfeitoriaSection;