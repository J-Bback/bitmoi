import costComma from './costComma';

export default {
  signRatePositive(str: number | string) {
    let num = Number(str);
    if (Math.sign(num) === 1) {
      return `+${num}`;
    } else if (Math.sign(num) === 0) {
      return '0.00';
    } else {
      return `${num}`;
    }
  },

  signPricePositive(str: number | string) {
    let num = str;
    if (typeof num === 'string') {
      num = Number(str);
    }
    if (Math.sign(num) === 1) {
      return `+${costComma(num)}`;
    } else if (Math.sign(num) === 0) {
      return num;
    } else {
      return `${costComma(num)}`;
    }
  },
};
// export const signRatePositive = (str: number | string) => {
//   let num = Number(str);
//   if (Math.sign(num) === 1) {
//     return `+${num}`;
//   } else if (Math.sign(num) === 0) {
//     return '0.00';
//   } else {
//     return `${num}`;
//   }
// };

// export const signPricePositive = (str: number | string) => {
//   let num = str;
//   if (typeof num === 'string') {
//     num = Number(str);
//   }
//   if (Math.sign(num) === 1) {
//     return `+${costComma(num)}`;
//   } else if (Math.sign(num) === 0) {
//     return num;
//   } else {
//     return `${costComma(num)}`;
//   }
// };
