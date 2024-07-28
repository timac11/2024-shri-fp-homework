/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import { allPass, anyPass, compose, propEq } from "ramda";
import { COLORS, SHAPES } from "../constants";

const countPass = (count, functions, exact = false) => {
      return (...args) => {
          let current = 0;
          for (const func of functions) {
            if (func(...args)) {
                  current++;
                  if (!exact && current >= count) return true;
            }
          }

          return exact && current === count;
      }
}

const countValues = (obj) =>
    Object
      .values(obj)
      .reduce((res, item) => Object.assign(res, { [item]: res[item] ? res[item] + 1 : 1 }), {})


const objectPropsEquals = (first, second) => (obj) => obj[first] === obj[second];
const objectPropMoreThan = (prop, value) => (obj) => obj[prop] >= value;
const objectPropEquals = (prop, value) => (obj) => obj[prop] === value;
const propNotEq = (prop, value) => (obj) => obj[prop] !== value;

const triangleWhite = propEq(SHAPES.TRIANGLE, COLORS.WHITE);
const triangleGreen = propEq(SHAPES.TRIANGLE, COLORS.GREEN);
const triangleNotWhite = propNotEq(SHAPES.TRIANGLE, COLORS.WHITE);

const circleWhite = propEq(SHAPES.CIRCLE, COLORS.WHITE);
const circleGreen = propEq(SHAPES.CIRCLE, COLORS.GREEN);
const circleBlue = propEq(SHAPES.CIRCLE, COLORS.BLUE);

const starRed = propEq(SHAPES.STAR, COLORS.RED);
const starGreen = propEq(SHAPES.STAR, COLORS.GREEN);
const starBlue = propEq(SHAPES.STAR, COLORS.BLUE);
const starOrange = propEq(SHAPES.STAR, COLORS.ORANGE);

const squareGreen = propEq(SHAPES.SQUARE, COLORS.GREEN);
const squareOrange = propEq(SHAPES.SQUARE, COLORS.ORANGE);

const countRedsEqualsCountBlue = objectPropsEquals(COLORS.RED, COLORS.BLUE);

const triangleAndSquareAreSameColor = objectPropsEquals(SHAPES.TRIANGLE, SHAPES.SQUARE);

const threeObjectsSimilarColor = anyPass([
  objectPropMoreThan(COLORS.BLUE, 3),
  objectPropMoreThan(COLORS.GREEN, 3),
  objectPropMoreThan(COLORS.ORANGE, 3),
  objectPropMoreThan(COLORS.RED, 3),
]);

const twoObjectsGreen = compose(
  allPass([
    propEq(COLORS.GREEN, 2),
    propEq(COLORS.RED, 1),
  ]),
  countValues
)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([triangleWhite, circleWhite, starRed, squareGreen]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = countPass(2, [
      triangleGreen,
      circleGreen,
      starGreen,
      squareGreen,
]);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(countRedsEqualsCountBlue, countValues,);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([circleBlue, starRed, squareOrange]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(threeObjectsSimilarColor, countValues)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([triangleGreen, twoObjectsGreen]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(propEq(COLORS.ORANGE, 4), countValues);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = anyPass([starBlue, starGreen, starOrange]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(propEq(COLORS.GREEN, 4), countValues);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([triangleAndSquareAreSameColor, triangleNotWhite]);
