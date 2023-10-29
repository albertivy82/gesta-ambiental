import { PostoType } from "../../shared/types/postoTypes";
import { realmInstance } from "./databaseService";

export const salvarPostos = (postos: PostoType[])=>{

        return new Promise<void>((resolve, reject) => {

                try{

                    realmInstance.write(()=>{

                        postos.forEach(posto=>{
                            
                            const postoPadrao={
                            ...posto,
                            localidade: posto.localidade.id
                            }
                            realmInstance.create('Posto', postoPadrao, true)

                        });

                       
                    })

                    resolve();

                }catch(error){
                    reject(error)
                }
            
        })

}

export const getPostos=(localidade:number): PostoType[] =>{

    const query = `localidade == ${localidade}`;

    const postosRealm = realmInstance.objects<PostoType>('Posto').filtered(query).slice();

    const postoSimplificado = JSON.parse(JSON.stringify(postosRealm));
    
 return postoSimplificado as PostoType[];
}