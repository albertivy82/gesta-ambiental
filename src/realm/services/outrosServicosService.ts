import { realmInstance } from './databaseService';
import { OutrosServicosType } from '../../shared/types/OutrosServicosType';

export const salvarOutrosServicos = (servicos: OutrosServicosType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        servicos.forEach((servico) => {
          realmInstance.create('OutrosServicos', servico, true);
          console.log('salvarOutrosServicos', servico);
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarOutrosServicosQueue = (servico: OutrosServicosType) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        const servicoPadrao = {
          ...servico,
          sincronizado: false,
        };
        realmInstance.create('OutrosServicos', servicoPadrao, true);
        console.log('salvarOutrosServicosQueue', servicoPadrao);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getOutrosServicos = (): OutrosServicosType[] => {
  const servicos = realmInstance.objects<OutrosServicosType>('OutrosServicos').slice();
  const cleanServicos = JSON.parse(JSON.stringify(servicos));
  console.log('getOutrosServicos', cleanServicos);
  return cleanServicos as OutrosServicosType[];
};

export const apagarOutrosServicosQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const servicoExcluir = realmInstance.objects<OutrosServicosType>('OutrosServicos').filtered(`idLocal == "${idLocal}"`);
      if (servicoExcluir.length > 0) {
        realmInstance.delete(servicoExcluir);
      }
    });
    console.log('apagarOutrosServicosQueue');
  } catch (error) {
    console.error('Erro ao excluir outros serviços da fila:', error);
  }
};
