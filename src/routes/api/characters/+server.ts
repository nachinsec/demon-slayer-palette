// src/routes/api/characters/+server.ts
import { json } from '@sveltejs/kit'
import { RequestHandler } from '@sveltejs/kit'
export async function GET() {
  const res = await fetch('https://www.demonslayer-api.com/api/v1/characters?limit=45')
  const data = await res.json()

  return json(data.content)
}
