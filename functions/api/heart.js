/**
 * Send Emoji Reactions to my page
 * 
 * Source: openheart.fyi
 */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
    if (request.method !== 'POST') return
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const emoji = ensureEmoji(await request.text())
    if (!id || !emoji) return new Response('not ok', { status: 500 })
    const key = `${id}:${emoji}`
    // https://developers.cloudflare.com/workers/runtime-apis/kv/
    const currentCount = Number(await (NAMESPACE.get(key)) || 0)
    await NAMESPACE.put(key, currentCount + 1)
    return new Response('ok')
}
function ensureEmoji(emoji) {
    const segments = Array.from(new Intl.Segmenter({ granularity: 'grapheme' }).segment(emoji.trim()))
    const parsedEmoji = segments.length > 0 ? segments[0].segment : null
    if (/\p{Emoji}/u.test(parsedEmoji)) return parsedEmoji
}