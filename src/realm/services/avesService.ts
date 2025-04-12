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
              entrevistado: ave.entrevistado.id,
            };
            realmInstance.create('Aves', avePadrao, true);
          } else {
            const avePadrao = {
              ...ave,
              entrevistado: ave.entrevistado.id,
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

export const salvarAveQueue = (ave:AvesInput): Promise<AvesType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let aveSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const avePadrao = {
                            ...ave,
                            id: Id(), 
                           entrevistado: ave.entrevistado!.id,
                        };
            
                        aveSalvo = realmInstance.create('Aves', avePadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (aveSalvo) {
                        const cleanAve = JSON.parse(JSON.stringify(aveSalvo))
                        resolve(cleanAve as AvesType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarAve= (ave:AvesType): Promise<AvesType> => {
    return new Promise((resolve, reject) => {

        try {
            let aveSalvo;
            realmInstance.write(() => {
                const aveExistente = realmInstance
                    .objects<AvesType>("Ave")
                    .filtered(`id == ${ave.id}`)[0];

                const avePadrao = {
                    ...ave,
                    entrevistado: ave.entrevistado.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (ave.sincronizado && aveExistente && ave.idLocal === '') {
                    aveSalvo = realmInstance.create("Aves", avePadrao, true);
                } else {
                    aveSalvo = realmInstance.create("Aves", avePadrao, true);
                }
            });
    if (aveSalvo) {
        const cleanAve = JSON.parse(JSON.stringify(aveSalvo))
        resolve(cleanAve as AvesType);
    } else {
    throw new Error("Erro ao recuperar a ave salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getAves = (entrevistadoId: number): AvesType[] => {
  const query = `entrevistado == ${entrevistadoId}`;
  const aves = realmInstance.objects<AvesType>('Aves').filtered(query).slice();
  return JSON.parse(JSON.stringify(aves)) as AvesType[];
};

export const getAvesDessincronizadas = (entrevistadoId: number): AvesType[] => {
  const query = `entrevistado == "${entrevistadoId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const avesQueue = realmInstance.objects<AvesType>('Aves').filtered(query).slice();
  return JSON.parse(JSON.stringify(avesQueue)) as AvesType[];
};

export const setIdBenfeitoriaFromApiOnAves = (idBenfeitoriaApi: number, entrevistadoIdLocal: string) => {
  try {
    const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
    const avesQueue = realmInstance.objects('Aves').filtered(query);

    if (avesQueue.length > 0) {
      realmInstance.write(() => {
        avesQueue.forEach(aveOrfan => {
          aveOrfan.entrevistado = idBenfeitoriaApi;
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
