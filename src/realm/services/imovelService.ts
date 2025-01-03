import { useEntrevistado } from "../../modules/imoveis/hooks/useEntrevistado";
import { imovelInput } from "../../shared/types/imovelInput";
import { imovelBody, ImovelComEntrevistado } from "../../shared/types/imovelType";
import { realmInstance } from "./databaseService";
import { apagarEntrevistadoQueue, apagarQueueEntrevistados, getEntrevistado, getEntrevistadoByIdFather } from "./entrevistado";


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

   console.log(localidade)
    const query = `localidade == ${localidade}`;
   
  
    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();
    console.log(imoveisRealm)
    const imoveisLimpos = JSON.parse(JSON.stringify(imoveisRealm));

 

    return imoveisLimpos as imovelBody[];
}

export const getImoveisComEntrevistados = (localidadeId: number): ImovelComEntrevistado[] => {
    const imoveis = getImoveis(localidadeId);
  
    return imoveis.map((imovel) => {
      let entrevistado;
  
      if (imovel.sincronizado) {
        // Para imóveis sincronizados, utiliza o ID do imóvel
        entrevistado = getEntrevistado(imovel.id);
      } else if (imovel.idLocal) {
        // Para imóveis offline, utiliza o idFather
        entrevistado = getEntrevistadoByIdFather(imovel.idLocal);
      }
  
      return {
        ...imovel,
        entrevistado,
      };
    });
  };
  




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


