import { realmInstance } from './databaseService';
import { MoradorInput } from '../../shared/types/MoradorInput';
import { MoradorType } from '../../shared/types/MoradorType';

export const salvarMoradores = (moradores: MoradorType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                moradores.forEach(morador => {
                    const moradorRealm = realmInstance.objects('Morador').filtered(`id == ${morador.id}`)[0];
                    if (morador.sincronizado && moradorRealm && morador.idLocal == '') {
                        const moradorPadrao = {
                            ...morador,
                            benfeitoria: morador.benfeitoria.id,
                        };
                        realmInstance.create('Morador', moradorPadrao, true);
                    } else {
                        const moradorPadrao = {
                            ...morador,
                            benfeitoria: morador.benfeitoria.id,
                        };
                        realmInstance.create('Morador', moradorPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarMoradorQueue = (morador:MoradorInput): Promise<MoradorType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let moradorSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const moradorPadrao = {
                            ...morador,
                            id: Id(), 
                           benfeitoria: morador.benfeitoria!.id,
                        };
            
                        moradorSalvo = realmInstance.create('Morador', moradorPadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (moradorSalvo) {
                        const cleanMorador = JSON.parse(JSON.stringify(moradorSalvo))
                        resolve(cleanMorador as MoradorType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarMorador= (morador:MoradorType): Promise<MoradorType> => {
    return new Promise((resolve, reject) => {

        try {
            let moradorSalvo;
            realmInstance.write(() => {
                const moradorExistente = realmInstance
                    .objects<MoradorType>("Morador")
                    .filtered(`id == ${morador.id}`)[0];

                const moradorPadrao = {
                    ...morador,
                    benfeitoria: morador.benfeitoria.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (morador.sincronizado && moradorExistente && morador.idLocal === '') {
                    moradorSalvo = realmInstance.create("Morador", moradorPadrao, true);
                } else {
                    moradorSalvo = realmInstance.create("Morador", moradorPadrao, true);
                }
            });
    if (moradorSalvo) {
        const cleanMorador = JSON.parse(JSON.stringify(moradorSalvo))
        resolve(cleanMorador as MoradorType);
    } else {
    throw new Error("Erro ao recuperar a morador salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getMoradores = (benfeitoriaId: number): MoradorType[] => {
    const query = `benfeitoria == ${benfeitoriaId}`;
    const moradores = realmInstance.objects<MoradorType>('Morador').filtered(query).slice();
    return JSON.parse(JSON.stringify(moradores)) as MoradorType[];
};

export const getMoradoresDessincronizados = (benfeitoriaId: number): MoradorType[] => {
    console.log("...ou seria o probelma aqui?")
    const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const moradorQueue = realmInstance.objects<MoradorType>('Morador').filtered(query).slice();
    return JSON.parse(JSON.stringify(moradorQueue)) as MoradorType[];
};

export const setIdBenfeitoriaFromApiOnMorador = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
    try {
        const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
        const moradorQueue = realmInstance.objects('Morador').filtered(query);

        if (moradorQueue.length > 0) {
            realmInstance.write(() => {
                moradorQueue.forEach(moradorOrfan => {
                    moradorOrfan.benfeitoria = idBenfeitoriaApi;
                    moradorOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de moradores:', error);
    }
};

export const apagarMoradorQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const moradorExcluir = realmInstance.objects<MoradorType>('Morador').filtered(query);
            if (moradorExcluir.length > 0) {
                realmInstance.delete(moradorExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir morador da fila:', error);
    }
};


export const apagarMoradorSyncronizada = (moradorId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${moradorId}"`;
            const moradorExcluir = realmInstance.objects<MoradorType>('Morador').filtered(query);

            if (moradorExcluir.length > 0) {

             realmInstance.delete(moradorExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir morador da fila:', error);
    }
};