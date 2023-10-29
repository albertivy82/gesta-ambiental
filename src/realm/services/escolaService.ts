import { EscolaType } from "../../shared/types/EscolaType"
import { realmInstance } from "./databaseService"

export const salvarEscolas = (escolas: EscolaType[])=>{

    return new Promise<void>((resolve, reject) => {

        try{
            realmInstance.write(()=>{

                    escolas.forEach(escola=>{
                        const escolaPadrao = {
                            ...escola,
                            localidade: escola.localidade.id
                        };

                        realmInstance.create('Escola', escolaPadrao, true);
                    })
            })
            resolve();
            
        }catch(error){
            reject(error);
        }
        
    });

};

export const getEscolas = (localidadeId:number): EscolaType[]=>{

    const query = `localidade == ${localidadeId}`;

    const escolasRealm = realmInstance.objects<EscolaType>('Escola').filtered(query).slice();

    const escolasLimpas = JSON.parse(JSON.stringify(escolasRealm));

    return escolasLimpas as EscolaType[];

}