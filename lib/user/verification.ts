import { db } from "../db"

export const getUser = async (email: string) => {
  const user = JSON.parse(await db.hget('users', email))
  if (user === null) {
    const userData = {
      isNew: true,
    }
    await db.hset('users', email, JSON.stringify(userData))
    return userData
  }
  return user
}
