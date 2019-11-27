import { sign } from 'jsonwebtoken'

import { APP_SECRET } from '../../../utils'
import { redisClient } from '../../../server'

interface CreateSession {
  userId: string
  email: string
}

export const createSession = async ({
  email,
  userId
}: CreateSession): Promise<string> => {
  const token = await sign({ email }, APP_SECRET)

  try {
    await redisClient.setAsync(token, userId)
    return token
  } catch (error) {
    console.log(error)
    throw Error('Error trying to create session')
  }
}

export const destroySession = async (key: string): Promise<void> => {
  try {
    await redisClient.delAsync(key)
  } catch (error) {
    console.log(error)
    throw Error('Error tyring to delete session')
  }
}
