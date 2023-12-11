import { useState } from "react";
import {AlimentacaoType} from "../../shared/types/AlimentacaoType"
import { BenfeitoriaAlimentacaoType } from "../../shared/types/BenfeitoriaAlimentacaoType";
import { realmInstance } from "./databaseService"


export const salvarAlimentos = (alimentos: AlimentacaoType[])=>{

    return new Promise<void>((resolve, reject)=>{
        try{
            realmInstance.write(()=>{
                alimentos.forEach(alimento=>{
                  realmInstance.create('Alimentacao', alimento, true);
                });
            })
        }catch(error){
            reject(error)
        }

});
};


export const salvarBenfeitoriaAlimentos = (benfeitoriaAlimentos: BenfeitoriaAlimentacaoType[])=>{

    return new Promise<void>((resolve, reject)=>{
        try{
            realmInstance.write(()=>{
                benfeitoriaAlimentos.forEach(benfeitoriaAlimento=>{
                    console.log("alimentação service")
                  realmInstance.create('BenfeitoriaAlimentos', benfeitoriaAlimento, true);
                });
            })
        }catch(error){
            reject(error)
        }

});
};


export const getBenfeitoriaAlimentos = (benfeitoria: number):AlimentacaoType[]=>{

   
    const query = `benfeitoria == ${benfeitoria}`;
    const alimentosRealm = realmInstance.objects<BenfeitoriaAlimentacaoType>('BenfeitoriaAlimentos').filtered(query).slice();
    console.log("entrou aqui em algum moemntos fdp", alimentosRealm)
    let alimentos: AlimentacaoType[] = [];
    alimentosRealm.forEach(e => {
        const queryAlimentos = `id == ${e.alimentacao}`;
        const alimentosBenfeitoria = realmInstance.objects<AlimentacaoType>('Alimentos').filtered(queryAlimentos).slice();
        console.log("entrou aqui em algum moemntos alimentosBenfeitoria", alimentosBenfeitoria)
        alimentos = [...alimentos, ...alimentosBenfeitoria];
    });

    console.log("entrou aqui em algum moemntos fdp", alimentos)

    return JSON.parse(JSON.stringify(alimentos)) as AlimentacaoType[];
  
}


export const getAlimentos = ():AlimentacaoType[]=>{

    const alimentosRealm = realmInstance.objects<AlimentacaoType>('Alimentacao').slice();

    const alimentoCorrigido = JSON.parse(JSON.stringify(alimentosRealm));

    return alimentoCorrigido as AlimentacaoType[];
}