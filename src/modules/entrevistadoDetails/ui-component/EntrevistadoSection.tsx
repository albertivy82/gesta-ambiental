import React from 'react';
import { View } from 'react-native';
import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';

interface EntrevistadoSectionProps {
  entrevistado: EntrevistadoType;
  children?: React.ReactNode;
}

const EntrevistadoSection = ({
  entrevistado,
  children,
}: EntrevistadoSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Dados do entrevistado"
        helperText="Toque para visualizar"
        summary={
          <Text style={{ color: 'gray' }}>
            {entrevistado.nome || 'Nome não informado'}
            {entrevistado.idade
              ? ` • ${entrevistado.idade} anos`
              : ''}
            {entrevistado.apelido
              ? ` • ${entrevistado.apelido}`
              : ''}
          </Text>
        }
      >
        {renderField('Nome', entrevistado.nome)}
        {renderField('Naturalidade', entrevistado.naturalidade)}
        {renderField(
          'Idade do entrevistado',
          entrevistado.idade?.toString()
        )}
        {renderField('Sexo', entrevistado.sexo)}
        {renderField('Apelido', entrevistado.apelido)}
        {renderField('Escolaridade', entrevistado.escolaridade)}
        {renderField('Estado Civil', entrevistado.estadoCivil)}
        {renderField('Religião', entrevistado.religiao)}
        {renderField('Morador do imóvel', entrevistado.morador)}
        {renderField('Data de Chegada', entrevistado.dataChegada)}
        {renderField('Pretende Mudar', entrevistado.pretendeMudar)}
        {renderField(
          'Motivo de querer mudar-se',
          entrevistado.motivoVontadeMudanca
        )}
        {renderField(
          'Relação com a área do imóvel',
          entrevistado.relacaoAreaImovel
        )}
        {renderField(
          'Relação com os vizinhos',
          entrevistado.relacaoVizinhos
        )}
        {renderField(
          'Tipo de alimentação mais frequente',
          entrevistado.tipoAlimentacao
        )}
        {renderField(
          'Locais de compras',
          entrevistado.localCompras
        )}
        {renderField(
          'Como cuida da saúde da família',
          entrevistado.comoCuidaSaudeFamilia
        )}
        {renderField(
          'Serviços públicos deficitários',
          entrevistado.servicosDeficitarios
        )}
        {renderField(
          'Quantos assaltos já sofreu',
          entrevistado.sofreuAssaltos?.toString()
        )}
        {renderField(
          'Quantos assaltos já presenciou',
          entrevistado.presenciouAssalto?.toString()
        )}
        {renderField(
          'Problemas de violência no local',
          entrevistado.problemasDeViolenciaLocal
        )}
        {renderField(
          'Instituição conhecida',
          entrevistado.instituicaoConhecida
        )}
        {renderField(
          'Importância de proteger o meio ambiente',
          entrevistado.importanciaDeProtegerAmbiente
        )}
        {renderField(
          'Importância de proteger a fauna',
          entrevistado.importanciaDeProtegerFauna
        )}
        {renderField(
          'Qual espaço precisa ser preservado',
          entrevistado.qualEspacoPrecisaSerPreservado
        )}
        {renderField(
          'Problemas relacionados ao meio ambiente',
          entrevistado.problemasRelacionadosAoAmbiente
        )}
        {renderField('Conhece UCs', entrevistado.conheceUcs)}
        {renderField(
          'Conhece proposta de UC',
          entrevistado.conheceUcProposta
        )}
        {renderField(
          'Conhece área da UC',
          entrevistado.conheceAreaUc
        )}
        {renderField(
          'Utiliza área da UC',
          entrevistado.utilizaAreaUc
        )}
        {renderField(
          'Proposta de melhoria da área',
          entrevistado.propostaMelhorarArea
        )}
        {renderField(
          'Indicado para consulta pública',
          entrevistado.indicadoConsultaPublica
        )}
        {renderField(
          'Contato do indicado',
          entrevistado.contatoIndicadoConsultaPublica
        )}

        {children}
      </FormSection>
    </View>
  );
};

export default EntrevistadoSection;