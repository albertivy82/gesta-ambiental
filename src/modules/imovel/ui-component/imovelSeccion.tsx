import React from 'react';
import { View } from 'react-native';
import FormSection from '../../../shared/components/FormSection';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { imovelBody } from '../../../shared/types/imovelType';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import EditImovelConfirmation from './UseEditImovel';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';

interface ImovelSectionProps {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  children?: React.ReactNode;
}

const ImovelSection = ({
  entrevistado,
  imovel,
  children,
}: ImovelSectionProps) => {
  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title="Imóvel cadastrado"
        helperText="Toque para visualizar"
        summary={
          <Text style={{ color: 'gray' }}>
            {imovel.rua || 'Rua não informada'}
            {imovel.numero ? `, nº ${imovel.numero}` : ''}
            {` • ${
              imovel.sincronizado
                ? 'Sincronizado'
                : 'Não sincronizado'
            }`}
          </Text>
        }
      >
        {renderField('Número', imovel.numero)}
        {renderField('Rua', imovel.rua)}
        {renderField('Referencial', imovel.referencial)}
        {renderField('Bairro', imovel.bairro)}
        {renderField('Latitude', imovel.latitude)}
        {renderField('Longitude', imovel.longitude)}
        {renderField(
          'Área do Imóvel (m²)',
          imovel.areaImovel?.toString()
        )}
        {renderField('Tipo de Solo', imovel.tipoSolo)}
        {renderField(
          'Vizinhos Confinantes',
          imovel.vizinhosConfinantes
        )}
        {renderField(
          'Situação Fundiária',
          imovel.situacaoFundiaria
        )}
        {renderField(
          'Documentação do Imóvel',
          imovel.documentacaoImovel
        )}
        {renderField(
          'Material utilizado no entorno do imóvel (Limites)',
          imovel.limites
        )}
        {renderField(
          'Linhas de Barco Disponíveis',
          imovel.linhasDeBarco
        )}
        {renderField(
          'Linhas de ônibus Disponíveis',
          imovel.linhasOnibus
        )}
        {renderField('Pavimentação', imovel.pavimentacao)}
        {renderField(
          'Iluminação Pública',
          imovel.iluminacaoPublica
        )}
        {renderField(
          'Equipamentos Urbanos Presentes',
          imovel.equipamentosUrbanos
        )}
        {renderField(
          'Espaços de Esporte e Lazer',
          imovel.espacosEsporteLazer
        )}
        {renderField(
          'Programa de Infraestrutura e Saneamento',
          imovel.programaInfraSaneamento
        )}

        <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: 5,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: '#dcdcdc',
            }}
          >
            <EditImovelConfirmation
              entrevistado={entrevistado}
              imovel={imovel}
              destino="NovoImovel"
              onEditSuccess={() => {}}
            />

            <View
              style={{
                width: 1,
                height: 22,
                backgroundColor: '#dcdcdc',
              }}
            />

            <DeleteConfirmation  
               id={imovel.id} 
               idLocal={imovel.idLocal}
               deleteEndpoint="imovel" 
               onDeleteSuccess={() => {
                            
             }} 
            />
          </View>

        {children}
      </FormSection>
    </View>
  );
};

export default ImovelSection;