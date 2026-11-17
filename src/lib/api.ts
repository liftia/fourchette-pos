export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export function errorMessage(status: number, body: unknown): string {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const sentence = body.error
    if (typeof sentence === 'string' && sentence !== '') return sentence
  }
  return `Erreur ${status}`
}

export async function call<T>(method: Method, url: string, body?: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error("L'API ne répond pas")
  }
  const content: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    // Le proxy de Vite répond 502 sans corps JSON quand l'API est arrêtée.
    throw new Error(content === null && response.status >= 500 ? "L'API ne répond pas" : errorMessage(response.status, content))
  }
  return content as T
}

export function sentence(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
