
import { QuantidadePescaPorTipoType } from '../../shared/types/QuantidadePescaPorTipoType';
import { QuantidadePescaPorTipoInput } from '../../shared/types/QuantidadePescaPorTipoTypeInput';
import { realmInstance } from './databaseService';

export const salvarQtdPescaPorTipoPesca = (destinosPesca: QuantidadePescaPorTipoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                destinosPesca.forEach(qtdPptipo => {
                    const qtdPptipoRealm = realmInstance.objects('QuantidadePescaPorTipo').filtered(`id == ${qtdPptipo.id}`)[0];
                    if (qtdPptipo.sincronizado && qtdPptipoRealm && qtdPptipo.idLocal == '') {
                        const qtdPptipoPadrao = {
                            ...qtdPptipo,
                            pescaArtesanal: qtdPptipo.pescaArtesanal.id,
                        };
                        realmInstance.create('QuantidadePescaPorTipo', qtdPptipoPadrao, true);
                    } else {
                        const qtdPptipoPadrao = {
                            ...qtdPptipo,
                            pescaArtesanal: qtdPptipo.pescaArtesanal.id,
                        };
                        realmInstance.create('QuantidadePescaPorTipo', qtdPptipoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarQtdPptipoQueue = (qtdPptipo:QuantidadePescaPorTipoInput): Promise<QuantidadePescaPorTipoType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let qtdPptipoSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const qtdPptipoPadrao = {
                            ...qtdPptipo,
                            id: Id(), 
                           pescaArtesanal: qtdPptipo.pescaArtesanal!.id,
                        };
            
                        qtdPptipoSalvo = realmInstance.create('QuantidadePescaPorTipo', qtdPptipoPadrao, true);
                        //console.log("salvarPescaArtesanalQueue", pescaArtesanalPadrao)
                    });

                    if (qtdPptipoSalvo) {
                        const cleanQtdPptipo = JSON.parse(JSON.stringify(qtdPptipoSalvo))
                        resolve(cleanQtdPptipo as QuantidadePescaPorTipoType);
                    } else {
                    throw new Error("Erro ao recuperar a pescaArtesanal salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarQtdPptipo= (qtdPptipo:QuantidadePescaPorTipoType): Promise<QuantidadePescaPorTipoType> => {
    return new Promise((resolve, reject) => {

        try {
            let qtdPptipoSalvo;
            realmInstance.write(() => {
                const qtdPptipoExistente = realmInstance
                    .objects<QuantidadePescaPorTipoType>("QuantidadePescaPorTipo")
                    .filtered(`id == ${qtdPptipo.id}`)[0];

                const qtdPptipoPadrao = {
                    ...qtdPptipo,
                    pescaArtesanal: qtdPptipo.pescaArtesanal.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (qtdPptipo.sincronizado && qtdPptipoExistente && qtdPptipo.idLocal === '') {
                    qtdPptipoSalvo = realmInstance.create("QuantidadePescaPorTipo", qtdPptipoPadrao, true);
                } else {
                    qtdPptipoSalvo = realmInstance.create("QuantidadePescaPorTipo", qtdPptipoPadrao, true);
                }
            });
    if (qtdPptipoSalvo) {
        const cleanQtdPptipo = JSON.parse(JSON.stringify(qtdPptipoSalvo))
        resolve(cleanQtdPptipo as QuantidadePescaPorTipoType);
    } else {
    throw new Error("Erro ao recuperar a qtdPptipo salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getQtdPescaPorTipoPesca = (pescaArtesanalId: number): QuantidadePescaPorTipoType[] => {
    const query = `pescaArtesanal == ${pescaArtesanalId}`;
    const destinosPesca = realmInstance.objects<QuantidadePescaPorTipoType>('QuantidadePescaPorTipo').filtered(query).slice();
    return JSON.parse(JSON.stringify(destinosPesca)) as QuantidadePescaPorTipoType[];
};

export const getQuantidadesPescaPorTipoDessincronizados = (pescaArtesanalId: number): QuantidadePescaPorTipoType[] => {
    const query = `pescaArtesanal == "${pescaArtesanalId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const qtdPptipoQueue = realmInstance.objects<QuantidadePescaPorTipoType>('QuantidadePescaPorTipo').filtered(query).slice();
    return JSON.parse(JSON.stringify(qtdPptipoQueue)) as QuantidadePescaPorTipoType[];
};

export const setIdPescaArtesanalFromApiOnQtdPptipo = (idPescaArtesanalApi: number, pescaArtesanalIdLocal: string) => {
    try {
        const query = `idFather == "${pescaArtesanalIdLocal}" AND sincronizado == false`;
        const qtdPptipoQueue = realmInstance.objects('QuantidadePescaPorTipo').filtered(query);

        if (qtdPptipoQueue.length > 0) {
            realmInstance.write(() => {
                qtdPptipoQueue.forEach(qtdPptipoOrfan => {
                    qtdPptipoOrfan.pescaArtesanal = idPescaArtesanalApi;
                    qtdPptipoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de destinosPesca:', error);
    }
};

export const apagarPescaPorTipoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const qtdPptipoExcluir = realmInstance.objects<QuantidadePescaPorTipoType>('QuantidadePescaPorTipo').filtered(query);
            if (qtdPptipoExcluir.length > 0) {
                realmInstance.delete(qtdPptipoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir qtdPptipo da fila:', error);
    }
};

export const apagarQuantidadePescaPorTipoSyncronizada = (quantidadePescaPorTipoId: number) => {
  try {
    realmInstance.write(() => {
      const query = `id == ${quantidadePescaPorTipoId}`;
      const quantidadePescaPorTipoExcluir = realmInstance.objects<QuantidadePescaPorTipoType>("QuantidadePescaPorTipo").filtered(query);
      if (quantidadePescaPorTipoExcluir.length > 0) {
        realmInstance.delete(quantidadePescaPorTipoExcluir);
      }
    });
  } catch (error) {
    console.error("Erro ao excluir quantidadePescaPorTipo sincronizada:", error);
  }
};
