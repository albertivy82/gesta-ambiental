import React from 'react';
import { View } from 'react-native';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { useAguas } from '../../benfeitoriaDetails/hooks/useAgua';
import { useAtividadesProdutivas } from '../../benfeitoriaDetails/hooks/useAtividadeProdutiva';
import { useCreditos } from '../../benfeitoriaDetails/hooks/useCredito';
import { useMoradores } from '../../benfeitoriaDetails/hooks/useMorador';
import { useRendasOutrasFontes } from '../../benfeitoriaDetails/hooks/useRendaOutrasfontes';
import { useServicosComunicacao } from '../../benfeitoriaDetails/hooks/useSevicoComunicacao';

import FilhoResumo from './FilhoResumo';
import AguaSection from '../../agua/ui-components/AguaSection';
import MoradorSection from '../../morador/ui-components/MoradorSection';
import AtividadeProdutivaSection from '../../atividadeProdutiva/ui-components/AtvProdSection';
import RendaOutrasFontesSection from '../../rendaOutrasFontes/ui-components/RendasSection';
import CreditoSection from '../../credito/ui-components/CreditoSection';
import ServicosComunicacaoSection from '../../servicoComunicacao/ui-components/ServComSection';
import { imovelBody } from '../../../shared/types/imovelType';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';

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
    />
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
    />
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
    />
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
    />
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
    />
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
    />
  ))}
</FilhoResumo>

    </>
  );
};

export default FilhasBenfeitoria;