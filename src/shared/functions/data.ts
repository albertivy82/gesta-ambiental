export const formatarData = (dataString:string) => {
    return dataString
        .replace(/\D/g, '') // Remove qualquer caracter que não seja número
        .replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') // Formata para YYYY-MM-DD
        .replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$1-$2-$3'); // Garante o formato correto, mesmo se houver caracteres extras
};