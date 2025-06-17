import { CreditoInput } from '../../shared/types/CreditoInput';
import { CreditoType } from '../../shared/types/CreditoType';
import { realmInstance } from './databaseService';

export const salvarCreditos = (creditos: CreditoType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        creditos.forEach(credito => {
          const creditoRealm = realmInstance.objects('Credito').filtered(`id == ${credito.id}`)[0];
          if (credito.sincronizado && creditoRealm && credito.idLocal == '') {
            const creditoPadrao = {
              ...credito,
              benfeitoria: credito.benfeitoria.id,
            };
            realmInstance.create('Credito', creditoPadrao, true);
          } else {
            const creditoPadrao = {
              ...credito,
              benfeitoria: credito.benfeitoria.id,
            };
            realmInstance.create('Credito', creditoPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarCreditoQueue = (credito:CreditoInput): Promise<CreditoType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let creditoSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const creditoPadrao = {
                            ...credito,
                            id: Id(), 
                           benfeitoria: credito.benfeitoria!.id,
                        };
            
                        creditoSalvo = realmInstance.create('Credito', creditoPadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (creditoSalvo) {
                        const cleanCredito = JSON.parse(JSON.stringify(creditoSalvo))
                        resolve(cleanCredito as CreditoType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarCredito= (credito:CreditoType): Promise<CreditoType> => {
    return new Promise((resolve, reject) => {

        try {
            let creditoSalvo;
            realmInstance.write(() => {
                const creditoExistente = realmInstance
                    .objects<CreditoType>("Credito")
                    .filtered(`id == ${credito.id}`)[0];

                const creditoPadrao = {
                    ...credito,
                    benfeitoria: credito.benfeitoria.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (credito.sincronizado && creditoExistente && credito.idLocal === '') {
                    creditoSalvo = realmInstance.create("Credito", creditoPadrao, true);
                } else {
                    creditoSalvo = realmInstance.create("Credito", creditoPadrao, true);
                }
            });
    if (creditoSalvo) {
        const cleanCredito = JSON.parse(JSON.stringify(creditoSalvo))
        resolve(cleanCredito as CreditoType);
    } else {
    throw new Error("Erro ao recuperar a credito salvo.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getCreditos = (benfeitoriaId: number): CreditoType[] => {
  const query = `benfeitoria == ${benfeitoriaId}`;
  const creditos = realmInstance
    .objects<CreditoType>('Credito')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(creditos)) as CreditoType[];
};

export const getCreditosDessincronizados = (benfeitoriaId: number): CreditoType[] => {
  const query = `benfeitoria == "${benfeitoriaId}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const creditosQueue = realmInstance
    .objects<CreditoType>('Credito')
    .filtered(query)
    .slice();
  return JSON.parse(JSON.stringify(creditosQueue)) as CreditoType[];
};

export const setIdBenfeitoriaFromApiCredito = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND sincronizado == false`;
    const creditosQueue = realmInstance.objects('Credito').filtered(query);

    if (creditosQueue.length > 0) {
      realmInstance.write(() => {
        creditosQueue.forEach(creditoOrfan => {
          creditoOrfan.benfeitoria = idBenfeitoriaApi;
          creditoOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar créditos:', error);
  }
};

export const apagarCreditoQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const creditoExcluir = realmInstance.objects<CreditoType>('Credito').filtered(query);
      if (creditoExcluir.length > 0) {
        realmInstance.delete(creditoExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir crédito da fila:', error);
  }
};


export const apagarCreditoSyncronizada = (creditoId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${creditoId}"`;
            const creditoExcluir = realmInstance.objects<CreditoType>('Credito').filtered(query);

            if (creditoExcluir.length > 0) {

             realmInstance.delete(creditoExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir crédito da fila:', error);
    }
};
