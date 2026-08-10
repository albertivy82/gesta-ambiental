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
        case 400:
          throw new Error(`BAD_REQUEST: ${errorMessage}`);

        case 401:
          throw new Error(`UNAUTHORIZED: ${errorMessage}`);

        case 403:
          throw new Error(`FORBIDDEN: ${errorMessage}`);

        case 404:
          throw new Error("NOT_FOUND");

        case 409:
          throw new Error(`CONFLICT: ${errorMessage}`);

        case 422:
          throw new Error(`VALIDATION_ERROR: ${errorMessage}`);

        case 500:
          throw new Error(`INTERNAL_SERVER_ERROR: ${errorMessage}`);

        case 502:
          throw new Error("BAD_GATEWAY");

        case 503:
          throw new Error("SERVICE_UNAVAILABLE");

        case 504:
          throw new Error("GATEWAY_TIMEOUT");

        default:
          throw new Error(`UNKNOWN_ERROR (${status}): ${errorMessage}`);
  }
}
