/*import { connectionAPIPost, connectionAPIPut } from './connectionAPI';


const ImovelService = ()=>{
  const realm = new Realm({ schema: [ImovelSchema] });
  
  export const sendImovelToServer = async (imovelData) => {
    try {
      if (imovelData.id) {
        const imovel = await connectionAPIPut(`/api/imovel/${imovelData.id}`, imovelData);
        return imovel;
      } else {
        const imovel = await connectionAPIPost('/api/imovel', imovelData);
        return imovel;
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar imóvel:', error);
      throw error;
    }
  };
};

*/