import { ComprasType } from "../../shared/types/ComprasType";
import { realmInstance } from "./databaseService";

export const salvarCompras = (consumo: ComprasType)=> {

    return new Promise<void>((resolve, reject)=>{
        try{
            realmInstance.write(()=>{
                    
               const comprasCorrigida = {
                 ...consumo,
                 benfeitoria: consumo.benfeitoria.id
               };

               realmInstance.create('Compras', comprasCorrigida, true );
            });
            
            resolve();

        }catch(error){
            reject(error);
        }

    });

};

export const getConsumo = (benfeitoria: number): ComprasType =>{

    const query = `benfeitoria == ${benfeitoria}`;

    const comprasRealm = realmInstance.objects<ComprasType>('Compras').filtered(query).slice();

    const cleanCompras = JSON.parse(JSON.stringify(comprasRealm));

    return cleanCompras as ComprasType;

};