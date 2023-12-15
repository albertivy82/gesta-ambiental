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

export const getCompras = (benfeitoria: number): ComprasType | null =>{
    try {
            const query = `benfeitoria == ${benfeitoria}`;

            const comprasRealm = realmInstance.objects<ComprasType>('Compras').filtered(query).slice();

            if (comprasRealm.length > 0) {
                const cleanCompras = JSON.parse(JSON.stringify(comprasRealm[0])); // Pega apenas o primeiro elemento
                return cleanCompras as ComprasType;
            } else {
            return null;
            }
    } catch (error) {
            console.error("Erro ao buscar compras:", error);
            // Dependendo de como você quer lidar com erros, você pode:
            // - Retornar null
            // - Relançar o erro
            // - Ou até mesmo retornar um valor padrão
            return null; // Exemplo: retornar null em caso de erro
        }


};