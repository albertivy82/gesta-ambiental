import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { apagarVegetacaoQueue, getVegetacoes, getVegetacoesDessincronizadas, salvarVegetacoes } from "../../../realm/services/vegetacaoService";
import { connectionAPIGet, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { testConnection } from "../../../shared/functions/connection/testConnection";
import { VegetacaoInput } from "../../../shared/types/VegetacaoInput";
import { VegetacaoType } from "../../../shared/types/VegetacaoType";

export const convertToVegetacaoInput = (vegetacao: any) => {
    console.log("vegetação enviada para conversão",vegetacao)
    console.log(typeof vegetacao.entrevistado);           // "object"
    console.log(typeof vegetacao.entrevistado.id);
    const vegetacaoInput: VegetacaoInput = {
        especie: vegetacao.especie,
        usoMedicinal: vegetacao.usoMedicinal,
        usoAlimentacao: vegetacao.usoAlimentacao,
        usoOrnamental: vegetacao.usoOrnamental,
        usoComercial: vegetacao.usoComercial,
        usaFlor: vegetacao.usaFlor,
        usaFolha: vegetacao.usaFolha,
        usaSemente: vegetacao.usaSemente,
        usaFruto: vegetacao.usaFruto,
        usaCasca: vegetacao.usaCasca,
        usaRaiz: vegetacao.usaRaiz,
        usoLeiteLatex: vegetacao.usoLeiteLatex,
        outrosUsos: vegetacao.outrosUsos,
        coletaLocalPublico: vegetacao.coletaLocalPublico,
        coletaCultivo: vegetacao.coletaCultivo,
        coletaCompra: vegetacao.coletaCompra,
        coletaAmbienteEspecifica: vegetacao.coletaAmbienteEspecifica,
        quemEnsinouUso: vegetacao.quemEnsinouUso,
        repassaConhecimento: vegetacao.repassaConhecimento,
        observacoesEspontaneas: vegetacao.observacoesEspontaneas,
        entrevistado: {
            id: vegetacao.entrevistado, 
        }
    };

    return vegetacaoInput;
};

export const useVegetacoes = (entrevistadoId: number) => {
    const [vegetacao, setVegetacao] = useState<VegetacaoType[]>([]);

    const sincronizarVegetacaoQueue = async () => {
        if (entrevistadoId > 0) {
           
            const vegetacoesQueue = getVegetacoesDessincronizadas(entrevistadoId);
           
            if (vegetacoesQueue.length > 0) {
                for (const vegetacao of vegetacoesQueue) {
                    const novaVegetacaoInput = convertToVegetacaoInput(vegetacao);
                    console.log("useVegetacoes/novaVegetacaoInput", novaVegetacaoInput );
                    const netInfoState = await NetInfo.fetch();
                    if (netInfoState.isConnected) {
                        const isConnected = await testConnection();
                        if (isConnected) {
                            try {
                                const response = await connectionAPIPost('http://192.168.100.28:8080/vegetacao', novaVegetacaoInput);
                                const vegetacaoAPI = response as VegetacaoType;

                                if (vegetacaoAPI.id) {
                                    apagarVegetacaoQueue(vegetacao.idLocal!);
                                    console.log("Vegetação: ponto de sincronização 6");
                                }
                            } catch (error) {
                                // console.log('Erro na sincronização da vegetação:', error);
                            }
                        }
                    }
                }
            }
        }
    };

   const fetchVegetacaoRealm = () => {
           const vegetacaoRealm = getVegetacoes(entrevistadoId);
           if (vegetacaoRealm.length > 0) {
           setVegetacao((prevVegetacao) => [...prevVegetacao, ...vegetacaoRealm]); // Aqui usamos vegetacaoRealm
           }
    };
       

    const fetchVegetacoesAPI = async () => {
        try {
            const response = await connectionAPIGet<VegetacaoType[]>(`http://192.168.100.28:8080/vegetacao/entrevistado-vegetacao/${entrevistadoId}`);
            const vegetacaoData = response.map(veg => ({
                ...veg,
                sincronizado: true,
                idLocal: '',
                idFather: '',
            }));
           if (vegetacaoData && Array.isArray(vegetacaoData) && vegetacaoData.length > 0) {
                await salvarVegetacoes(vegetacaoData);
                 setVegetacao((prevVegetacao) => [...prevVegetacao, ...vegetacaoData]);
            } else {
                throw new Error('Dados de vegetação inválidos');
            }
        } catch (error) {
            // console.log("CONTAGEM DE VEGETAÇÕES - ERRO!!!:", error);
        }
    };

    useEffect(() => {
        fetchVegetacaoRealm();
        fetchVegetacoesAPI();
        sincronizarVegetacaoQueue();
    }, []);

    return { vegetacao };
};
