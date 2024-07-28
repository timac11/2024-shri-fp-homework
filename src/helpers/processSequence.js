/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {andThen, compose, pipe} from "ramda";
import {isNumber} from "lodash";

 const api = new Api();

 /**
  * Я – пример, удали меня
  */
 const wait = time => new Promise(resolve => {
     setTimeout(resolve, time);
 })

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
   const _writeLog = ({ value }) => () => writeLog(value) && value;
   const writeResultLog = () => (value) => writeLog(value) && value;
   const validate = ({ value }) => () => String(value).length < 10 && String(value).length > 2 && isNumber(Number(value)) && Number(value) > 0;
   const execute = () => (value) => api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: value});

   const ceil = ({ value }) => () => Math.ceil(value);


   return pipe(
     _writeLog({value, writeLog}),
     validate({value}),
     ceil({value}),
     execute(),
     andThen(pipe(
       writeResultLog({ writeLog }),

     ))
   )

   /**
      * Я – пример, удали меня
      */
     writeLog(value);

     api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: '01011010101'}).then(({result}) => {
         writeLog(result);
     });

     wait(2500).then(() => {
         writeLog('SecondLog')

         return wait(1500);
     }).then(() => {
         writeLog('ThirdLog');

         return wait(400);
     }).then(() => {
         handleSuccess('Done');
     });
 }

export default processSequence;
