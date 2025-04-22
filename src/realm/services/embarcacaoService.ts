import { realmInstance } from './databaseService';
import { EmbarcacaoInput } from '../../shared/types/EmbarcacaoInput';
import { EmbarcacaoType } from '../../shared/types/EmbarcacaoType';

export const salvarEmbarcacoes = (embarcacaos: EmbarcacaoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                embarcacaos.forEach(embarcacao => {
                    const embarcacaoRealm = realmInstance.objects('Embarcacao').filtered(`id == ${embarcacao.id}`)[0];
                    if (embarcacao.sincronizado && embarcacaoRealm && embarcacao.idLocal == '') {
                        const embarcacaoPadrao = {
                            ...embarcacao,
                            pescaArtesanal: embarcacao.pescaArtesanal.id,
                        };
                        realmInstance.create('Embarcacao', embarcacaoPadrao, true);
                    } else {
                        const embarcacaoPadrao = {
                            ...embarcacao,
                            pescaArtesanal: embarcacao.pescaArtesanal.id,
                        };
                        realmInstance.create('Embarcacao', embarcacaoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarEmbarcacaoQueue = (embarcacao:EmbarcacaoInput): Promise<EmbarcacaoType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let embarcacaoSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const embarcacaoPadrao = {
                            ...embarcacao,
                            id: Id(), 
                           pescaArtesanal: embarcacao.pescaArtesanal!.id,
                        };
            
                        embarcacaoSalvo = realmInstance.create('Embarcacao', embarcacaoPadrao, true);
                        //console.log("salvarArtesanalQueue", pescaArtesanalPadrao)
                    });

                    if (embarcacaoSalvo) {
                        const cleanEmbarcacao = JSON.parse(JSON.stringify(embarcacaoSalvo))
                        resolve(cleanEmbarcacao as EmbarcacaoType);
                    } else {
                    throw new Error("Erro ao recuperar a pescaArtesanal salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarEmbarcacao= (embarcacao:EmbarcacaoType): Promise<EmbarcacaoType> => {
    return new Promise((resolve, reject) => {

        try {
            let embarcacaoSalvo;
            realmInstance.write(() => {
                const embarcacaoExistente = realmInstance
                    .objects<EmbarcacaoType>("Embarcacao")
                    .filtered(`id == ${embarcacao.id}`)[0];

                const embarcacaoPadrao = {
                    ...embarcacao,
                    pescaArtesanal: embarcacao.pescaArtesanal.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (embarcacao.sincronizado && embarcacaoExistente && embarcacao.idLocal === '') {
                    embarcacaoSalvo = realmInstance.create("Embarcacao", embarcacaoPadrao, true);
                } else {
                    embarcacaoSalvo = realmInstance.create("Embarcacao", embarcacaoPadrao, true);
                }
            });
    if (embarcacaoSalvo) {
        const cleanEmbarcacao = JSON.parse(JSON.stringify(embarcacaoSalvo))
        resolve(cleanEmbarcacao as EmbarcacaoType);
    } else {
    throw new Error("Erro ao recuperar a embarcacao salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getEmbarcacao = (pescaArtesanalId: number): EmbarcacaoType[] => {
    const query = `pescaArtesanal == ${pescaArtesanalId}`;
    const embarcacaos = realmInstance.objects<EmbarcacaoType>('Embarcacao').filtered(query).slice();
    return JSON.parse(JSON.stringify(embarcacaos)) as EmbarcacaoType[];
};

export const getEmbarcacaosDessincronizados = (pescaArtesanalId: number): EmbarcacaoType[] => {
    const query = `pescaArtesanal == "${pescaArtesanalId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const embarcacaoQueue = realmInstance.objects<EmbarcacaoType>('Embarcacao').filtered(query).slice();
    return JSON.parse(JSON.stringify(embarcacaoQueue)) as EmbarcacaoType[];
};

export const setIdArtesanalFromApiOnEmbarcacao = (idArtesanalApi: number, pescaArtesanalIdLocal: string) => {
    try {
        const query = `idFather == "${pescaArtesanalIdLocal}" AND sincronizado == false`;
        const embarcacaoQueue = realmInstance.objects('Embarcacao').filtered(query);

        if (embarcacaoQueue.length > 0) {
            realmInstance.write(() => {
                embarcacaoQueue.forEach(embarcacaoOrfan => {
                    embarcacaoOrfan.pescaArtesanal = idArtesanalApi;
                    embarcacaoOrfan.idFather = '';
                });
            });
        }
    } catch (error) {
        console.error('Erro ao atualizar registros de embarcacaos:', error);
    }
};

export const apagarEmbarcacaoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const embarcacaoExcluir = realmInstance.objects<EmbarcacaoType>('Embarcacao').filtered(query);
            if (embarcacaoExcluir.length > 0) {
                realmInstance.delete(embarcacaoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir embarcacao da fila:', error);
    }
};
