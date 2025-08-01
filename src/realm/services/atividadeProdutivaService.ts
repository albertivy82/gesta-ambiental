import { AtividadeProdutivaType } from '../../shared/types/AtividadeProdutiva';
import { AtividadeProdutivaInput } from '../../shared/types/AtividadeProdutivaInput';
import { realmInstance } from './databaseService';


export const salvarAtividadesProdutivas = (atividades: AtividadeProdutivaType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        atividades.forEach(atividade => {
          const atividadeRealm = realmInstance.objects('AtividadeProdutiva').filtered(`id == ${atividade.id}`)[0];
          if (atividade.sincronizado && atividadeRealm && atividade.idLocal == '') {
            const atividadePadrao = {
              ...atividade,
              benfeitoria: atividade.benfeitoria.id,
            };
            realmInstance.create('AtividadeProdutiva', atividadePadrao, true);
          } else {
            const atividadePadrao = {
              ...atividade,
              benfeitoria: atividade.benfeitoria.id,
            };
            realmInstance.create('AtividadeProdutiva', atividadePadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarAtividadeQueue = (atividade:AtividadeProdutivaInput): Promise<AtividadeProdutivaType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let atividadeSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const atividadePadrao = {
                            ...atividade,
                            id: Id(), 
                           benfeitoria: atividade.benfeitoria!.id,
                        };
            
                        atividadeSalvo = realmInstance.create('AtividadeProdutiva', atividadePadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (atividadeSalvo) {
                        const cleanAtividade = JSON.parse(JSON.stringify(atividadeSalvo))
                        resolve(cleanAtividade as AtividadeProdutivaType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarAtividade= (atividade:AtividadeProdutivaType): Promise<AtividadeProdutivaType> => {
    return new Promise((resolve, reject) => {

        try {
            let atividadeSalvo;
            realmInstance.write(() => {
                const atividadeExistente = realmInstance
                    .objects<AtividadeProdutivaType>("AtividadeProdutiva")
                    .filtered(`id == ${atividade.id}`)[0];

                const atividadePadrao = {
                    ...atividade,
                    benfeitoria: atividade.benfeitoria.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (atividade.sincronizado && atividadeExistente && atividade.idLocal === '') {
               
                    atividadeSalvo = realmInstance.create("AtividadeProdutiva", atividadePadrao, true);
                    console.log(atividadeSalvo)
                } else {
                    atividadeSalvo = realmInstance.create("AtividadeProdutiva", atividadePadrao, true);
                    console.log(atividadeSalvo)
                }
            });
    if (atividadeSalvo) {
        const cleanAtividade = JSON.parse(JSON.stringify(atividadeSalvo))
       
        resolve(cleanAtividade as AtividadeProdutivaType);
    } else {
    throw new Error("Erro ao recuperar a atividade salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getAtividadesProdutivas = (benfeitoriaId: number): AtividadeProdutivaType[] => {
  const query = `benfeitoria == ${benfeitoriaId}`;
  const atividades = realmInstance.objects<AtividadeProdutivaType>('AtividadeProdutiva').filtered(query).slice();
  return JSON.parse(JSON.stringify(atividades)) as AtividadeProdutivaType[];
};

export const getAtividadesProdutivasDessincronizadas = (benfeitoriaId: number): AtividadeProdutivaType[] => {
  const query = `benfeitoria == ${benfeitoriaId} AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const atividadesQueue = realmInstance.objects<AtividadeProdutivaType>('AtividadeProdutiva').filtered(query).slice();
  return JSON.parse(JSON.stringify(atividadesQueue)) as AtividadeProdutivaType[];
};

export const setIdBenfeitoriaFromApiOnAtvProd = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
    const atividadesQueue = realmInstance.objects('AtividadeProdutiva').filtered(query);

    if (atividadesQueue.length > 0) {
      realmInstance.write(() => {
        atividadesQueue.forEach(atividadeOrfan => {
          atividadeOrfan.benfeitoria = idBenfeitoriaApi;
          atividadeOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar atividades produtivas:', error);
  }
};

export const apagarAtividadeProdutivaQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const atividadeExcluir = realmInstance.objects<AtividadeProdutivaType>('AtividadeProdutiva').filtered(query);
      if (atividadeExcluir.length > 0) {
        realmInstance.delete(atividadeExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir atividade produtiva da fila:', error);
  }
};

export const apagarAtividadeProdutivaSyncronizada = (atividadeProdutivaId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${atividadeProdutivaId}"`;
            const atividadeProdutivaExcluir = realmInstance.objects<AtividadeProdutivaType>('AtividadeProdutiva').filtered(query);

            if (atividadeProdutivaExcluir.length > 0) {

             realmInstance.delete(atividadeProdutivaExcluir);
             
            } 
        });
    } catch (error) {
        console.error('apagarBenfeitoriaSyncronizado/Erro ao excluir AtividadeProdutiva da fila:', error);
    }
};
