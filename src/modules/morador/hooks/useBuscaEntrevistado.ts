import { getBenfeitoria, getBenfeitoriaDessincronizadaPorId } from "../../../realm/services/benfeitoriaService";
import { getEntrevistadoDessincronizadoPorId, getEntrevistadoPorId } from "../../../realm/services/entrevistado";
import { getImovelDessincronizadoPorId, getImovelPorId } from "../../../realm/services/imovelService";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { MoradorType } from "../../../shared/types/MoradorType";

export const useBuscaEntrevistado = (benfeitoria: BenfeitoriaType, morador?:MoradorType)=>{

let entrevistado; 
    if(!morador){
         entrevistado = getEntrevistadoDoMorador(benfeitoria);
    }else{ 
         let benfeitoriaResgatatda;
        const idFather = morador.idFather ?? "";
        const benfeitoriaId = typeof morador.benfeitoria === "number" 
        ? morador.benfeitoria 
        : (morador.benfeitoria as any)?.id ?? null;
        console.log('b0000000000000', idFather, benfeitoriaId)
        if(idFather==='' && benfeitoriaId>0){
            benfeitoriaResgatatda = getBenfeitoria(benfeitoriaId)
        }else{
           
            benfeitoriaResgatatda = getBenfeitoriaDessincronizadaPorId(idFather);
        }

        entrevistado = getEntrevistadoDoMorador(benfeitoriaResgatatda!);
    }

    return {
        entrevistado
    };
}

const getEntrevistadoDoMorador = (benfeitoria: BenfeitoriaType): EntrevistadoType | undefined => { 
    let entrevistado; 
    const idFather = benfeitoria.idFather ?? "";
    const imovelId = typeof benfeitoria.imovel === "number" 
        ? benfeitoria.imovel 
        : (benfeitoria.imovel as any)?.id ?? null;
        
    if(idFather==='' && imovelId>0){ 
        const imovel = getImovelPorId(imovelId); 
                const idFatherImovel = imovel?.idFather ?? "";
                const entrevistadoId = typeof imovel?.entrevistado === "number" ? imovel.entrevistado : (imovel?.entrevistado as any)?.id ?? null;
                const EntrevistadoIdLocal = imovel?.idLocal ?? ""; 
                if(idFatherImovel==='' && entrevistadoId ){ 
                  entrevistado = getEntrevistadoPorId(entrevistadoId) 
                }else{
                  entrevistado = getEntrevistadoDessincronizadoPorId(EntrevistadoIdLocal); 
                }
    }else if(idFather!=='' && imovelId<0){
        
        const imovel = getImovelDessincronizadoPorId(idFather); 
        
            const idFatherImovel = imovel?.idFather ?? "";
            const entrevistadoId = typeof imovel?.entrevistado === "number" ? imovel.entrevistado : (imovel?.entrevistado as any)?.id ?? null;
            const EntrevistadoIdLocal = imovel?.idLocal ?? ""; 
                if(idFatherImovel==='' && entrevistadoId>0 ){ 
                   entrevistado = getEntrevistadoPorId(entrevistadoId) 
                }else{
                    console.log('a0000000000000', idFatherImovel, entrevistadoId );
                   entrevistado = getEntrevistadoDessincronizadoPorId(idFatherImovel); 
                } 
    } else { return undefined}  

    return entrevistado!;
}

