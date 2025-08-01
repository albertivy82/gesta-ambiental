import { realmInstance } from './databaseService';
import { AguaType } from '../../shared/types/AguaType';
import { AguaInput } from '../../shared/types/AguaInput';


export const salvarAguas = (aguas: AguaType[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      realmInstance.write(() => {
        aguas.forEach(agua => {
          const aguaRealm = realmInstance.objects('Agua').filtered(`id == ${agua.id}`)[0];
          if (agua.sincronizado && aguaRealm && agua.idLocal == '') {
            const aguaPadrao = {
              ...agua,
              benfeitoria: agua.benfeitoria.id,
            };
            realmInstance.create('Agua', aguaPadrao, true);
          } else {
            const aguaPadrao = {
              ...agua,
              benfeitoria: agua.benfeitoria.id,
            };
            realmInstance.create('Agua', aguaPadrao, true);
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarAguaQueue = (agua:AguaInput): Promise<AguaType>=>{
   
   return new Promise((resolve, reject)=>{
   
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
        
                try{
                    let aguaSalvo;
                    
                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const aguaPadrao = {
                            ...agua,
                            id: Id(), 
                           benfeitoria: agua.benfeitoria!.id,
                        };
            
                        aguaSalvo = realmInstance.create('Agua', aguaPadrao, true);
                        //console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    if (aguaSalvo) {
                        const cleanAgua = JSON.parse(JSON.stringify(aguaSalvo))
                        resolve(cleanAgua as AguaType);
                    } else {
                    throw new Error("Erro ao recuperar a benfeitoria salva.");
                    }
                } catch(error){
                    reject(error)
                }
    })
};

export const salvarAgua= (agua:AguaType): Promise<AguaType> => {
    return new Promise((resolve, reject) => {

        try {
            let aguaSalvo;
            realmInstance.write(() => {
                const aguaExistente = realmInstance
                    .objects<AguaType>("Agua")
                    .filtered(`id == ${agua.id}`)[0];

                const aguaPadrao = {
                    ...agua,
                    benfeitoria: agua.benfeitoria.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (agua.sincronizado && aguaExistente && agua.idLocal === '') {
                    aguaSalvo = realmInstance.create("Agua", aguaPadrao, true);
                } else {
                    aguaSalvo = realmInstance.create("Agua", aguaPadrao, true);
                }
            });
            
            if (aguaSalvo) {
                    const cleanAgua = JSON.parse(JSON.stringify(aguaSalvo))
                    console.log("77777", cleanAgua)
                    resolve(cleanAgua as AguaType);
                } else {
                throw new Error("Erro ao recuperar a agua salvo.");
                }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getAguas = (benfeitoriaId: number): AguaType[] => {
  console.log("15", benfeitoriaId)
  const query = `benfeitoria == ${benfeitoriaId}`;
  const aguas = realmInstance.objects<AguaType>('Agua').filtered(query).slice();
  return JSON.parse(JSON.stringify(aguas)) as AguaType[];
};

export const getAguaDessincronizadas = (benfeitoriaId: number): AguaType[] => {
  console.log("seria o probelma aqui?")
  const query = `benfeitoria == ${benfeitoriaId} AND sincronizado == false AND (idFather == null OR idFather == "")`;
  const aguasQueue = realmInstance.objects<AguaType>('Agua').filtered(query).slice();
  return JSON.parse(JSON.stringify(aguasQueue)) as AguaType[];
};

export const setIdBenfeitoriaFromApiOnAguas = (idBenfeitoriaApi: number, benfeitoriaIdLocal: string) => {
  try {
    const query = `idFather == "${benfeitoriaIdLocal}" AND (sincronizado == false and sincronizado == false)`;
    const aguaQueue = realmInstance.objects('Agua').filtered(query);

    if (aguaQueue.length > 0) {
      realmInstance.write(() => {
        aguaQueue.forEach(aguaOrfan => {
          aguaOrfan.benfeitoria = idBenfeitoriaApi;
          aguaOrfan.idFather = '';
        });
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar água:', error);
  }
};

export const apagarAguaQueue = (idLocal: string) => {
  try {
    realmInstance.write(() => {
      const query = `idLocal == "${idLocal}"`;
      const aguaExcluir = realmInstance.objects<AguaType>('Agua').filtered(query);
      if (aguaExcluir.length > 0) {
        realmInstance.delete(aguaExcluir);
      }
    });
  } catch (error) {
    console.error('Erro ao excluir água da fila:', error);
  }
};

export const apagarAguaSyncronizada = (aguaId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${aguaId}"`;
            const aguaExcluir = realmInstance.objects<AguaType>('Agua').filtered(query);

            if (aguaExcluir.length > 0) {

             realmInstance.delete(aguaExcluir);
             
            } 
        });
    } catch (error) {
        console.error('apagarBenfeitoriaSyncronizado/Erro ao excluir benfeitoria da fila:', error);
    }
};
