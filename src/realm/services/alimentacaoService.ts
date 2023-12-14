import { useState } from "react";
import {AlimentacaoType} from "../../shared/types/AlimentacaoType"
import { realmInstance } from "./databaseService"
import { BenfeitoriaAlimentos } from "../../shared/types/BenfeitoriaAlimentosType";


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


function criarBenfeitoriaAlimentos(benfeitoriaId: number, alimentosIds: number[]): BenfeitoriaAlimentos {
    return {
        benfeitoriaId,
        alimentosIds
    };
}

export const salvarBenfeitoriaAlimentos = (alimentos: number[], benfeitoria: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const benfeitoriaAlimentos = criarBenfeitoriaAlimentos(benfeitoria, alimentos);

        try {
            realmInstance.write(() => {
                realmInstance.create('BenfeitoriaAlimentos', benfeitoriaAlimentos, true);
            });
            resolve(); // Resolve a promessa após a operação bem-sucedida
        } catch (error) {
            reject(error); // Rejeita a promessa com o erro capturado
        }
    });
};

export const buscaAlimentosDaBenfeitoria = (benfeitoria: number) => {
    // Busca a entrada de BenfeitoriaAlimentos correspondente ao ID fornecido
    const benfeitoriaAlimentos = realmInstance.objects<BenfeitoriaAlimentos>('BenfeitoriaAlimentos')
        .filtered(`benfeitoriaId == ${benfeitoria}`);

    // Verifica se encontrou a benfeitoria
    if (benfeitoriaAlimentos.length === 0) {
        return []; // Retorna um array vazio se a benfeitoria não for encontrada
    }

    // Extrai os IDs dos alimentos
    const alimentosIds = benfeitoriaAlimentos[0].alimentosIds;

    // Busca os alimentos correspondentes a esses IDs
    const query = `id IN {${alimentosIds.join(',')}}`;
    const alimentosVinculados = realmInstance.objects<AlimentacaoType>('Alimentacao').filtered(query).slice();

    return alimentosVinculados;
};




export const filtrarAlimentos = (alimentos: number[]):AlimentacaoType[]=>{

       const query = `alimentos == ${alimentos}`;
    
       const alimentosBenfeitoria = realmInstance.objects<AlimentacaoType>('Alimentos').filtered(query).slice();
        
     return JSON.parse(JSON.stringify(alimentos)) as AlimentacaoType[];
}


export const getAlimentos = ():AlimentacaoType[]=>{

    const alimentosRealm = realmInstance.objects<AlimentacaoType>('Alimentacao').slice();

    const alimentoCorrigido = JSON.parse(JSON.stringify(alimentosRealm));

    return alimentoCorrigido as AlimentacaoType[];
}