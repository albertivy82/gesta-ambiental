
import { ParticipacaoInstituicaoInput } from '../../shared/types/ParticipacaoInstituicaoInput';
import { ParticipacaoInstituicaoType } from '../../shared/types/ParticipacaoInstituicaoType';
import { realmInstance } from './databaseService';

export const salvarParticipacoesIntitucionais = (participacoesIntitucionais: ParticipacaoInstituicaoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        participacoesIntitucionais.forEach(participacaoInstituicao => {
          const participacaoInstituicaoRealm = realmInstance.objects('ParticipacaoInstituicao').filtered(`id == ${participacaoInstituicao.id}`)[0];
          if (participacaoInstituicao.sincronizado && participacaoInstituicaoRealm && participacaoInstituicao.idLocal == '') {
            const participacaoInstituicaoPadrao = {
              ...participacaoInstituicao,
              morador: participacaoInstituicao.morador.id,
            };
            realmInstance.create('ParticipacaoInstituicao', participacaoInstituicaoPadrao, true);
          } else {
            
            const participacaoInstituicaoPadrao = {
              ...participacaoInstituicao,
              morador: participacaoInstituicao.morador.id,
            };
            realmInstance.create('ParticipacaoInstituicao', participacaoInstituicaoPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarParticipacaoInstituicaoQueue = (participacaoInstituicao:ParticipacaoInstituicaoInput): Promise<ParticipacaoInstituicaoType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let participacaoInstituicaoSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const participacaoInstituicaoPadrao = {
                            ...participacaoInstituicao,
                            id: Id(), 
                           morador: participacaoInstituicao.morador!.id,
                        };
            
                        participacaoInstituicaoSalvo = realmInstance.create('ParticipacaoInstituicao', participacaoInstituicaoPadrao, true);
                        //console.log("salvarEntrevistadoQueue", benfeitoriaPadrao)
                    });

                    if (participacaoInstituicaoSalvo) {
                        const cleanParticipacaoInstituicao = JSON.parse(JSON.stringify(participacaoInstituicaoSalvo))
                        resolve(cleanParticipacaoInstituicao as ParticipacaoInstituicaoType);
                    } else {
                    throw new Error("Erro ao recuperar a participacaoInstituicao salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarParticipacaoInstituicao= (participacaoInstituicao:ParticipacaoInstituicaoType): Promise<ParticipacaoInstituicaoType> => {
    return new Promise((resolve, reject) => {
      console.log("rastreando objeto", participacaoInstituicao)
        try {
            let participacaoInstituicaoSalvo;
            realmInstance.write(() => {
                const participacaoInstituicaoExistente = realmInstance
                    .objects<ParticipacaoInstituicaoType>("ParticipacaoInstituicao")
                    .filtered(`id == ${participacaoInstituicao.id}`)[0];
                    
                const participacaoInstituicaoPadrao = {
                    ...participacaoInstituicao,
                    morador: participacaoInstituicao.morador.id,
                };



                // Atualiza somente se sincronizado ou se não existir ainda
                if (participacaoInstituicao.sincronizado && participacaoInstituicaoExistente && participacaoInstituicao.idLocal === '') {
                    participacaoInstituicaoSalvo = realmInstance.create("ParticipacaoInstituicao", participacaoInstituicaoPadrao, true);
                } else {
                    participacaoInstituicaoSalvo = realmInstance.create("ParticipacaoInstituicao", participacaoInstituicaoPadrao, true);
                }
            });
    if (participacaoInstituicaoSalvo) {
      console.log(participacaoInstituicaoSalvo)
        const cleanParticipacaoInstituicao = JSON.parse(JSON.stringify(participacaoInstituicaoSalvo))
        resolve(cleanParticipacaoInstituicao as ParticipacaoInstituicaoType);
    } else {
    throw new Error("Erro ao recuperar a participacaoInstituicao salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getParticipacoesIntitucionais = (moradorId: number): ParticipacaoInstituicaoType[] => {
  const query = `morador == ${moradorId}`;
  const participacoesIntitucionais = realmInstance
    .objects<ParticipacaoInstituicaoType>('ParticipacaoInstituicao')
    .filtered(query)
    .slice();
  
  return JSON.parse(JSON.stringify(participacoesIntitucionais)) as ParticipacaoInstituicaoType[];
};

export const getParticipacoesIntitucionaisDessincronizadas = (moradorId: number): ParticipacaoInstituicaoType[] => {
   const query = `morador == ${moradorId} AND sincronizado == false AND (idFather == null OR idFather == "")`;

  const participacoesIntitucionaisQueue = realmInstance
    .objects<ParticipacaoInstituicaoType>('ParticipacaoInstituicao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(participacoesIntitucionaisQueue)) as ParticipacaoInstituicaoType[];
};

export const setIdEntrevitadoFromApiOnParticipacaoInstituicao = (idEntrevistadoApi: number, moradorIdLocal: string) => {
  try {
    const query = `idFather == "${moradorIdLocal}" AND sincronizado == false`;
    const participacoesIntitucionaisQueue = realmInstance.objects('ParticipacaoInstituicao').filtered(query);

    if (participacoesIntitucionaisQueue.length === 0) {
      // console.log("Nenhuma benfeitoria encontrada para o ID local:", imovelIdLocal);
      return false;
    }

    if (participacoesIntitucionaisQueue.length > 0) {
      realmInstance.write(() => {
        participacoesIntitucionaisQueue.forEach(participacaoInstituicaoOrfan => {
          participacaoInstituicaoOrfan.morador = idEntrevistadoApi;
          participacaoInstituicaoOrfan.idFather = '';
        });
      });
    }
    return true;
  } catch (error) {
    console.error('Erro ao atualizar vegetações:', error);
    return false;
  }
};

export const apagarParticipacaoInstituicaoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const participacaoInstituicaoExcluir = realmInstance.objects<ParticipacaoInstituicaoType>('ParticipacaoInstituicao').filtered(query);
      if (participacaoInstituicaoExcluir.length > 0) {
        realmInstance.delete(participacaoInstituicaoExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir vegetação da fila:', error);
  }
};

// Apagar posto de saúde sincronizado
export const apagarParticipacaoInstituicaoSyncronizada = (participacaoInstituicaoId: number) => {
  try {
    realmInstance.write(() => {
      const query = `id == ${participacaoInstituicaoId}`;
      const participacaoInstituicaoExcluir = realmInstance.objects<ParticipacaoInstituicaoType>("ParticipacaoInstituicao").filtered(query);
      if (participacaoInstituicaoExcluir.length > 0) {
        realmInstance.delete(participacaoInstituicaoExcluir);
      }
    });
  } catch (error) {
    console.error("Erro ao excluir participacaoInstituicao sincronizado:", error);
  }
};