export type FethcerError = Error & {
  info?: any
  status?: number
}

export const serviceFetcher = async (key: string, req: RequestInit) => {
  const res = await fetch(`${key}`, req)
  if (!res.ok) {
    const error: FethcerError = new Error('An error occurred while fetching the data.')

    error.info = await res.json()
    error.status = res.status

    throw error
  }
  return res.json()
}

export const serviceMultipleFetcher = (keys: string[], req: RequestInit) => {
  return Promise.all(keys.map(k => serviceFetcher(k, req)))
}
