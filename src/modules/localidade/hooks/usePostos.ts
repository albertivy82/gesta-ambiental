import { useEffect, useState } from "react";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { PostoType } from "../../../shared/types/postoTypes";
import { getPostos, salvarPostos } from "../../../realm/services/postoService";

export const usePostos = (localidadeId: number)=>{
const [postos, setPostos] = useState<boolean>(false);
       
        const fetchPostosFromDB = () =>{
            const postosRealm = getPostos(localidadeId);
                if(postosRealm){
                    setPostos(true);
                }
        }

        const fetchPostosFromAPI = async()=>{
            try{

                const postosAPI = await connectionAPIGet(`http://192.168.100.28:8080/posto-de-saude/localidade-posto/${localidadeId}`);
                   
           
                    const postData = postosAPI as PostoType[];
                    
                        if(postData && Array.isArray(postData) && postData.length>0){
                            salvarPostos(postData);
                            setPostos(true);
                        }else{
                            throw new Error('Ddos de postos inválidos')
                        }
            
                }catch(error){
                    console.error('erro', error);
            }
        }

        useEffect(()=>{
            fetchPostosFromAPI();
            fetchPostosFromDB();
        },[]);

        return{postos};

}