import { realmInstance } from './databaseService';
import { ServicosBasicosType } from '../../shared/types/ServicosBasicosType';

export const salvarServicosBasicos = (servicos: ServicosBasicosType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        servicos.forEach((servico) => {
          realmInstance.create('ServicosBasicos', servico, true);
          console.log('salvarServicosBasicos', servico);
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarServicosBasicosQueue = (servico: ServicosBasicosType) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        const servicoPadrao = {
          ...servico,
          sincronizado: false,
        };
        realmInstance.create('ServicosBasicos', servicoPadrao, true);
        console.log('salvarServicosBasicosQueue', servicoPadrao);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getServicosBasicos = (): ServicosBasicosType[] => {
  const servicos = realmInstance.objects<ServicosBasicosType>('ServicosBasicos').slice();
  const cleanServicos = JSON.parse(JSON.stringify(servicos));
  console.log('getServicosBasicos', cleanServicos);
  return cleanServicos as ServicosBasicosType[];
};

export const apagarServicosBasicosQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const servicoExcluir = realmInstance.objects<ServicosBasicosType>('ServicosBasicos').filtered(`idLocal == "${idLocal}"`);
      if (servicoExcluir.length > 0) {
        realmInstance.delete(servicoExcluir);
      }
    });
    console.log('apagarServicosBasicosQueue');
  } catch (error) {
    console.error('Erro ao excluir serviço básico da fila:', error);
  }
};
