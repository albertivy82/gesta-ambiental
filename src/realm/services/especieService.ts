import { realmInstance } from './databaseService';
import { EspecieInput } from '../../shared/types/EspecieInput';
import { EspecieType } from '../../shared/types/EspecieType';

export const salvarEspecies = (especies: EspecieType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                especies.forEach(especie => {
                    const especieRealm = realmInstance.objects('Especie').filtered(`id == ${especie.id}`)[0];
                    if (especie.sincronizado && especieRealm && especie.idLocal == '') {
                        const especiePadrao = {
                            ...especie,
                            pescaArtesanal: especie.pescaArtesanal.id,
                        };
                        realmInstance.create('Especie', especiePadrao, true);
                    } else {
                        const especiePadrao = {
                            ...especie,
                            pescaArtesanal: especie.pescaArtesanal.id,
                        };
                        realmInstance.create('Especie', especiePadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarEspecieQueue = (especie:EspecieInput): Promise<EspecieType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let especieSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const especiePadrao = {
                            ...especie,
                            id: Id(), 
                           pescaArtesanal: especie.pescaArtesanal!.id,
                        };
            
                        especieSalvo = realmInstance.create('Especie', especiePadrao, true);
                        //console.log("salvarArtesanalQueue", pescaArtesanalPadrao)
                    });

                    if (especieSalvo) {
                        const cleanEspecie = JSON.parse(JSON.stringify(especieSalvo))
                        resolve(cleanEspecie as EspecieType);
                    } else {
                    throw new Error("Erro ao recuperar a pescaArtesanal salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarEspecie= (especie:EspecieType): Promise<EspecieType> => {
    return new Promise((resolve, reject) => {

        try {
            let especieSalvo;
            realmInstance.write(() => {
                const especieExistente = realmInstance
                    .objects<EspecieType>("Especie")
                    .filtered(`id == ${especie.id}`)[0];

                const especiePadrao = {
                    ...especie,
                    pescaArtesanal: especie.pescaArtesanal.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (especie.sincronizado && especieExistente && especie.idLocal === '') {
                    especieSalvo = realmInstance.create("Especie", especiePadrao, true);
                } else {
                    especieSalvo = realmInstance.create("Especie", especiePadrao, true);
                }
            });
    if (especieSalvo) {
        const cleanEspecie = JSON.parse(JSON.stringify(especieSalvo))
        resolve(cleanEspecie as EspecieType);
    } else {
    throw new Error("Erro ao recuperar a especie salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getEspecies = (pescaArtesanalId: number): EspecieType[] => {
    const query = `pescaArtesanal == ${pescaArtesanalId}`;
    const especies = realmInstance.objects<EspecieType>('Especie').filtered(query).slice();
    return JSON.parse(JSON.stringify(especies)) as EspecieType[];
};

export const getEspeciesDessincronizados = (pescaArtesanalId: number): EspecieType[] => {
    const query = `pescaArtesanal == "${pescaArtesanalId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const especieQueue = realmInstance.objects<EspecieType>('Especie').filtered(query).slice();
    return JSON.parse(JSON.stringify(especieQueue)) as EspecieType[];
};

export const setIdArtesanalFromApiOnEspecie = (idArtesanalApi: number, pescaArtesanalIdLocal: string) => {
    try {
        const query = `idFather == "${pescaArtesanalIdLocal}" AND sincronizado == false`;
        const especieQueue = realmInstance.objects('Especie').filtered(query);

        if (especieQueue.length > 0) {
            realmInstance.write(() => {
                especieQueue.forEach(especieOrfan => {
                    especieOrfan.pescaArtesanal = idArtesanalApi;
                    especieOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de especies:', error);
    }
};

export const apagarEspecieQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const especieExcluir = realmInstance.objects<EspecieType>('Especie').filtered(query);
            if (especieExcluir.length > 0) {
                realmInstance.delete(especieExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir especie da fila:', error);
    }
};
