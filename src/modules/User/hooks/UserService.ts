/*import { connectionAPIPost, connectionAPIPut } from './connectionAPI';


const ImovelService = ()=>{
  const realm = new Realm({ schema: [ImovelSchema] });
  
  export const sendImovelToServer = async (imovelData) => {
    try {
      if (imovelData.id) {
        const imovel = await connectionAPIPut(`http://192.168.100.28:8080/imovel/${imovelData.id}`, imovelData);
        return imovel;
      } else {
        const imovel = await connectionAPIPost('http://192.168.100.28:8080/imovel', imovelData);
        return imovel;
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar imóvel:', error);
      throw error;
    }
  };
};

*/