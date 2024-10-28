import { realmInstance } from './databaseService';
import { BenfeitoriaType } from '../../shared/types/BenfeitoriaType';
import { BenfeitoriaInput } from '../../shared/types/BenfeitoriaInput';
import { imovelBody } from '../../shared/types/imovelType';




export const salvarBenfeitoria = (benfeitorias: BenfeitoriaType[]) => {
    
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                benfeitorias.forEach(benfeitoria => {
                   
                    const benfeitoriaCorrigida = {
                        ...benfeitoria,
                        imovel: benfeitoria.imovel.id
                    };

                    realmInstance.create('Benfeitoria', benfeitoriaCorrigida, true);
                    console.log("salvarBenfeitoria", benfeitoriaCorrigida)
                    
                });
            });
            resolve();
        } catch (error) {
            reject(error)
        }
    })
};

export const salvarBenfeitoriaQueue = (benfeitoria:BenfeitoriaInput)=>{
   
   return new Promise<void>((resolve, reject)=>{

        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return - Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
                try{

                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const benfeitoriaPadrao = {
                            ...benfeitoria,
                            id: Id(), 
                           imovel: benfeitoria.imovel!.id,
                        };
            
                        realmInstance.create('Benfeitoria', benfeitoriaPadrao, true);
                        console.log("salvarBenfeitoriaQueue", benfeitoriaPadrao)
                    });

                    resolve()
                } catch(error){
                    reject(error)
                }
    })
};



export const getBenfeitorias = (imovel:number): BenfeitoriaType[]=>{

    const query = `imovel == ${imovel}`;
    
    const benfeitorias = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query).slice(); 
    
    const cleanBenfeitoria = JSON.parse(JSON.stringify(benfeitorias));

    console.log("getBenfeitorias", cleanBenfeitoria)
    
    return cleanBenfeitoria as BenfeitoriaType[];
};


export const getAllBenfeitorias=()=>{

    const benfeitorias = realmInstance.objects<BenfeitoriaType>('Benfeitoria');
    const cleanBenfeitoria = JSON.parse(JSON.stringify(benfeitorias));

    console.log("getBenfeitorias", cleanBenfeitoria)
    
    return cleanBenfeitoria as BenfeitoriaType[];
};


export const getBenfeitoriaDessincronizadas = (idImovelApi: number): BenfeitoriaType[] => {
   
    console.log("benfeitpria. ponto de sisncronização 3", idImovelApi)
    const query = `imovel == "${idImovelApi}" AND sincronizado == false AND (idFather == null OR idFather == "")`;
    const imoveisQueue = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query);

    //cópia para evitar modificações, mapear os objetos para um novo formato 
    const cleanedQueue = imoveisQueue.map(benfeitoria => ({
        ...benfeitoria
    }));

    console.log("getBenfeitoriaDessincronizadas", cleanedQueue)
    return cleanedQueue;
};


export const setIdImovelFromApi = (idImovelApi: number, imovelIdLocal: string) => {
    try {
        const query = `idFather == "${imovelIdLocal}" AND (sincronizado == false and sincronizado == false)`;
        const benfeitoriaQueue = realmInstance.objects('Benfeitoria').filtered(query);

        //console.log("Conjunto de benfeitorias que precisam receber o ID do pai:", benfeitoriaQueue);

        if (benfeitoriaQueue.length > 0) {
            realmInstance.write(() => {
                benfeitoriaQueue.forEach(benfeitoriaOrfan => {
                   // console.log("Atualizando benfeitoria:", benfeitoriaOrfan);
                    // Atualizar o ID do pai (imovel) para o ID vindo da API
                    benfeitoriaOrfan.imovel = idImovelApi;
                    // Se quiser manter o idFather para referência futura, pode comentá-la
                    benfeitoriaOrfan.idFather = '';  
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



export const apagarBenfeitiaQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${idLocal}"`;
            const benfeitoriaExcluir = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query);
                console.log("benfeitoria que deveri ser apagada", query)
            if (benfeitoriaExcluir.length > 0) {
                realmInstance.delete(benfeitoriaExcluir);
            } 
        });
        console.log("apagarBenfeitiaQueue")
    } catch (error) {
        console.error('Erro ao excluir benfeitoria da fila:', error);
    }
};



export const apagarQueueBenfeitoria = () => {
    try {
        realmInstance.write(() => {
            // Seleciona todas as benfeitorias no banco
            const benfeitoriaExcluir = realmInstance.objects<BenfeitoriaType>('Benfeitoria');
            
            if (benfeitoriaExcluir.length > 0) {
                // Deleta todas as benfeitorias encontradas
                realmInstance.delete(benfeitoriaExcluir);
                console.log(`${benfeitoriaExcluir.length} benfeitorias excluídas com sucesso.`);
            } else {
                console.log('Nenhuma benfeitoria encontrada para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir benfeitorias da fila:', error);
    }
};


export const getAllImoveis=()=>{

    const imoveis = realmInstance.objects<imovelBody>('Imovel');
    const cleanBenfeitoria = JSON.parse(JSON.stringify(imoveis));

    console.log("getBenfeitorias", cleanBenfeitoria)
    
    return cleanBenfeitoria as BenfeitoriaType[];
};


export const apagarQueueImovel = () => {
    try {
        realmInstance.write(() => {
            // Seleciona todos os imóveis no banco
            const imovelExcluir = realmInstance.objects<imovelBody>('Imovel'); // Use o nome correto do esquema

            if (imovelExcluir.length > 0) {
                // Deleta todos os imóveis encontrados
                realmInstance.delete(imovelExcluir);
                console.log(`${imovelExcluir.length} imóveis excluídos com sucesso.`);
            } else {
                console.log('Nenhum imóvel encontrado para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir imóveis da fila:', error);
    }
};

