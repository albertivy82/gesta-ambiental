// shared/functions/onlyNumeric.ts

/**
 * Remove todos os caracteres não numéricos de uma string.
 * Se o resultado for vazio, retorna null. Caso contrário, retorna o número.
 * Útil para campos como idade, número de filhos, quantidades etc.
 */
export const parseOnlyNumeric = (text: string): number => {
  const cleaned = text.replace(/[^0-9]/g, '');
  return cleaned === '' ? 0 : parseInt(cleaned, 10);
};



