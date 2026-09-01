import React from 'react';
import { View } from 'react-native';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { useAguas } from '../hooks/useAgua';
import { useAtividadesProdutivas } from '../hooks/useAtividadeProdutiva';
import { useCreditos } from '../hooks/useCredito';
import { useMoradores } from '../hooks/useMorador';
import { useRendasOutrasFontes } from '../hooks/useRendaOutrasfontes';
import { useServicosComunicacao } from '../hooks/useSevicoComunicacao';

import FilhoResumo from './FilhoResumo';
import AguaSection from '../../agua/ui-components/AguaSection';
import MoradorSection from '../../morador/ui-components/MoradorSection';
import AtividadeProdutivaSection from '../../atividadeProdutiva/ui-components/AtvProdSection';
import RendaOutrasFontesSection from '../../rendaOutrasFontes/ui-components/RendasSection';
import CreditoSection from '../../credito/ui-components/CreditoSection';
import ServicosComunicacaoSection from '../../servicoComunicacao/ui-components/ServComSection';
import { imovelBody } from '../../../shared/types/imovelType';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import EditFilhoConfirmation from './EditFilhoConfirmation';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';

interface FilhasBenfeitoriaProps {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  ativo: boolean;
}

const FilhasBenfeitoria = ({ entrevistado, imovel,  benfeitoria,  ativo,}: FilhasBenfeitoriaProps) => {
  
  const { moradores, loadingMoradores } =
    useMoradores(ativo, benfeitoria.id);

  const { aguas, loadingAguas } =
    useAguas(ativo, benfeitoria.id);

  const { atividades, loadingAtividadesProdutivas } =
    useAtividadesProdutivas(ativo, benfeitoria.id);

  const { creditos, loadingCreditos } =
    useCreditos(ativo, benfeitoria.id);

  const { rendasOF, loadingOutrasRendas } =
    useRendasOutrasFontes(ativo, benfeitoria.id);

  const { servicos, loadingComunicacoes } =
    useServicosComunicacao(ativo, benfeitoria.id);

  const carregando =
    loadingMoradores ||
    loadingAguas ||
    loadingAtividadesProdutivas ||
    loadingCreditos ||
    loadingOutrasRendas ||
    loadingComunicacoes;

  if (carregando) {
    return null;
  }

 return (
  <>
    <FilhoResumo
      titulo="Moradores"
      registros={moradores}
      newRoute="NovoMorador"
      entrevistado={entrevistado}
      imovel={imovel}
      benfeitoria={benfeitoria}
    >
      {moradores.map((morador) => (
        <MoradorSection
          key={morador.idLocal || morador.id}
          morador={morador}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <EditFilhoConfirmation
              registro={morador}
              parametro="morador"
              destino="NovoMorador"
              entrevistado={entrevistado}
              imovel={imovel}
              benfeitoria={benfeitoria}
            />

            <DeleteConfirmation
              id={morador.id}
              idLocal={morador.idLocal}
              deleteEndpoint="morador"
              onDeleteSuccess={() => {}}
              showIcon={false}
            />
          </View>
        </MoradorSection>
      ))}
    </FilhoResumo>

    <FilhoResumo
      titulo="Água"
      registros={aguas}
      newRoute="NovaAgua"
      entrevistado={entrevistado}
      imovel={imovel}
      benfeitoria={benfeitoria}
    >
      {aguas.map((agua) => (
        <AguaSection
          key={agua.idLocal || agua.id}
          agua={agua}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <EditFilhoConfirmation
              registro={agua}
              parametro="agua"
              destino="NovaAgua"
              entrevistado={entrevistado}
              imovel={imovel}
              benfeitoria={benfeitoria}
            />

            <DeleteConfirmation
              id={agua.id}
              idLocal={agua.idLocal}
              deleteEndpoint="agua"
              onDeleteSuccess={() => {}}
              showIcon={false}
            />
          </View>
        </AguaSection>
      ))}
    </FilhoResumo>

    <FilhoResumo
      titulo="Atividades Produtivas"
      registros={atividades}
      newRoute="NovaAtividade"
      entrevistado={entrevistado}
      imovel={imovel}
      benfeitoria={benfeitoria}
    >
      {atividades.map((atividade) => (
        <AtividadeProdutivaSection
          key={atividade.idLocal || atividade.id}
          atividadeProdutiva={atividade}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <EditFilhoConfirmation
              registro={atividade}
              parametro="atividadeProdutiva"
              destino="NovaAtividade"
              entrevistado={entrevistado}
              imovel={imovel}
              benfeitoria={benfeitoria}
            />

            <DeleteConfirmation
              id={atividade.id}
              idLocal={atividade.idLocal}
              deleteEndpoint="atividade-produtiva"
              onDeleteSuccess={() => {}}
              showIcon={false}
            />
          </View>
        </AtividadeProdutivaSection>
      ))}
    </FilhoResumo>

    <FilhoResumo
      titulo="Créditos"
      registros={creditos}
      newRoute="NovoCredito"
      entrevistado={entrevistado}
      imovel={imovel}
      benfeitoria={benfeitoria}
    >
      {creditos.map((credito) => (
        <CreditoSection
          key={credito.idLocal || credito.id}
          credito={credito}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <EditFilhoConfirmation
              registro={credito}
              parametro="credito"
              destino="NovoCredito"
              entrevistado={entrevistado}
              imovel={imovel}
              benfeitoria={benfeitoria}
            />

            <DeleteConfirmation
              id={credito.id}
              idLocal={credito.idLocal}
              deleteEndpoint="credito"
              onDeleteSuccess={() => {}}
              showIcon={false}
            />
          </View>
        </CreditoSection>
      ))}
    </FilhoResumo>

    <FilhoResumo
      titulo="Outras Fontes de Renda"
      registros={rendasOF}
      newRoute="NovaRendaOutrasFontes"
      entrevistado={entrevistado}
      imovel={imovel}
      benfeitoria={benfeitoria}
    >
      {rendasOF.map((renda) => (
        <RendaOutrasFontesSection
          key={renda.idLocal || renda.id}
          renda={renda}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <EditFilhoConfirmation
              registro={renda}
              parametro="renda"
              destino="NovaRendaOutrasFontes"
              entrevistado={entrevistado}
              imovel={imovel}
              benfeitoria={benfeitoria}
            />

            <DeleteConfirmation
              id={renda.id}
              idLocal={renda.idLocal}
              deleteEndpoint="outras-fontes-de-renda"
              onDeleteSuccess={() => {}}
              showIcon={false}
            />
          </View>
        </RendaOutrasFontesSection>
      ))}
    </FilhoResumo>

    <FilhoResumo
      titulo="Serviços de Comunicação"
      registros={servicos}
      newRoute="NovoServicoComunicacao"
      entrevistado={entrevistado}
      imovel={imovel}
      benfeitoria={benfeitoria}
    >
      {servicos.map((servico) => (
        <ServicosComunicacaoSection
          key={servico.idLocal || servico.id}
          servico={servico}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <EditFilhoConfirmation
              registro={servico}
              parametro="servico"
              destino="NovoServicoComunicacao"
              entrevistado={entrevistado}
              imovel={imovel}
              benfeitoria={benfeitoria}
            />

            <DeleteConfirmation
              id={servico.id}
              idLocal={servico.idLocal}
              deleteEndpoint="servico-de-comunicacao"
              onDeleteSuccess={() => {}}
              showIcon={false}
            />
          </View>
        </ServicosComunicacaoSection>
      ))}
    </FilhoResumo>
  </>
);
};

export default FilhasBenfeitoria;