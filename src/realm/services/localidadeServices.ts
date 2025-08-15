import { LocalidadeType } from '../../shared/types/LocalidadeType';
import { realmInstance } from './databaseService';




export const salvarLocalidades = (localidades:LocalidadeType[])=>{
    
    return new Promise<void>((resolve, reject)=>{
        try{
           
            realmInstance.write(()=>{
        
                localidades.forEach(localidade =>{
                      const localidadeRealm = realmInstance.objects('Localidade').filtered(`id == ${localidade.id}`)[0];
                        
                                if(localidadeRealm){
                                        realmInstance.create('Localidade', localidade, true);
                                }else{
                                    realmInstance.create('Localidade', localidade, true);
                                }
            });
        });
             resolve();
        } catch (error){
            reject(error)
        }
    })
   
};


export const salvarLocalidade = (localidade:LocalidadeType)=>{
    
    return new Promise<void>((resolve, reject)=>{
        try{
           
            realmInstance.write(()=>{
        
               const localidadeRealm = realmInstance.objects('Localidade').filtered(`id == ${localidade.id}`)[0];
                        
                   if(localidadeRealm){
                        realmInstance.create('Localidade', localidade, true);
                   }else{
                        realmInstance.create('Localidade', localidade, true);
                    }
           
          });
             resolve();
        } catch (error){
            reject(error)
        }
    })
   
};



export const getLocalidades = (): LocalidadeType[]=>{
   
    const localidades = realmInstance.objects<LocalidadeType>('Localidade').slice(); 
   
    const cleanLocalidades = JSON.parse(JSON.stringify(localidades));
  
    return cleanLocalidades as LocalidadeType[];
}


export const getLocalidadesPorId = (islocalidade:number): LocalidadeType=>{
   
   const query = `id == ${islocalidade}`;
      
     
       const localidadeRealm = realmInstance.objects<LocalidadeType>('Localidade').filtered(query).slice();
       
       const localidadeLimpa = JSON.parse(JSON.stringify(localidadeRealm[0]));
   
       
   
       return localidadeLimpa as LocalidadeType;
}

export const apagarLocalidade = (localidadeId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${localidadeId}"`;
            const localidadeAExcluir = realmInstance.objects<LocalidadeType>('Localidade').filtered(query);

            if (localidadeAExcluir.length > 0) {

             realmInstance.delete(localidadeAExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir localidade da fila:', error);
    }
};