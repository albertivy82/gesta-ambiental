import { realmInstance } from './databaseService';
import { RepteisType } from '../../shared/types/RepteisType';
import { RepteisInput } from '../../shared/types/RepteisInput';

export const salvarRepteis = (reptils: RepteisType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        reptils.forEach(reptil => {
          const reptilRealm = realmInstance.objects('Repteis').filtered(`id == ${reptil.id}`)[0];
          if (reptil.sincronizado && reptilRealm && reptil.idLocal == '') {
            const reptilPadrao = {
              ...reptil,
              entrevistado: reptil.entrevistado.id,
            };
            realmInstance.create('Repteis', reptilPadrao, true);
          } else {
            const reptilPadrao = {
              ...reptil,
              entrevistado: reptil.entrevistado.id,
            };
            realmInstance.create('Repteis', reptilPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarReptilQueue = (reptil: RepteisInput) => {
  return new Promise<void>((resolve, reject) => {
    const Id = () => {
      const min = Math.ceil(0);
      const max = Math.floor(1000);
      return -Math.floor(Math.random() * (max - min + 1)) + min;
    };
    try {
      realmInstance.write(() => {
        const reptilPadrao = {
          ...reptil,
          id: Id(),
          entrevistado: reptil.entrevistado?.id,
        };
        realmInstance.create('Repteis', reptilPadrao, true);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getRepteis = (entrevistadoId: number): RepteisType[] => {
  const query = `entrevistado == ${entrevistadoId}`;
  const reptils = realmInstance.objects<RepteisType>('Repteis').filtered(query).slice();
  return JSON.parse(JSON.stringify(reptils)) as RepteisType[];
};

export const getRepteisDessincronizadas = (entrevistadoId: number): RepteisType[] => {
  const query = `entrevistado == "${entrevistadoId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const reptilsQueue = realmInstance.objects<RepteisType>('Repteis').filtered(query).slice();
  return JSON.parse(JSON.stringify(reptilsQueue)) as RepteisType[];
};

export const setIdBenfeitoriaFromApiOnRepteis = (idBenfeitoriaApi: number, entrevistadoIdLocal: string) => {
  try {
    const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
    const reptilsQueue = realmInstance.objects('Repteis').filtered(query);

    if (reptilsQueue.length > 0) {
      realmInstance.write(() => {
        reptilsQueue.forEach(reptilOrfan => {
          reptilOrfan.entrevistado = idBenfeitoriaApi;
          reptilOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar reptils:', error);
  }
};

export const apagarReptilQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const reptilExcluir = realmInstance.objects<RepteisType>('Repteis').filtered(query);
      if (reptilExcluir.length > 0) {
        realmInstance.delete(reptilExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir reptil da fila:', error);
  }
};
