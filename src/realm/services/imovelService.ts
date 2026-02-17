import { configureStore } from "@reduxjs/toolkit";
import { imovelInput } from "../../shared/types/imovelInput";
import { imovelBody } from "../../shared/types/imovelType";
import { realmInstance } from "./databaseService";




export const salvarImoveis = (imovel: imovelBody) =>{


    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{


                    //essa duplicação de código foi feita para controlar atualizações de todas os registros
                    //a primeira condição entram apenas atualizações
                    //no segundo novos registros
                    const imovelRealm = realmInstance.objects('Imovel').filtered(`id == ${imovel.id}`)[0];
                    //console.log('Imóvel recuperado do Realm:', imovelRealm);
                    if(imovel.sincronizado && imovelRealm && imovel.idLocal==''){
                       // console.log('Atualizando imóvel existente:', imovel);
                              const imovelPadrao ={
                                    ...imovel,
                                    entrevistado: imovel.entrevistado.id,
                                };


                                realmInstance.create('Imovel', imovelPadrao, true);
                    }else{
                       // console.log('Inserindo novo imóvel ou atualizando imóvel com condições diferentes:', imovel);
                        const imovelPadrao ={
                            ...imovel,
                            entrevistado: imovel.entrevistado.id,
                        };


                        realmInstance.create('Imovel', imovelPadrao, true);
                    }
                   
               
               




               
            });


            resolve();


        }catch(error){
            reject(error)
        }
   
   
   
    });


};


export const salvarImovel = (imovel: imovelBody): Promise<imovelBody> =>{
 
    return new Promise((resolve, reject)=>{
     
        try{
            let imovelSalvo;
            realmInstance.write(()=>{
             
              const imovelRealm = realmInstance.objects('Imovel')
              .filtered(`id == ${imovel.id}`)[0];


                               
                    if(imovel.sincronizado && imovelRealm && imovel.idLocal==''){
                       
                        const imovelPadrao ={
                         ...imovel,
                        entrevistado: imovel.entrevistado.id,
                       
                        };
                        imovelSalvo =  realmInstance.create('Imovel', imovelPadrao, true);
                    }else{
                     
                        const imovelPadrao ={
                            ...imovel,
                           entrevistado: imovel.entrevistado.id,
                        };
                        imovelSalvo =  realmInstance.create('Imovel', imovelPadrao, true);
                    }
            });
            if(imovelSalvo){
                const cleanImovel = JSON.parse(JSON.stringify(imovelSalvo));
               // console.log("imovel salvo no realm, aquiperdeu o entrecvitado?",imovelSalvo)
                resolve(cleanImovel);
            }else{
                throw new Error("Erro ao recuperar o imovel Salvo.");
            }
           


        }catch(error){
            reject(error)
        }
       
    });


};




export const setIdEntrevistadoFromApiOnImovel = (
    idEntrevistadoApi: number,
    entrevistadoIdLocal: string
  ) => {
    try {
      const query = `idFather == "${entrevistadoIdLocal}" AND sincronizado == false`;
 
      const imoveis = realmInstance.objects('Imovel').filtered(query);
      const imovel = imoveis[0];
 
      if (!imovel) {
        console.log("Nenhum imóvel encontrado para idLocal:", entrevistadoIdLocal);
        return false;
      }
 
      realmInstance.write(() => {
        imovel.entrevistado = idEntrevistadoApi;
        imovel.idFather = "";
      });
 
      return true;
    } catch (error) {
      console.error("Erro ao atualizar imóveis:", error);
      return false;
    }
  };
 
 


export const salvarImovelQueue = (imovel: imovelInput): Promise<imovelBody> =>{
   
    return new Promise((resolve, reject)=>{
            // Função para gerar um ID aleatório
            const Id = () => {
                const min = Math.ceil(0);
                const max = Math.floor(1000);
                return - Math.floor(Math.random() * (max - min + 1)) + min;
            };
                   
            try {


                let imovelSalvo;
                realmInstance.write(() => {
                   
                    const imovelPadrao = {
                        ...imovel,
                        id: Id(),
                        entrevistado: imovel.entrevistado.id,
                    };
                 
                    imovelSalvo = realmInstance.create('Imovel', imovelPadrao, true);
                  });


                  if (imovelSalvo) {
                    const cleanImovel = JSON.parse(JSON.stringify(imovelSalvo))
                    resolve(cleanImovel as imovelBody);
                    } else {
                       throw new Error("Erro ao recuperar a benfeitoria salva.");
                  }
            } catch (error) {
                reject(error);
            }
        });
       


};




export const getImovel = (entrevistadoId: number): imovelBody | null => {
    const query = `entrevistado == ${entrevistadoId}`; // Se "entrevistado" for um objeto com "id"
    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();
    if (imoveisRealm.length === 0) {
        return null; // Retorna null se não encontrar um imóvel
    }


    return JSON.parse(JSON.stringify(imoveisRealm[0])) as imovelBody;
};




export const getImovelPorId = (imovelId: number): imovelBody | null => {
    const query = `id == ${imovelId}`; // Se "entrevistado" for um objeto com "id"
   
    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').filtered(query);
   
    if (imoveisRealm.length === 0) {
        return null; // Retorna null se não encontrar um imóvel
    }
 
    return JSON.parse(JSON.stringify(imoveisRealm[0])) as imovelBody;
};






export const getImoveisDessincronizados = (idEntrevistadoApi: number): imovelBody | null => {
   


    const query = `entrevistado == ${idEntrevistadoApi} AND sincronizado == false AND (idFather == null OR idFather == "")`;
   
    const imoveisQueue = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();
   
    if (imoveisQueue.length === 0) {
        return null; // Retorna null se não encontrar um imóvel
    }
   
    return JSON.parse(JSON.stringify(imoveisQueue[0])) as imovelBody;
};




export const getImovelDessincronizadoPorId = (idLocal: String|undefined): imovelBody | undefined => {
   
    const query = `idLocal == "${idLocal}"`;
   
        const imoveisQueue = realmInstance
          .objects<imovelBody>("Imovel")
          .filtered(query)
          .slice();
 
    const cleanedQueue = imoveisQueue.map(imovel => ({ ...imovel }));
   
    const primeiroRegistro = cleanedQueue[0];
   
    return primeiroRegistro;
};








export const apagarImovelQueue = (idLocal: string) => {
   
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${idLocal}"`;
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


export const getImovelByIdFather = (idFather: string): imovelBody | undefined => {
    const query = `idFather == "${idFather}"`;
    const imoveis = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();


    if (imoveis.length > 0) {
        // Retorna o primeiro imóvel encontrado
        return JSON.parse(JSON.stringify(imoveis[0])) as imovelBody;
    }
    return undefined;
};




export const apagarQueueImovel = () => {
    try {
        realmInstance.write(() => {
            // Seleciona todos os imóveis no banco
            const imovelExcluir = realmInstance.objects<imovelBody>('Imovel'); // Use o nome correto do esquema


            if (imovelExcluir.length > 0) {
                // Deleta todos os imóveis encontrados
                realmInstance.delete(imovelExcluir);
               
            } else {
                console.log('Nenhum imóvel encontrado para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir imóveis da fila:', error);
    }
};








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
