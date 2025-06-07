import { realmInstance } from './databaseService';
import { MamiferosInput } from '../../shared/types/MamiferosInput';
import { MamiferosType } from '../../shared/types/MamiferosType';

export const salvarMamiferos = (mamiferos: MamiferosType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                mamiferos.forEach(mamifero => {
                    const mamiferoRealm = realmInstance.objects('Mamiferos').filtered(`id == ${mamifero.id}`)[0];
                    if (mamifero.sincronizado && mamiferoRealm && mamifero.idLocal == '') {
                        const mamiferoPadrao = {
                            ...mamifero,
                            entrevistado: mamifero.entrevistado.id,
                        };
                        realmInstance.create('Mamiferos', mamiferoPadrao, true);
                    } else {
                        const mamiferoPadrao = {
                            ...mamifero,
                            entrevistado: mamifero.entrevistado.id,
                        };
                        realmInstance.create('Mamiferos', mamiferoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarMamiferosQueue = (mamiferos:MamiferosInput): Promise<MamiferosType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let mamiferosSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const mamiferosPadrao = {
                            ...mamiferos,
                            id: Id(), 
                           entrevistado: mamiferos.entrevistado!.id,
                        };
            
                        mamiferosSalvo = realmInstance.create('Mamiferos', mamiferosPadrao, true);
                        //console.log("salvarEntrevistadoQueue", benfeitoriaPadrao)
                    });

                    if (mamiferosSalvo) {
                        const cleanMamiferos = JSON.parse(JSON.stringify(mamiferosSalvo))
                        resolve(cleanMamiferos as MamiferosType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarMamifero= (mamiferos:MamiferosType): Promise<MamiferosType> => {
    return new Promise((resolve, reject) => {

        try {
            let mamiferosSalvo;
            realmInstance.write(() => {
                const mamiferosExistente = realmInstance
                    .objects<MamiferosType>("Mamiferos")
                    .filtered(`id == ${mamiferos.id}`)[0];

                const mamiferosPadrao = {
                    ...mamiferos,
                    entrevistado: mamiferos.entrevistado.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (mamiferos.sincronizado && mamiferosExistente && mamiferos.idLocal === '') {
                    mamiferosSalvo = realmInstance.create("Mamiferos", mamiferosPadrao, true);
                } else {
                    mamiferosSalvo = realmInstance.create("Mamiferos", mamiferosPadrao, true);
                }
            });
    if (mamiferosSalvo) {
        const cleanMamiferos = JSON.parse(JSON.stringify(mamiferosSalvo))
        resolve(cleanMamiferos as MamiferosType);
    } else {
    throw new Error("Erro ao recuperar a mamiferos salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getMamiferos = (entrevistadoId: number): MamiferosType[] => {
    const query = `entrevistado == ${entrevistadoId}`;
    const mamiferos = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query).slice();
    return JSON.parse(JSON.stringify(mamiferos)) as MamiferosType[];
};

export const getMamiferosDessincronizados = (entrevistadoId: number): MamiferosType[] => {
    const query = `entrevistado == "${entrevistadoId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const mamiferosQueue = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query).slice();
    return JSON.parse(JSON.stringify(mamiferosQueue)) as MamiferosType[];
};

export const setIdEntrevistadoFromApiOnMamiferos = (idEntrevistadoApi: number, entrevistadoIdLocal: string) => {
    try {
        const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
        const mamiferosQueue = realmInstance.objects('Mamiferos').filtered(query);

        if (mamiferosQueue.length > 0) {
            realmInstance.write(() => {
                mamiferosQueue.forEach(mamiferoOrfan => {
                    mamiferoOrfan.entrevistado = idEntrevistadoApi;
                    mamiferoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar mamíferos:', error);
    }
};

export const apagarMamiferoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const mamiferoExcluir = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query);
            if (mamiferoExcluir.length > 0) {
                realmInstance.delete(mamiferoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir mamífero da fila:', error);
    }
};

export const apagarMamiferoSyncronizado = (mamiferoId: number) => {
  try {
    realmInstance.write(() => {
      const query = `id == ${mamiferoId}`;
      const mamiferoExcluir = realmInstance.objects<MamiferosType>("Mamiferos").filtered(query);
      if (mamiferoExcluir.length > 0) {
        realmInstance.delete(mamiferoExcluir);
      }
    });
  } catch (error) {
    console.error("Erro ao excluir mamifero sincronizado:", error);
  }
};
