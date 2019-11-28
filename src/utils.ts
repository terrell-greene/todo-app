export interface Token {
  userId: string
}

export const APP_SECRET = process.env.APP_SECRET as string

export const isEmpty = (value: any) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0)

export async function asyncForEach<T>(
  array: Array<T>,
  callback: (value: T, index: number, array: Array<T>) => void
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
