import { realmInstance } from './databaseService';
import { AvesType } from '../../shared/types/AvesType';
import { AvesInput } from '../../shared/types/AvesInput';

export const salvarAves = (aves: AvesType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        aves.forEach(ave => {
          const aveRealm = realmInstance.objects('Aves').filtered(`id == ${ave.id}`)[0];
          if (ave.sincronizado && aveRealm && ave.idLocal == '') {
            const avePadrao = {
              ...ave,
              benfeitoria: ave.benfeitoria.id,
            };
            realmInstance.create('Aves', avePadrao, true);
          } else {
            const avePadrao = {
              ...ave,
              benfeitoria: ave.benfeitoria.id,
            };
            realmInstance.create('Aves', avePadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarAveQueue = (ave: AvesInput) => {
  return new Promise<void>((resolve, reject) => {
    const Id = () => {
      const min = Math.ceil(0);
      const max = Math.floor(1000);
      return -Math.floor(Math.random() * (max - min + 1)) + min;
    };
    try {
      realmInstance.write(() => {
        const avePadrao = {
          ...ave,
          id: Id(),
          benfeitoria: ave.benfeitoria?.id,
        };
        realmInstance.create('Aves', avePadrao, true);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getAves = (benfeitoriaId: number): AvesType[] => {
  const query = `benfeitoria == ${benfeitoriaId}`;
  const aves = realmInstance.objects<AvesType>('Aves').filtered(query).slice();
  return JSON.parse(JSON.stringify(aves)) as AvesType[];
};

export const getAvesDessincronizadas = (benfeitoriaId: number): AvesType[] => {
  const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const avesQueue = realmInstance.objects<AvesType>('Aves').filtered(query).slice();
  return JSON.parse(JSON.stringify(avesQueue)) as AvesType[];
};

export const setIdBenfeitoriaFromApiOnAves = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
    const avesQueue = realmInstance.objects('Aves').filtered(query);

    if (avesQueue.length > 0) {
      realmInstance.write(() => {
        avesQueue.forEach(aveOrfan => {
          aveOrfan.benfeitoria = idBenfeitoriaApi;
          aveOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar aves:', error);
  }
};

export const apagarAveQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const aveExcluir = realmInstance.objects<AvesType>('Aves').filtered(query);
      if (aveExcluir.length > 0) {
        realmInstance.delete(aveExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir ave da fila:', error);
  }
};
