import { realmInstance } from './databaseService';
import { VegetacaoInput } from '../../shared/types/VegetacaoInput';
import { VegetacaoType } from '../../shared/types/VegetacaoType';

export const salvarVegetacoes = (vegetacoes: VegetacaoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        vegetacoes.forEach(vegetacao => {
          const vegetacaoRealm = realmInstance.objects('Vegetacao').filtered(`id == ${vegetacao.id}`)[0];
          if (vegetacao.sincronizado && vegetacaoRealm && vegetacao.idLocal == '') {
            const vegetacaoPadrao = {
              ...vegetacao,
              entrevistado: vegetacao.entrevistado.id,
            };
            realmInstance.create('Vegetacao', vegetacaoPadrao, true);
          } else {
            const vegetacaoPadrao = {
              ...vegetacao,
              entrevistado: vegetacao.entrevistado.id,
            };
            realmInstance.create('Vegetacao', vegetacaoPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarVegetacaoQueue = (vegetacao: VegetacaoInput) => {
  return new Promise<void>((resolve, reject) => {
    const Id = () => {
      const min = Math.ceil(0);
      const max = Math.floor(1000);
      return -Math.floor(Math.random() * (max - min + 1)) + min;
    };
    try {
      realmInstance.write(() => {
        const vegetacaoPadrao = {
          ...vegetacao,
          id: Id(),
          entrevistado: vegetacao.entrevistado?.id,
        };
        realmInstance.create('Vegetacao', vegetacaoPadrao, true);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getVegetacoes = (entrevistadoId: number): VegetacaoType[] => {
  const query = `entrevistado == ${entrevistadoId}`;
  const vegetacoes = realmInstance
    .objects<VegetacaoType>('Vegetacao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(vegetacoes)) as VegetacaoType[];
};

export const getVegetacoesDessincronizadas = (entrevistadoId: number): VegetacaoType[] => {
  const query = `entrevistado == "${entrevistadoId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const vegetacoesQueue = realmInstance
    .objects<VegetacaoType>('Vegetacao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(vegetacoesQueue)) as VegetacaoType[];
};

export const setIdBenfeitoriaFromApiOnVegetacao = (idBenfeitoriaApi: number, entrevistadoIdLocal: string) => {
  try {
    const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
    const vegetacoesQueue = realmInstance.objects('Vegetacao').filtered(query);

    if (vegetacoesQueue.length > 0) {
      realmInstance.write(() => {
        vegetacoesQueue.forEach(vegetacaoOrfan => {
          vegetacaoOrfan.entrevistado = idBenfeitoriaApi;
          vegetacaoOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar vegetações:', error);
  }
};

export const apagarVegetacaoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const vegetacaoExcluir = realmInstance.objects<VegetacaoType>('Vegetacao').filtered(query);
      if (vegetacaoExcluir.length > 0) {
        realmInstance.delete(vegetacaoExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir vegetação da fila:', error);
  }
};
