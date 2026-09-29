import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import FormSection from '../../../shared/components/FormSection';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { imovelBody } from '../../../shared/types/imovelType';
import EditBenfeitoriaConfirmation from './UseEditBenfeitoria';



interface BenfeitoriaSectionProps {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  title?: string;
  children?: React.ReactNode;
  actionsEnabled?: boolean;
}

const BenfeitoriaSection = ({
  entrevistado,
  imovel,
  benfeitoria,
  children,
  actionsEnabled = true,
  title = 'C - Construções e estruturas do imóvel',
}: BenfeitoriaSectionProps) => {

const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.2,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ])
  );

  animation.start();

  return () => animation.stop();
}, [pulseAnim]);


  return (
    <View style={{ width: '100%' }}>
      <FormSection
        title={title}
        helperText="Toque para visualizar"
        summary={
                <View>
                  <Text style={{ color: 'gray' }}>
                    {benfeitoria.tipoBenfeitoria || 'Tipo não informado'}
                    {` `}
                    {benfeitoria.funcao || 'Função não informada'}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <Animated.View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 5,
                        backgroundColor: '#0a7e19',
                        marginRight: 7,
                        opacity: pulseAnim,
                      }}
                    />

                    <Text
                      style={{
                        color: '#0a7e19',
                        fontWeight: 'bold',
                        flexShrink: 1,
                      }}
                    >
                      ATENÇÃO: Verifique se há levantamentos pendentes sobre esta construção 👇
                    </Text>
                  </View>
                </View>
          }
      >

        <Text
             style={{
              color: benfeitoria.sincronizado ? 'black' : 'red',
              fontWeight: 'normal',
              alignSelf: 'flex-end',
              }}
>
         {benfeitoria.sincronizado ? 'Item Sincronizado ✓' : ' Item Não Nincronizado ⦻'}
         </Text>

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

        {actionsEnabled && (

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
                  <EditBenfeitoriaConfirmation
                    entrevistado={entrevistado}
                    imovel={imovel}
                    benfeitoria={benfeitoria} 
                    destino="NovaBenfeitoria" 
                    onEditSuccess={() => {
                      // Navegação atual preservada.
                    }}
                  />

                  <View
                    style={{
                      width: 1,
                      height: 22,
                      backgroundColor: '#dcdcdc',
                    }}
                  />

                  <DeleteConfirmation 
                    id={benfeitoria.id} 
                    idLocal={benfeitoria.idLocal}
                    deleteEndpoint="benfeitoria" 
                    onDeleteSuccess={() => {
                                  
                  }} 
                  />
                </View>

                )}

        {children}
      </FormSection>
    </View>
  );
};

export default BenfeitoriaSection;