import { ServicosComunicacaoInput } from '../../shared/types/ComunicacaoInput';
import { ServicosComunicacaoType } from '../../shared/types/ComunicacaoType';
import { realmInstance } from './databaseService';


export const salvarServicosComunicacao = (servicosComunicacao: ServicosComunicacaoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        servicosComunicacao.forEach(servico => {
          const servicoRealm = realmInstance.objects('ServicosComunicacao').filtered(`id == ${servico.id}`)[0];
          if (servico.sincronizado && servicoRealm && servico.idLocal == '') {
            const servicoPadrao = {
              ...servico,
              benfeitoria: servico.benfeitoria.id,
            };
            realmInstance.create('ServicosComunicacao', servicoPadrao, true);
          } else {
            const servicoPadrao = {
              ...servico,
              benfeitoria: servico.benfeitoria.id,
            };
            realmInstance.create('ServicosComunicacao', servicoPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarServicoComunicacaoQueue = (servicoComunicacao: ServicosComunicacaoInput) => {
  return new Promise<void>((resolve, reject) => {
    const Id = () => {
      const min = Math.ceil(0);
      const max = Math.floor(1000);
      return -Math.floor(Math.random() * (max - min + 1)) + min;
    };
    try {
      realmInstance.write(() => {
        const servicoPadrao = {
          ...servicoComunicacao,
          id: Id(),
          benfeitoria: servicoComunicacao.benfeitoria?.id,
        };
        realmInstance.create('ServicosComunicacao', servicoPadrao, true);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getServicosComunicacao = (benfeitoriaId: number): ServicosComunicacaoType[] => {
  const query = `benfeitoria == ${benfeitoriaId}`;
  const servicosComunicacao = realmInstance
    .objects<ServicosComunicacaoType>('ServicosComunicacao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(servicosComunicacao)) as ServicosComunicacaoType[];
};

export const getServicosComunicacaoDessincronizados = (benfeitoriaId: number): ServicosComunicacaoType[] => {
  const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const servicosQueue = realmInstance
    .objects<ServicosComunicacaoType>('ServicosComunicacao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(servicosQueue)) as ServicosComunicacaoType[];
};

export const setIdBenfeitoriaFromApiOnCS = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
    const servicosQueue = realmInstance.objects('ServicosComunicacao').filtered(query);

    if (servicosQueue.length > 0) {
      realmInstance.write(() => {
        servicosQueue.forEach(servicoOrfan => {
          servicoOrfan.benfeitoria = idBenfeitoriaApi;
          servicoOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar serviços de comunicação:', error);
  }
};

export const apagarServicoComunicacaoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const servicoExcluir = realmInstance.objects<ServicosComunicacaoType>('ServicosComunicacao').filtered(query);
      if (servicoExcluir.length > 0) {
        realmInstance.delete(servicoExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir serviço de comunicação da fila:', error);
  }
};
