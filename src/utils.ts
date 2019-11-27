export interface Token {
  userId: string
}

export const APP_SECRET = process.env.APP_SECRET as string

export const isEmpty = (value: any) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0)
