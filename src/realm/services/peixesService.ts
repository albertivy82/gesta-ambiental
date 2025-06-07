import { realmInstance } from './databaseService';
import { PeixesInput } from '../../shared/types/PeixesInput';
import { PeixesType } from '../../shared/types/PeixesType';

export const salvarPeixes = (peixes: PeixesType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                peixes.forEach(peixe => {
                    const peixeRealm = realmInstance.objects('Peixes').filtered(`id == ${peixe.id}`)[0];
                    if (peixe.sincronizado && peixeRealm && peixe.idLocal == '') {
                        const peixePadrao = {
                            ...peixe,
                            entrevistado: peixe.entrevistado.id,
                        };
                        realmInstance.create('Peixes', peixePadrao, true);
                    } else {
                        const peixePadrao = {
                            ...peixe,
                            entrevistado: peixe.entrevistado.id,
                        };
                        realmInstance.create('Peixes', peixePadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarPeixeQueue = (peixe:PeixesInput): Promise<PeixesType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let peixeSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const peixePadrao = {
                            ...peixe,
                            id: Id(), 
                           entrevistado: peixe.entrevistado!.id,
                        };
            
                        peixeSalvo = realmInstance.create('Peixes', peixePadrao, true);
                        //console.log("salvarEntrevistadoQueue", benfeitoriaPadrao)
                    });

                    if (peixeSalvo) {
                        const cleanPeixe = JSON.parse(JSON.stringify(peixeSalvo))
                        resolve(cleanPeixe as PeixesType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarPeixe= (peixe:PeixesType): Promise<PeixesType> => {
    return new Promise((resolve, reject) => {

        try {
            let peixeSalvo;
            realmInstance.write(() => {
                const peixeExistente = realmInstance
                    .objects<PeixesType>("Peixes")
                    .filtered(`id == ${peixe.id}`)[0];

                const peixePadrao = {
                    ...peixe,
                    entrevistado: peixe.entrevistado.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (peixe.sincronizado && peixeExistente && peixe.idLocal === '') {
                    peixeSalvo = realmInstance.create("Peixes", peixePadrao, true);
                } else {
                    peixeSalvo = realmInstance.create("Peixes", peixePadrao, true);
                }
            });
    if (peixeSalvo) {
        const cleanPeixe = JSON.parse(JSON.stringify(peixeSalvo))
        resolve(cleanPeixe as PeixesType);
    } else {
    throw new Error("Erro ao recuperar a peixe salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getPeixes = (entrevistadoId: number): PeixesType[] => {
    const query = `entrevistado == ${entrevistadoId}`;
    const peixes = realmInstance.objects<PeixesType>('Peixes').filtered(query).slice();
    return JSON.parse(JSON.stringify(peixes)) as PeixesType[];
};

export const getPeixesDessincronizados = (entrevistadoId: number): PeixesType[] => {
    const query = `entrevistado == "${entrevistadoId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const peixesQueue = realmInstance.objects<PeixesType>('Peixes').filtered(query).slice();
    return JSON.parse(JSON.stringify(peixesQueue)) as PeixesType[];
};

export const setIdEntrevistadoFromApiOnPeixes = (idEntrevistadoApi: number, entrevistadoIdLocal: string) => {
    try {
        const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
        const peixesQueue = realmInstance.objects('Peixes').filtered(query);

        if (peixesQueue.length > 0) {
            realmInstance.write(() => {
                peixesQueue.forEach(peixeOrfan => {
                    peixeOrfan.entrevistado = idEntrevistadoApi;
                    peixeOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar peixes:', error);
    }
};

export const apagarPeixeQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const peixeExcluir = realmInstance.objects<PeixesType>('Peixes').filtered(query);
            if (peixeExcluir.length > 0) {
                realmInstance.delete(peixeExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir peixe da fila:', error);
    }
};


export const apagarPeixeSyncronizado = (peixeId: number) => {
  try {
    realmInstance.write(() => {
      const query = `id == ${peixeId}`;
      const peixeExcluir = realmInstance.objects<PeixesType>("Peixes").filtered(query);
      if (peixeExcluir.length > 0) {
        realmInstance.delete(peixeExcluir);
      }
    });
  } catch (error) {
    console.error("Erro ao excluir peixe sincronizado:", error);
  }
};