import { realmInstance } from './databaseService';
import { EntrevistadoType } from '../../shared/types/EntrevistadoType';

export const salvarEntrevistado = (entrevistados: EntrevistadoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        entrevistados.forEach((entrevistado) => {
          realmInstance.create('Entrevistado', entrevistado, true);
          console.log('salvarEntrevistado', entrevistado);
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarEntrevistadoQueue = (entrevistado: EntrevistadoType) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        const entrevistadoPadrao = {
          ...entrevistado,
          sincronizado: false,
        };
        realmInstance.create('Entrevistado', entrevistadoPadrao, true);
        console.log('salvarEntrevistadoQueue', entrevistadoPadrao);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getEntrevistados = (): EntrevistadoType[] => {
  const entrevistados = realmInstance.objects<EntrevistadoType>('Entrevistado').slice();
  const cleanEntrevistados = JSON.parse(JSON.stringify(entrevistados));
  console.log('getEntrevistados', cleanEntrevistados);
  return cleanEntrevistados as EntrevistadoType[];
};

export const apagarEntrevistadoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const entrevistadoExcluir = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(`idLocal == "${idLocal}"`);
      if (entrevistadoExcluir.length > 0) {
        realmInstance.delete(entrevistadoExcluir);
      }
    });
    console.log('apagarEntrevistadoQueue');
  } catch (error) {
    console.error('Erro ao excluir entrevistado da fila:', error);
  }
};
