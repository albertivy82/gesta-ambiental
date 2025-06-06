import { postoSaudeInput } from "../../shared/types/postoSaudeInput";
import { PostoType } from "../../shared/types/postoTypes";
import { realmInstance } from "./databaseService";


// Salvar Postos de Saúde no banco de dados local
export const salvarPostos = (postos: PostoType[]) =>{

    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

                postos.forEach(posto=>{

                    //essa duplicação de código foi feita para controlar atualizações de todas os registros
                    //a primeira condição entram apenas atualizações
                    //no segundo novos registros
                    const postoRealm = realmInstance.objects('Posto').filtered(`id == ${posto.id}`)[0];
                    //console.log('Imóvel recuperado do Realm:', imovelRealm);
                    if(posto.sincronizado && postoRealm && posto.idLocal==''){
                       // console.log('Atualizando imóvel existente:', imovel);
                              const postoPadrao ={
                                    ...posto,
                                    localidade: posto.localidade.id,
                                };

                                realmInstance.create('Posto', postoPadrao, true);
                    }else{
                       // console.log('Inserindo novo imóvel ou atualizando imóvel com condições diferentes:', imovel);
                        const imovelPadrao ={
                            ...posto,
                           localidade: posto.localidade.id,
                        };

                        realmInstance.create('Posto', imovelPadrao, true);
                    }
                   
                
                });


               
            });

            resolve();

        }catch(error){
            reject(error)
        }
    
    
    
    });

};
// Adicionar posto de saúde à fila de sincronização
export const salvarPostoSaudeQueue = (posto: postoSaudeInput): Promise<PostoType> => {
  return new Promise((resolve, reject) => {
    const Id = () => {
      const min = Math.ceil(0);
      const max = -Math.floor(1000);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    try {
      let postoSalvo;
      realmInstance.write(() => {
        const postoPadrao = {
          ...posto,
          id: Id(), // Gera ID temporário negativo
          localidade: posto.localidade.id,
        };
        postoSalvo = realmInstance.create("Posto", postoPadrao, true);
      });
      const cleanPosto = JSON.parse(JSON.stringify(postoSalvo))
      resolve(cleanPosto as PostoType);
      
    } catch (error) {
      reject(error);
    }
  });
};

export const salvarPosto= (posto:PostoType): Promise<PostoType> => {
    return new Promise((resolve, reject) => {

        try {
            let postoSalvo;
            realmInstance.write(() => {
                const postoExistente = realmInstance
                    .objects<PostoType>("Posto")
                    .filtered(`id == ${posto.id}`)[0];

                const postoPadrao = {
                    ...posto,
                    localidade: posto.localidade.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (posto.sincronizado && postoExistente && posto.idLocal === '') {
                    postoSalvo = realmInstance.create("Posto", postoPadrao, true);
                } else {
                    postoSalvo = realmInstance.create("Posto", postoPadrao, true);
                }
            });
    if (postoSalvo) {
        const cleanPosto = JSON.parse(JSON.stringify(postoSalvo))
        resolve(cleanPosto as PostoType);
    } else {
    throw new Error("Erro ao recuperar a posto salva.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};

export const getPostos=(localidade:number): PostoType[] =>{

  const query = `localidade == ${localidade}`;

  const postosRealm = realmInstance.objects<PostoType>('Posto').filtered(query).slice();

  const postoSimplificado = JSON.parse(JSON.stringify(postosRealm));
  
return postoSimplificado as PostoType[];
}

export const getPostosDessincronizados = (localidade: number): PostoType[] => {
  const query = `localidade == ${localidade} and sincronizado == false`;
  const postosQueue = realmInstance.objects<PostoType>('Posto').filtered(query).slice();
  const cleanedQueue = JSON.parse(JSON.stringify(postosQueue));

  return cleanedQueue as PostoType[];
};

export const apagarPostoQueue = (postoIdLocal: string) => {
  try {
      realmInstance.write(() => {
          const query = `idLocal == "${postoIdLocal}"`;
          const postoAExcluir = realmInstance.objects<PostoType>('Posto').filtered(query);

          if (postoAExcluir.length > 0) {
              realmInstance.delete(postoAExcluir);
          }
      });
  } catch (error) {
      console.error(`Erro ao excluir posto da fila com idLocal ${postoIdLocal}:`, error);
  }
};

// Apagar posto de saúde sincronizado
export const apagarPostoSaudeSyncronizado = (postoId: number) => {
  try {
    realmInstance.write(() => {
      const query = `id == ${postoId}`;
      const postoAExcluir = realmInstance.objects<PostoType>("Posto").filtered(query);
      if (postoAExcluir.length > 0) {
        realmInstance.delete(postoAExcluir);
      }
    });
  } catch (error) {
    console.error("Erro ao excluir posto de saúde sincronizado:", error);
  }
};
