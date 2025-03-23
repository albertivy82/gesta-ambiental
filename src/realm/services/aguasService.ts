import { realmInstance } from './databaseService';
import { AguaType } from '../../shared/types/AguaType';
import { AguaInput } from '../../shared/types/AguaInput';


export const salvarAgua = (aguas: AguaType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        aguas.forEach(agua => {
          const aguaRealm = realmInstance.objects('Agua').filtered(`id == ${agua.id}`)[0];
          if (agua.sincronizado && aguaRealm && agua.idLocal == '') {
            const aguaPadrao = {
              ...agua,
              benfeitoria: agua.benfeitoria.id,
            };
            realmInstance.create('Agua', aguaPadrao, true);
          } else {
            const aguaPadrao = {
              ...agua,
              benfeitoria: agua.benfeitoria.id,
            };
            realmInstance.create('Agua', aguaPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarAguaQueue = (agua: AguaInput) => {
  return new Promise<void>((resolve, reject) => {
    const Id = () => {
      const min = Math.ceil(0);
      const max = Math.floor(1000);
      return -Math.floor(Math.random() * (max - min + 1)) + min;
    };
    try {
      realmInstance.write(() => {
        const aguaPadrao = {
          ...agua,
          id: Id(),
          benfeitoria: agua.benfeitoria!.id,
        };
        realmInstance.create('Agua', aguaPadrao, true);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getAguas = (benfeitoriaId: number): AguaType[] => {
  const query = `benfeitoria == ${benfeitoriaId}`;
  const aguas = realmInstance.objects<AguaType>('Agua').filtered(query).slice();
  return JSON.parse(JSON.stringify(aguas)) as AguaType[];
};

export const getAguaDessincronizadas = (benfeitoriaId: number): AguaType[] => {
  const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const aguasQueue = realmInstance.objects<AguaType>('Agua').filtered(query).slice();
  return JSON.parse(JSON.stringify(aguasQueue)) as AguaType[];
};

export const setIdBenfeitoriaFromApiOnAguas = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND (sincronizado == false and sincronizado == false)`;
    const aguaQueue = realmInstance.objects('Agua').filtered(query);

    if (aguaQueue.length > 0) {
      realmInstance.write(() => {
        aguaQueue.forEach(aguaOrfan => {
          aguaOrfan.benfeitoria = idBenfeitoriaApi;
          aguaOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar água:', error);
  }
};

export const apagarAguaQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const aguaExcluir = realmInstance.objects<AguaType>('Agua').filtered(query);
      if (aguaExcluir.length > 0) {
        realmInstance.delete(aguaExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir água da fila:', error);
  }
};
