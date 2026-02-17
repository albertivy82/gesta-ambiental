import { realmInstance } from './databaseService';
import { ParticipacaoInstituicaoInput } from '../../shared/types/ParticipacaoInstituicaoInput';
import { ParticipacaoInstituicaoType } from '../../shared/types/ParticipacaoInstituicaoType';

export const salvarInstituicoes = (instituicoes: ParticipacaoInstituicaoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                instituicoes.forEach(instituicao => {
                    const instituicaoRealm = realmInstance.objects('ParticipacaoInstituicao').filtered(`id == ${instituicao.id}`)[0];
                    if (instituicao.sincronizado && instituicaoRealm && instituicao.idLocal == '') {
                        const instituicaoPadrao = {
                            ...instituicao,
                            morador: instituicao.morador.id,
                        };
                        realmInstance.create('ParticipacaoInstituicao', instituicaoPadrao, true);
                    } else {
                        const instituicaoPadrao = {
                            ...instituicao,
                            morador: instituicao.morador.id,
                        };
                        realmInstance.create('ParticipacaoInstituicao', instituicaoPadrao, true);
                    }
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const salvarInstituicaoQueue = (instituicao:ParticipacaoInstituicaoInput): Promise<ParticipacaoInstituicaoType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let instituicaoSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const instituicaoPadrao = {
                            ...instituicao,
                            id: Id(), 
                           morador: instituicao.morador!.id,
                        };
            
                        instituicaoSalvo = realmInstance.create('ParticipacaoInstituicao', instituicaoPadrao, true);
                        //console.log("salvarBenfeitoriaQueue", moradorPadrao)
                    });

                    if (instituicaoSalvo) {
                        const cleanInstituicao = JSON.parse(JSON.stringify(instituicaoSalvo))
                        resolve(cleanInstituicao as ParticipacaoInstituicaoType);
                    } else {
                    throw new Error("Erro ao recuperar a morador salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarInstituicao= (instituicao:ParticipacaoInstituicaoType): Promise<ParticipacaoInstituicaoType> => {
    return new Promise((resolve, reject) => {

        try {
            let instituicaoSalvo;
            realmInstance.write(() => {
                const instituicaoExistente = realmInstance
                    .objects<ParticipacaoInstituicaoType>("ParticipacaoInstituicao")
                    .filtered(`id == ${instituicao.id}`)[0];

                const instituicaoPadrao = {
                    ...instituicao,
                    morador: instituicao.morador.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (instituicao.sincronizado && instituicaoExistente && instituicao.idLocal === '') {
                    instituicaoSalvo = realmInstance.create("ParticipacaoInstituicao", instituicaoPadrao, true);
                } else {
                    instituicaoSalvo = realmInstance.create("ParticipacaoInstituicao", instituicaoPadrao, true);
                }
            });
    if (instituicaoSalvo) {
        const cleanInstituicao = JSON.parse(JSON.stringify(instituicaoSalvo))
        resolve(cleanInstituicao as ParticipacaoInstituicaoType);
    } else {
    throw new Error("Erro ao recuperar a instituicao salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};


export const getInstituicoes = (moradorId: number): ParticipacaoInstituicaoType[] => {
    const query = `morador == ${moradorId}`;
    const instituicoes = realmInstance.objects<ParticipacaoInstituicaoType>('ParticipacaoInstituicao').filtered(query).slice();
    return JSON.parse(JSON.stringify(instituicoes)) as ParticipacaoInstituicaoType[];
};

export const getInstituicoesDessincronizados = (moradorId: number): ParticipacaoInstituicaoType[] => {
    const query = `morador == "${moradorId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const instituicaoQueue = realmInstance.objects<ParticipacaoInstituicaoType>('ParticipacaoInstituicao').filtered(query).slice();
    return JSON.parse(JSON.stringify(instituicaoQueue)) as ParticipacaoInstituicaoType[];
};

export const setIdMoradorFromApiOnInstituicao = (idMoradoriaApi: number, moradorIdLocal: string) => {
    try {
        const query = `idFather == "${moradorIdLocal}" AND sincronizado == false`;
        const instituicaoQueue = realmInstance.objects('ParticipacaoInstituicao').filtered(query);

        if (!instituicaoQueue) {
           return false;
          }

        if (instituicaoQueue.length > 0) {
            realmInstance.write(() => {
                instituicaoQueue.forEach(instituicaoOrfan => {
                    instituicaoOrfan.morador = idMoradoriaApi;
                    instituicaoOrfan.idFather = '';
                });
            });
        }
        return true;
    } catch (error) {
        console.error('Erro ao atualizar registros de instituicoes:', error);
        return false;
    }
};

export const apagarInstituicaoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const instituicaoExcluir = realmInstance.objects<ParticipacaoInstituicaoType>('ParticipacaoInstituicao').filtered(query);
            if (instituicaoExcluir.length > 0) {
                realmInstance.delete(instituicaoExcluir);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir instituicao da fila:', error);
    }
};
