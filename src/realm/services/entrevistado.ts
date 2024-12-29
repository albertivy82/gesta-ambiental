import { EntrevistadoInput } from '../../shared/types/EntrevistadoInput';
import { EntrevistadoType } from '../../shared/types/EntrevistadoType';
import { realmInstance } from './databaseService';


export const salvarEntrevistados = (entrevistado: EntrevistadoType) => {
    return new Promise<void>((resolve, reject) => {
      try {
        realmInstance.write(() => {
          const entrevistadoRealm = realmInstance
            .objects('Entrevistado')
            .filtered(`id == ${entrevistado.id}`)[0];
  
          console.log("Recebido para salvar:", entrevistado);
  
          const entrevistadoPadrao = {
            ...entrevistado,
            imovel: entrevistado.imovel.id,
          };
  
          realmInstance.create('Entrevistado', entrevistadoPadrao, true);
  
          console.log("Entrevistado salvo:", entrevistadoPadrao);
        });
  
        resolve();
      } catch (error) {
        console.error("Erro ao salvar entrevistado:", error);
        reject(error);
      }
    });
  };
  

export const setIdImovelFromApiOnEntrevistado = (idImovelApi: number, imovelIdLocal: string) => {
    try {
        const query = `idFather == "${imovelIdLocal}" AND (sincronizado == false and sincronizado == false)`;
        const entrevistadoQueue = realmInstance.objects('Entrevistado').filtered(query);

        //console.log("Conjunto de benfeitorias que precisam receber o ID do pai:", benfeitoriaQueue);

        if (entrevistadoQueue.length > 0) {
            realmInstance.write(() => {
                entrevistadoQueue.forEach(entrevistadoOrfan => {
                   // console.log("Atualizando benfeitoria:", benfeitoriaOrfan);
                    // Atualizar o ID do pai (imovel) para o ID vindo da API
                    entrevistadoOrfan.imovel = idImovelApi;
                    // Se quiser manter o idFather para referência futura, pode comentá-la
                    entrevistadoOrfan.idFather = '';  
                });
            });

           // console.log("Benfeitorias atualizadas com o novo ID:", benfeitoriaQueue);
        } else {
           // console.log("Nenhuma benfeitoria encontrada para o ID local:", imovelIdLocal);
        }

       // console.log("setIdImovelFromApi completado");

    } catch (error) {
        console.error("Erro ao atualizar benfeitorias:", error);
    }
};

export const salvarEntrevistadoQueue = (entrevistado: EntrevistadoInput) => {
    return new Promise<void>((resolve, reject) => {
        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return -Math.floor(Math.random() * (max - min + 1)) + min;
        };

        try {
            realmInstance.write(() => {
                const entrevistadoPadrao = {
                    ...entrevistado,
                    id: Id(),
                    imovel: entrevistado.imovel!.id,
                };
                console.log(entrevistadoPadrao)
                realmInstance.create('Entrevistado', entrevistadoPadrao, true);
                
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getEntrevistado = (imovel: number): EntrevistadoType | null => {
    const query = `imovel == ${imovel}`;
    const entrevistados = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query);

    // Verifica se há algum entrevistado e retorna o primeiro
    if (entrevistados.length > 0) {
        const entrevistado = entrevistados[0];
        const cleanEntrevistado = JSON.parse(JSON.stringify(entrevistado));
        console.log('getEntrevistado', cleanEntrevistado);
        return cleanEntrevistado as EntrevistadoType;
    }

    // Retorna null se não encontrar nenhum entrevistado
    return null;
};


export const getAllEntrevistados = (): EntrevistadoType[] => {
    const entrevistados = realmInstance.objects<EntrevistadoType>('Entrevistado');
    const cleanEntrevistados = JSON.parse(JSON.stringify(entrevistados));
    console.log('getAllEntrevistados', cleanEntrevistados);
    return cleanEntrevistados as EntrevistadoType[];
};

export const getEntrevistadosDessincronizados = (idImovelApi: number): EntrevistadoType | undefined => {
    const query = `imovel == "${idImovelApi}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const entrevistadosQueue = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query);
    
    const cleanedQueue = entrevistadosQueue.map(entrevistado => ({ ...entrevistado }));
    const primeiroRegistro = cleanedQueue[0];

    console.log('getEntrevistadosDessincronizados', primeiroRegistro);
    return primeiroRegistro;
};

export const getEntrevistadosPendente = (EntrevistadoIdLocal:string): EntrevistadoType => {
    const query = `idLocal == "${EntrevistadoIdLocal}"`;
    const entrevistadosQueue = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query);
    
    const cleanedQueue = entrevistadosQueue.map(entrevistado => ({ ...entrevistado }));
    const primeiroRegistro = cleanedQueue[0];
    
   console.log(primeiroRegistro);
    return primeiroRegistro;
};

export const apagarEntrevistadoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const entrevistadoExcluir = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query);

            if (entrevistadoExcluir.length > 0) {
                realmInstance.delete(entrevistadoExcluir);
            }
        });
        console.log('apagarEntrevistadoQueue');
    } catch (error) {
        console.error('Erro ao excluir entrevistado da fila:', error);
    }
};




export const apagarQueueEntrevistados = () => {
    try {
        realmInstance.write(() => {
            const entrevistadoExcluir = realmInstance.objects<EntrevistadoType>('Entrevistado');

            if (entrevistadoExcluir.length > 0) {
                realmInstance.delete(entrevistadoExcluir);
                console.log(`${entrevistadoExcluir.length} entrevistados excluídos com sucesso.`);
            } else {
                console.log('Nenhum entrevistado encontrado para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir entrevistados da fila:', error);
    }
};



