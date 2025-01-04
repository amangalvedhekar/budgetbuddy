export type CalculateTotalInputted = {
  inputList: any;
  currency: string;
}



export const calculateTotalInputted = ({inputList, currency}: CalculateTotalInputted): string => {
 const total = Array.isArray(inputList) ? inputList.reduce((acc,elm) => acc + Number(elm.value), 0) : 0;
 return new Intl.NumberFormat(currency, {
    style: 'currency',
    currency: 'CAD'
  }).format(total);
}