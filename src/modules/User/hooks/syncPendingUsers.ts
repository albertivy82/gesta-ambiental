/*import { sendImovelToServer } from './ImovelService';

export const syncPendingImoveis = async () => {
  const realm = new Realm({ schema: [ImovelQueueSchema] });

  const imoveis = realm.objects('UserQueue'); 

  for (const imovel of imoveis) {
    try {
      await sendImoveloServer(imovel);
      realm.write(() => {
      realm.delete(imovel);
      });
    } catch (error) {
      console.log('Erro ao sincronizar imóvel:', error);
    }
  }
};*/

 