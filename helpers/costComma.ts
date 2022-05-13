export default function costComma(strParams: string | number) {
  let str = strParams;
  if (Number(str) === 0) {
    return '0';
  }
  if (str === null || str === undefined) {
    return '-';
  }
  str = String(str);
  if (str.length === 0) {
    return '-';
  }
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

export const comma = costComma;
