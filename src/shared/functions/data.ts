export function formatarData(data: string | Date): string {
    if (!data) return ''; // Retorna uma string vazia para entradas inválidas ou vazias
    const dateObject = typeof data === 'string' ? new Date(data) : data;
    return isNaN(dateObject.getTime()) ? '' : dateObject.toISOString().split('T')[0]; // Verifica se a data é válida
}



export const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajusta para 2 dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Ajusta para 2 dígitos
    return `${year}-${month}-${day}`;
  };
  


