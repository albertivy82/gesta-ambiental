import { useEntrevistado } from "../../modules/imoveis/hooks/useEntrevistado";
import { imovelInput } from "../../shared/types/imovelInput";
import { imovelBody, ImovelComEntrevistado } from "../../shared/types/imovelType";
import { realmInstance } from "./databaseService";
import { apagarEntrevistadoQueue, apagarQueueEntrevistados, getAllEntrevistados, getEntrevistado, getEntrevistadoByIdFather } from "./entrevistado";


export const salvarImoveis = (imoveis: imovelBody[]) =>{

    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

                imoveis.forEach(imovel=>{

                    //essa duplicação de código foi feita para controlar atualizações de todas os registros
                    //a primeira condição entram apenas atualizações
                    //no segundo novos registros
                    const imovelRealm = realmInstance.objects('Imovel').filtered(`id == ${imovel.id}`)[0];
                    //console.log('Imóvel recuperado do Realm:', imovelRealm);
                    if(imovel.sincronizado && imovelRealm && imovel.idLocal==''){
                       // console.log('Atualizando imóvel existente:', imovel);
                              const imovelPadrao ={
                                    ...imovel,
                                    localidade: imovel.localidade.id,
                                };

                                realmInstance.create('Imovel', imovelPadrao, true);
                    }else{
                       // console.log('Inserindo novo imóvel ou atualizando imóvel com condições diferentes:', imovel);
                        const imovelPadrao ={
                            ...imovel,
                           localidade: imovel.localidade.id,
                        };

                        realmInstance.create('Imovel', imovelPadrao, true);
                    }
                   
                
                });


               
            });

            resolve();

        }catch(error){
            reject(error)
        }
    
    
    
    });

};


export const setIdEntrevistadoFromApiOnImovel = (idEntrevistadoApi: number, entrevistadoIdLocal: string) => {
    try {
        const query = `idFather == "${entrevistadoIdLocal}" AND (sincronizado == false and sincronizado == false)`;
        const imovelQueue = realmInstance.objects('Benfeitoria').filtered(query);

        //console.log("Conjunto de imovels que precisam receber o ID do pai:", imovelQueue);

        if (imovelQueue.length > 0) {
            realmInstance.write(() => {
                imovelQueue.forEach(imovelOrfan => {
                   // console.log("Atualizando imovel:", imovelOrfan);
                    // Atualizar o ID do pai (imovel) para o ID vindo da API
                    imovelOrfan.imovel = idEntrevistadoApi;
                    // Se quiser manter o idFather para referência futura, pode comentá-la
                    imovelOrfan.idFather = '';  
                });
            });

           // console.log("Benfeitorias atualizadas com o novo ID:", imovelQueue);
        } else {
           // console.log("Nenhuma imovel encontrada para o ID local:", imovelIdLocal);
        }

       // console.log("setIdImovelFromApi completado");

    } catch (error) {
        console.error("Erro ao atualizar imovels:", error);
    }
};

export const salvarImovelQueue = (imovel: imovelInput) =>{
    console.log('salvarImovelqueue', imovel)

        return new Promise<void>((resolve, reject) => {
            // Função para gerar um ID aleatório
            const Id = () => {
                const min = Math.ceil(0);
                const max = -Math.floor(1000);
                return Math.floor(Math.random() * (max - min + 1)) + min; 
            };
                   
            try {
                realmInstance.write(() => {
                   
                    const imovelPadrao = {
                        ...imovel,
                        id: Id(), 
                        localidade: imovel.localidade.id,
                    };
                    console.log('salvarImovelqueue', imovelPadrao)
                    realmInstance.create('Imovel', imovelPadrao, true);
                    console.log('salvarImovelQueue - Ok!')
                });
        
                resolve();
            } catch (error) {
                reject(error);
            }
        });
        

};


export const getImoveis = (localidade:number): imovelBody[]=>{

  
    const query = `localidade == ${localidade}`;
   
  
    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();
    
    const imoveisLimpos = JSON.parse(JSON.stringify(imoveisRealm));

 

    return imoveisLimpos as imovelBody[];
}




export const getImoveisDessincronizados = (localidade:number): imovelBody[]=>{

   
    const query = `localidade == ${localidade} and sincronizado == false`;

    const imoveisQueue = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();

     
    const cleanedQueue = JSON.parse(JSON.stringify(imoveisQueue));

    return cleanedQueue as imovelBody[];
};

export const apagarImovelQueue = (imovelidLocal: string) => {
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${imovelidLocal}"`;
            const imovelAExcluir = realmInstance.objects<imovelBody>('Imovel').filtered(query);

            if (imovelAExcluir.length > 0) {
                realmInstance.delete(imovelAExcluir);
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir imóvel da fila:', error);
    }
};

export const apagarImovelSyncronizado = (imovelId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${imovelId}"`;
            const imovelAExcluir = realmInstance.objects<imovelBody>('Imovel').filtered(query);

            if (imovelAExcluir.length > 0) {

             realmInstance.delete(imovelAExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir imóvel da fila:', error);
    }
};


/*
função de limpesa do banco-> criar componente para todas as categorias
export const apagarTodosImoveis = () => {
    try {
        realmInstance.write(() => {
           
            
            const imovelAExcluir = realmInstance.objects<imovelBody>('Imovel');

            if (imovelAExcluir.length > 0) {
                imovelAExcluir.forEach(imovel=>{
                        realmInstance.delete(imovel);
                })
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir imóvel da fila:', error);
    }
};
*/



export const getTodosImoveis = (): imovelBody[] => {
  try {
    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').slice();
    console.log('Todos os imóveis:', imoveisRealm);

    // Serializando os objetos do Realm para garantir uma cópia limpa
    const imoveisLimpos = JSON.parse(JSON.stringify(imoveisRealm));

    return imoveisLimpos as imovelBody[];
  } catch (error) {
    console.error('Erro ao buscar todos os imóveis:', error);
    return [];
  }
};


export const carregarImoveis = (localidadeId: number): number[]=>{
      const imoveis = getImoveis(localidadeId); // Obtém imóveis do banco de dados local
  
      return imoveis
        .filter((imovel) => imovel.sincronizado)
        .map((imovel) => imovel.id!); // Retorna apenas os IDs dos imóveis sincronizados
}
  
  


