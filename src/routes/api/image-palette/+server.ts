import type { RequestHandler } from '@sveltejs/kit'
import { Vibrant } from 'node-vibrant/node'
import sharp from 'sharp'

export const GET: RequestHandler = async ({ url }) => {
  const imageUrl = url.searchParams.get('url')

  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  try {
    const res = await fetch(imageUrl)
    if (!res.ok) {
      return new Response('Failed to fetch image', { status: 500 })
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const pngBuffer = await sharp(buffer).png().toBuffer()

    const palette = await Vibrant.from(pngBuffer).getPalette()
    const hexPalette = Object.values(palette)
      .filter((swatch) => swatch !== null)
      .map((swatch) => swatch.hex)

    return new Response(JSON.stringify({ palette: hexPalette }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (e) {
    console.error('Error extracting colors:', e)
    return new Response('Error extracting colors', { status: 500 })
  }
}
