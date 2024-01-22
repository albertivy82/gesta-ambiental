export const errorCase = (error: any) => {
    const { status, data } = error.response;
    const { userMessage, detail, title, timestamp, fields } = data;

    let errorMessage = "Erro desconhecido";
    if (userMessage) {
        errorMessage = userMessage;
    }

    // Aqui você pode usar 'detail', 'title', 'timestamp', 'fields', etc., para criar uma mensagem customizada
    // Por exemplo:
    // let customMessage = `Erro: ${title}. Detalhes: ${detail}. Ocorrido em: ${timestamp}.`;

    switch (status) {
      case 401:
      case 403:
        throw new Error(`Acesso negado: ${errorMessage}`);
      case 500:
        throw new Error(`Erro de servidor: ${errorMessage}`);
      default:
        throw new Error(`Erro de conexão: ${errorMessage}`);
    }
}
