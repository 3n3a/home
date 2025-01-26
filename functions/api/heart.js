/**
 * Send Emoji Reactions to my page
 * 
 * Source: openheart.fyi
 */

export async function onRequestGet({ request, env }) {
    const emoji = ensureEmoji(await request.text());
    if (!emoji) return new Response('not ok', { status: 500 });

    const hearts = env.HEARTS.getAll();
    const info = JSON.stringify(hearts);
    
    return new Response(info);
}

export async function onRequestPost({ request, env }) {
    const emoji = ensureEmoji(await request.text());
    if (!emoji) return new Response('not ok', { status: 500 });

    const key = `${emoji}`;
    // https://developers.cloudflare.com/workers/runtime-apis/kv/
    const currentCount = Number(await (HEARTS.get(key)) || 0);
    await env.HEARTS.put(key, currentCount + 1);

    return new Response('ok');
}

function ensureEmoji(emoji) {
    const segments = Array.from(new Intl.Segmenter({ granularity: 'grapheme' }).segment(emoji.trim()))
    const parsedEmoji = segments.length > 0 ? segments[0].segment : null
    if (/\p{Emoji}/u.test(parsedEmoji)) return parsedEmoji
}