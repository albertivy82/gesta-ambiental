import { SaneamentoType } from '../../shared/types/SaneamentoType';
import { realmInstance } from './databaseService';


export const salvarSaneamento = (saneamentos: SaneamentoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        saneamentos.forEach((saneamento) => {
          realmInstance.create('Saneamento', saneamento, true);
          console.log('salvarSaneamento', saneamento);
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarSaneamentoQueue = (saneamento: SaneamentoType) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        const saneamentoPadrao = {
          ...saneamento,
          sincronizado: false,
        };
        realmInstance.create('Saneamento', saneamentoPadrao, true);
        console.log('salvarSaneamentoQueue', saneamentoPadrao);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getSaneamentos = (): SaneamentoType[] => {
  const saneamentos = realmInstance.objects<SaneamentoType>('Saneamento').slice();
  const cleanSaneamentos = JSON.parse(JSON.stringify(saneamentos));
  console.log('getSaneamentos', cleanSaneamentos);
  return cleanSaneamentos as SaneamentoType[];
};

export const apagarSaneamentoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const saneamentoExcluir = realmInstance.objects<SaneamentoType>('Saneamento').filtered(`idLocal == "${idLocal}"`);
      if (saneamentoExcluir.length > 0) {
        realmInstance.delete(saneamentoExcluir);
      }
    });
    console.log('apagarSaneamentoQueue');
  } catch (error) {
    console.error('Erro ao excluir saneamento da fila:', error);
  }
};
