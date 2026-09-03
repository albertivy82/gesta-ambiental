import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';

import BenfeitoriaSection from '../ui-component/BenfeitoriaSection';
import ImovelSection from '../../imovel/ui-component/imovelSeccion';
import { useBenfeitorias } from '../hooks/useBenfeitorias';
import { useImovel } from '../hooks/useImovel';
import { EntrevistadoDetailContainer } from '../styles/EntrevistadoDetails.style';
import EntrevistadoSection from '../ui-component/EntrevistadoSection';
import FilhasBenfeitoria from '../ui-component/FilhasBenfeitoria';

export interface EntrevistadoParam {
  entrevistado: EntrevistadoType;
}

const EntrevistadoDetails = () => {
  const navigation = useNavigation<any>();

  const { params } = useRoute<
    RouteProp<Record<string, EntrevistadoParam>, string>
  >();

  const entrevistado = params.entrevistado;
  const isFocused = useIsFocused();

  const {
    imovelPresente,
    loadingImovel,
  } = useImovel(entrevistado.id, isFocused);

  const podeBuscarBenfeitorias =
    isFocused &&
    !loadingImovel &&
    !!imovelPresente;

  const {
    benfeitoria,
    loadingBenfeitoria,
  } = useBenfeitorias(podeBuscarBenfeitorias, imovelPresente?.id);


  const podeBuscarFilhas =
    isFocused &&
    !loadingImovel &&
    !loadingBenfeitoria &&
    !!imovelPresente &&
    benfeitoria.length > 0;

  /*
  * A decisão só acontece depois que o useImovel termina
  * todo o fluxo de sincronização e consulta ao Realm.
  */
  useEffect(() => {
    if (loadingImovel || !isFocused) {
      return;
    }

    if (!imovelPresente) {
      navigation.replace('NovoImovel', {
        entrevistado,
      });
    }
  }, [
    loadingImovel,
    imovelPresente,
    isFocused,
    navigation,
    entrevistado,
  ]);

  console.log("benfeitoria", benfeitoria)


  useEffect(() => {
    if (!isFocused) return;
    if (!imovelPresente) return;
    if (loadingBenfeitoria) return;

    if (benfeitoria.length === 0) {
      navigation.replace('NovaBenfeitoria', {
        entrevistado,
        imovel: imovelPresente,
      });
    }
  }, [
    isFocused,
    imovelPresente,
    loadingBenfeitoria,
    benfeitoria,
    entrevistado,
    navigation,
  ]);
  /*
   * Mantém a tela retida enquanto o hook:
   * 1. sincroniza a fila;
   * 2. consulta a API, quando possível;
   * 3. consulta o Realm.
   */
  if (loadingImovel) {
    return (
      <EntrevistadoDetailContainer
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          animating
          size={80}
          color="#318d0f"
        />

        <Text
          type={textTypes.BUTTON_REGULAR}
          color="#000"
          margin="20px 0 0 0"
        >
          Sincronizando dados...
        </Text>
      </EntrevistadoDetailContainer>
    );
  }

  /*
   * Evita mostrar rapidamente a tela vazia durante
   * o redirecionamento para NovoImovel.
   */
  if (!imovelPresente) {
    return (
      <EntrevistadoDetailContainer
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          animating
          size={50}
          color="#0b891a"
        />

        <Text
          type={textTypes.BUTTON_REGULAR}
          color="#000"
          margin="20px 0 0 0"
        >
          Abrindo cadastro do imóvel...
        </Text>
      </EntrevistadoDetailContainer>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <EntrevistadoDetailContainer>
        <EntrevistadoSection entrevistado={entrevistado}>

        </EntrevistadoSection>

        <ImovelSection entrevistado={entrevistado} imovel={imovelPresente} >

        </ImovelSection>



        {benfeitoria.map((item, index) => (
          <BenfeitoriaSection
            key={item.idLocal || item.id}
            entrevistado={entrevistado}
            imovel={imovelPresente}
            benfeitoria={item}
            title={`C - Construção do Imóvel ${index + 1}`}
          >
            {/* botões e, depois, os filhos desta benfeitoria */}

            <FilhasBenfeitoria
              entrevistado={entrevistado}
              imovel={imovelPresente}
              benfeitoria={item}
              ativo={podeBuscarFilhas}
            />

          </BenfeitoriaSection>
        ))}
      </EntrevistadoDetailContainer>
    </ScrollView>
  );
};

export default EntrevistadoDetails;