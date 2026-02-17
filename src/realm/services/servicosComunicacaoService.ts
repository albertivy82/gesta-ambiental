import { ServicosComunicacaoInput } from '../../shared/types/ComunicacaoInput';
import { ServicosComunicacaoType } from '../../shared/types/ComunicacaoType';
import { realmInstance } from './databaseService';


export const salvarServicosComunicacao = (servicosComunicacao: ServicosComunicacaoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        servicosComunicacao.forEach(servico => {
          const servicoRealm = realmInstance.objects('ServicosComunicacao').filtered(`id == ${servico.id}`)[0];
          if (servico.sincronizado && servicoRealm && servico.idLocal == '') {
            const servicoPadrao = {
              ...servico,
              benfeitoria: servico.benfeitoria.id,
            };
            realmInstance.create('ServicosComunicacao', servicoPadrao, true);
          } else {
            const servicoPadrao = {
              ...servico,
              benfeitoria: servico.benfeitoria.id,
            };
            realmInstance.create('ServicosComunicacao', servicoPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarservicosComunicacaoQueue = (servicosComunicacao:ServicosComunicacaoInput): Promise<ServicosComunicacaoType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let servicosComunicacaoSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const servicosComunicacaoPadrao = {
                            ...servicosComunicacao,
                            id: Id(), 
                           benfeitoria: servicosComunicacao.benfeitoria!.id,
                        };
            
                        servicosComunicacaoSalvo = realmInstance.create('ServicosComunicacao', servicosComunicacaoPadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (servicosComunicacaoSalvo) {
                        const cleanservicosComunicacao = JSON.parse(JSON.stringify(servicosComunicacaoSalvo))
                        resolve(cleanservicosComunicacao as ServicosComunicacaoType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarservicosComunicacao= (servicosComunicacao:ServicosComunicacaoType): Promise<ServicosComunicacaoType> => {
    return new Promise((resolve, reject) => {

        try {
            let servicosComunicacaoSalvo;
            realmInstance.write(() => {
                const servicosComunicacaoExistente = realmInstance
                    .objects<ServicosComunicacaoType>("ServicosComunicacao")
                    .filtered(`id == ${servicosComunicacao.id}`)[0];

                const servicosComunicacaoPadrao = {
                    ...servicosComunicacao,
                    benfeitoria: servicosComunicacao.benfeitoria.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (servicosComunicacao.sincronizado && servicosComunicacaoExistente && servicosComunicacao.idLocal === '') {
                    servicosComunicacaoSalvo = realmInstance.create("ServicosComunicacao", servicosComunicacaoPadrao, true);
                } else {
                    servicosComunicacaoSalvo = realmInstance.create("ServicosComunicacao", servicosComunicacaoPadrao, true);
                }
            });
    if (servicosComunicacaoSalvo) {
        const cleanservicosComunicacao = JSON.parse(JSON.stringify(servicosComunicacaoSalvo))
        resolve(cleanservicosComunicacao as ServicosComunicacaoType);
    } else {
    throw new Error("Erro ao recuperar a servicosComunicacao salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getServicosComunicacao = (benfeitoriaId: number): ServicosComunicacaoType[] => {
  const query = `benfeitoria == ${benfeitoriaId}`;
  const servicosComunicacao = realmInstance
    .objects<ServicosComunicacaoType>('ServicosComunicacao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(servicosComunicacao)) as ServicosComunicacaoType[];
};

export const getServicosComunicacaoDessincronizados = (benfeitoriaId: number): ServicosComunicacaoType[] => {
  const query = `benfeitoria == ${benfeitoriaId} AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const servicosQueue = realmInstance
    .objects<ServicosComunicacaoType>('ServicosComunicacao')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(servicosQueue)) as ServicosComunicacaoType[];
};

export const setIdBenfeitoriaFromApiOnCS = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
    const servicosQueue = realmInstance.objects('ServicosComunicacao').filtered(query);

    if (servicosQueue.length === 0) {
      // console.log("Nenhuma benfeitoria encontrada para o ID local:", imovelIdLocal);
      return false;
    }

    if (servicosQueue.length > 0) {
      realmInstance.write(() => {
        servicosQueue.forEach(servicoOrfan => {
          servicoOrfan.benfeitoria = idBenfeitoriaApi;
          servicoOrfan.idFather = '';
        });
      });
    }
    return true;
  } catch (error) {
    console.error('Erro ao atualizar serviços de comunicação:', error);
    return false;
  }
};

export const apagarServicoComunicacaoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const servicoExcluir = realmInstance.objects<ServicosComunicacaoType>('ServicosComunicacao').filtered(query);
      if (servicoExcluir.length > 0) {
        realmInstance.delete(servicoExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir serviço de comunicação da fila:', error);
  }
};

export const apagarServicosComunicacaoSyncronizada = (servicosComunicacaoId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${servicosComunicacaoId}"`;
            const servicosComunicacaoExcluir = realmInstance.objects<ServicosComunicacaoType>('ServicosComunicacao').filtered(query);

            if (servicosComunicacaoExcluir.length > 0) {

             realmInstance.delete(servicosComunicacaoExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir benfeitoria da fila:', error);
    }
};
