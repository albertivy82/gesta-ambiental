import { realmInstance } from './databaseService';
import { BenfeitoriaType } from '../../shared/types/BenfeitoriaType';
import { BenfeitoriaInput } from '../../shared/types/BenfeitoriaInput';




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
            return Math.floor(Math.random() * (max - min + 1)) + min; 
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

export const getBenfeitoriaDessincronizadas = (idImovelApi: number): BenfeitoriaType[] => {
    //ERRO, ESTOU TESTANDO APENAS O CASO DE JÁ HAVER
    console.log("benfeitpria. ponto de sisncronização 3", idImovelApi)
    const query = `imovel == "${idImovelApi}" AND sincronizado == false AND idFather == null`;
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
        const query = `idFather == "${imovelIdLocal}" AND sincronizado == false`;
        const benfeitoriaQueue = realmInstance.objects('Benfeitoria').filtered(query);

        realmInstance.write(() => {
            benfeitoriaQueue.forEach(benfeitoriaOrfan => {
                benfeitoriaOrfan.idFather = '';  // Ajuste conforme a lógica do seu domínio
                benfeitoriaOrfan.imovel = idImovelApi;
            });
        });

        console.log("setIdImovelFromApi")

    } catch (error) {
        console.error(error);
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
