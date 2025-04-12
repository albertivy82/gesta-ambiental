import { realmInstance } from './databaseService';
import { FaunaInput } from '../../shared/types/FaunaInput';
import { FaunaType } from '../../shared/types/FaunaType';

export const salvarFaunas = (fauna: FaunaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                fauna.forEach(faunaItem => {
                    const faunaRealm = realmInstance.objects('Fauna').filtered(`id == ${faunaItem.id}`)[0];
                    if (faunaItem.sincronizado && faunaRealm && faunaItem.idLocal == '') {
                        const faunaPadrao = {
                            ...faunaItem,
                            entrevistado: faunaItem.entrevistado.id,
                        };
                        realmInstance.create('Fauna', faunaPadrao, true);
                    } else {
                        const faunaPadrao = {
                            ...faunaItem,
                            entrevistado: faunaItem.entrevistado.id,
                        };
                        realmInstance.create('Fauna', faunaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarFaunaQueue = (fauna:FaunaInput): Promise<FaunaType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let faunaSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const faunaPadrao = {
                            ...fauna,
                            id: Id(), 
                           entrevistado: fauna.entrevistado!.id,
                        };
            
                        faunaSalvo = realmInstance.create('Fauna', faunaPadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (faunaSalvo) {
                        const cleanFauna = JSON.parse(JSON.stringify(faunaSalvo))
                        resolve(cleanFauna as FaunaType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarFauna= (fauna:FaunaType): Promise<FaunaType> => {
    return new Promise((resolve, reject) => {

        try {
            let faunaSalvo;
            realmInstance.write(() => {
                const faunaExistente = realmInstance
                    .objects<FaunaType>("Fauna")
                    .filtered(`id == ${fauna.id}`)[0];

                const faunaPadrao = {
                    ...fauna,
                    entrevistado: fauna.entrevistado.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (fauna.sincronizado && faunaExistente && fauna.idLocal === '') {
                    faunaSalvo = realmInstance.create("Fauna", faunaPadrao, true);
                } else {
                    faunaSalvo = realmInstance.create("Fauna", faunaPadrao, true);
                }
            });
    if (faunaSalvo) {
        const cleanFauna = JSON.parse(JSON.stringify(faunaSalvo))
        resolve(cleanFauna as FaunaType);
    } else {
    throw new Error("Erro ao recuperar a fauna salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getFauna = (entrevistadoId: number): FaunaType[] => {
    const query = `entrevistado == ${entrevistadoId}`;
    const fauna = realmInstance.objects<FaunaType>('Fauna').filtered(query).slice();
    return JSON.parse(JSON.stringify(fauna)) as FaunaType[];
};

export const getFaunaDessincronizadas = (entrevistadoId: number): FaunaType[] => {
    const query = `entrevistado == "${entrevistadoId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const faunaQueue = realmInstance.objects<FaunaType>('Fauna').filtered(query).slice();
    return JSON.parse(JSON.stringify(faunaQueue)) as FaunaType[];
};

export const setIdBenfeitoriaFromApiOnFauna = (idBenfeitoriaApi: number, entrevistadoIdLocal: string) => {
    try {
        const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
        const faunaQueue = realmInstance.objects('Fauna').filtered(query);

        if (faunaQueue.length > 0) {
            realmInstance.write(() => {
                faunaQueue.forEach(faunaOrfan => {
                    faunaOrfan.entrevistado = idBenfeitoriaApi;
                    faunaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar fauna:', error);
    }
};

export const apagarFaunaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const faunaExcluir = realmInstance.objects<FaunaType>('Fauna').filtered(query);
            if (faunaExcluir.length > 0) {
                realmInstance.delete(faunaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir fauna da fila:', error);
    }
};
