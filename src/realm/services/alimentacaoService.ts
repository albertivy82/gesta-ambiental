import {AlimentacaoType} from "../../shared/types/AlimentacaoType"
import { realmInstance } from "./databaseService"

export const salvarAlimentos = (alimentos: AlimentacaoType[])=>{

    return new Promise<void>((resolve, reject)=>{
        try{
            realmInstance.write(()=>{
                alimentos.forEach(alimento=>{
                
                    const aliementoCorrigido ={
                    ...alimento,
                    benfeitoria: alimento.benfeitoria.id
                    }

                    realmInstance.create('Alimentacao', aliementoCorrigido, true);
                
                });
            })
        }catch(error){
            reject(error)
        }

});
};

export const getAlimentos = (benfeitoria: number):AlimentacaoType[]=>{

    const query = `benfeitoria == ${benfeitoria}`

    const alimentosRealm = realmInstance.objects<AlimentacaoType>('Alimnetacao').filtered(query).slice();

    const alimentoCorrigido = JSON.parse(JSON.stringify(alimentosRealm));

    return alimentoCorrigido as AlimentacaoType[];
}