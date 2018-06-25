/**
 * ODIN :: API Framwork
 * Copyright (c) CUREON, 2018
 *
 * set    : Helpers
 * author : André Kirchner <andre.kirchner@cureon.de>
 */

/**
 * Function will provide forEach async
 * @param array
 * @param callback
 */
export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

