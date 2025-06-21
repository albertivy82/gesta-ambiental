import { realmInstance } from './databaseService';
import { DestinoPescaInput } from '../../shared/types/DestinoPescaInput';
import { DestinoPescaType } from '../../shared/types/DestinoPescaType';

export const salvarDestinosPesca = (destinosPesca: DestinoPescaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                destinosPesca.forEach(destinoPesca => {
                    const destinoPescaRealm = realmInstance.objects('DestinoPesca').filtered(`id == ${destinoPesca.id}`)[0];
                    if (destinoPesca.sincronizado && destinoPescaRealm && destinoPesca.idLocal == '') {
                        const destinoPescaPadrao = {
                            ...destinoPesca,
                            pescaArtesanal: destinoPesca.pescaArtesanal.id,
                        };
                        realmInstance.create('DestinoPesca', destinoPescaPadrao, true);
                    } else {
                        const destinoPescaPadrao = {
                            ...destinoPesca,
                            pescaArtesanal: destinoPesca.pescaArtesanal.id,
                        };
                        realmInstance.create('DestinoPesca', destinoPescaPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarDestinoPescaQueue = (destinoPesca:DestinoPescaInput): Promise<DestinoPescaType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let destinoPescaSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const destinoPescaPadrao = {
                            ...destinoPesca,
                            id: Id(), 
                           pescaArtesanal: destinoPesca.pescaArtesanal!.id,
                        };
            
                        destinoPescaSalvo = realmInstance.create('DestinoPesca', destinoPescaPadrao, true);
                        //console.log("salvarPescaArtesanalQueue", pescaArtesanalPadrao)
                    });

                    if (destinoPescaSalvo) {
                        const cleanDestinoPesca = JSON.parse(JSON.stringify(destinoPescaSalvo))
                        resolve(cleanDestinoPesca as DestinoPescaType);
                    } else {
                    throw new Error("Erro ao recuperar a pescaArtesanal salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarDestinoPesca= (destinoPesca:DestinoPescaType): Promise<DestinoPescaType> => {
    return new Promise((resolve, reject) => {

        try {
            let destinoPescaSalvo;
            realmInstance.write(() => {
                const destinoPescaExistente = realmInstance
                    .objects<DestinoPescaType>("DestinoPesca")
                    .filtered(`id == ${destinoPesca.id}`)[0];

                const destinoPescaPadrao = {
                    ...destinoPesca,
                    pescaArtesanal: destinoPesca.pescaArtesanal.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (destinoPesca.sincronizado && destinoPescaExistente && destinoPesca.idLocal === '') {
                    destinoPescaSalvo = realmInstance.create("DestinoPesca", destinoPescaPadrao, true);
                } else {
                    destinoPescaSalvo = realmInstance.create("DestinoPesca", destinoPescaPadrao, true);
                }
            });
    if (destinoPescaSalvo) {
        const cleanDestinoPesca = JSON.parse(JSON.stringify(destinoPescaSalvo))
        resolve(cleanDestinoPesca as DestinoPescaType);
    } else {
    throw new Error("Erro ao recuperar a destinoPesca salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getDestinosPesca = (pescaArtesanalId: number): DestinoPescaType[] => {
    const query = `pescaArtesanal == ${pescaArtesanalId}`;
    const destinosPesca = realmInstance.objects<DestinoPescaType>('DestinoPesca').filtered(query).slice();
    return JSON.parse(JSON.stringify(destinosPesca)) as DestinoPescaType[];
};

export const getDestinosPescaDessincronizados = (pescaArtesanalId: number): DestinoPescaType[] => {
    const query = `pescaArtesanal == "${pescaArtesanalId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const destinoPescaQueue = realmInstance.objects<DestinoPescaType>('DestinoPesca').filtered(query).slice();
    return JSON.parse(JSON.stringify(destinoPescaQueue)) as DestinoPescaType[];
};

export const setIdPescaArtesanalFromApiOnDestinoPesca = (idPescaArtesanalApi: number, pescaArtesanalIdLocal: string) => {
    try {
        const query = `idFather == "${pescaArtesanalIdLocal}" AND sincronizado == false`;
        const destinoPescaQueue = realmInstance.objects('DestinoPesca').filtered(query);

        if (destinoPescaQueue.length > 0) {
            realmInstance.write(() => {
                destinoPescaQueue.forEach(destinoPescaOrfan => {
                    destinoPescaOrfan.pescaArtesanal = idPescaArtesanalApi;
                    destinoPescaOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de destinosPesca:', error);
    }
};

export const apagarDestinoPescaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const destinoPescaExcluir = realmInstance.objects<DestinoPescaType>('DestinoPesca').filtered(query);
            if (destinoPescaExcluir.length > 0) {
                realmInstance.delete(destinoPescaExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir destinoPesca da fila:', error);
    }
};


export const apagarDestinoPescaSyncronizada = (destinoPescaId: number) => {
  try {
    realmInstance.write(() => {
      const query = `id == ${destinoPescaId}`;
      const destinoPescaExcluir = realmInstance.objects<DestinoPescaType>("DestinoPesca").filtered(query);
      if (destinoPescaExcluir.length > 0) {
        realmInstance.delete(destinoPescaExcluir);
      }
    });
  } catch (error) {
    console.error("Erro ao excluir destinoPesca sincronizada:", error);
  }
};
