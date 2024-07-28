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
import { allPass, andThen, ifElse, otherwise, partial, pipe, prop, tap } from "ramda";
import { isNumber } from "lodash";

const api = new Api();


const stringLenLessThanTen = val => String(val).length < 10;
const stringLenMoreThanTwo = val => String(val).length > 2;
const positiveNumber = val => Number(val) > 0;

const _isNumber = val => isNumber(Number(val));

const symbolsCount = val => String(val).length;

const square = val => Number(val) ** 2;

const remainder = val => val % 3;

const getResult = pipe(prop('result'), String);

const execute = (value) => api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: value});
const getAnimal = (id) => api.get(`https://animals.tech/${id}`, undefined);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
   const writeResultLog = tap(writeLog);
   const validate = allPass([
      positiveNumber,
      _isNumber,
      stringLenMoreThanTwo,
      stringLenLessThanTen
     ]
   );

   const ceil = () => Math.ceil(value);

   const aggregate = pipe(
     ceil,
     writeResultLog,
     execute,
     andThen(
       pipe(
         getResult,
         writeResultLog,
         symbolsCount,
         writeResultLog,
         square,
         writeResultLog,
         remainder,
         writeResultLog,
         getAnimal,
         andThen(pipe(getResult, handleSuccess)),
         otherwise(handleError)
       )
     ),
     otherwise(handleError)
   );

   const validationError = partial(handleError, ['ValidationError']);
   const run = ifElse(validate, aggregate, validationError);
   const logAndRun = pipe(writeResultLog, run);

   logAndRun(value);
 }

export default processSequence;
