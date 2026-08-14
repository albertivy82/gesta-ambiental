import React from 'react';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { useAguas } from '../../benfeitoriaDetails/hooks/useAgua';
import { useAtividadesProdutivas } from '../../benfeitoriaDetails/hooks/useAtividadeProdutiva';
import { useCreditos } from '../../benfeitoriaDetails/hooks/useCredito';
import { useMoradores } from '../../benfeitoriaDetails/hooks/useMorador';
import { useRendasOutrasFontes } from '../../benfeitoriaDetails/hooks/useRendaOutrasfontes';
import { useServicosComunicacao } from '../../benfeitoriaDetails/hooks/useSevicoComunicacao';

import FilhoResumo from './FilhoResumo';

interface FilhasBenfeitoriaProps {
  benfeitoria: BenfeitoriaType;
  ativo: boolean;
}

const FilhasBenfeitoria = ({
  benfeitoria,
  ativo,
}: FilhasBenfeitoriaProps) => {
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
        quantidade={moradores.length}
      />

      <FilhoResumo
        titulo="Água"
        quantidade={aguas.length}
      />

      <FilhoResumo
        titulo="Atividades Produtivas"
        quantidade={atividades.length}
      />

      <FilhoResumo
        titulo="Crédito"
        quantidade={creditos.length}
      />

      <FilhoResumo
        titulo="Outras Fontes de Renda"
        quantidade={rendasOF.length}
      />

      <FilhoResumo
        titulo="Serviços de Comunicação"
        quantidade={servicos.length}
      />
    </>
  );
};

export default FilhasBenfeitoria;