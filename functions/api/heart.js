/**
 * Send Emoji Reactions to my page
 * 
 * Source: openheart.fyi
 */

export async function onRequestGet({ env }) {
    let hearts = {};
    const heartsList = await env.HEARTS.list();
    for (const heartElement of heartsList.keys) {
        const count = Number(await (env.HEARTS.get(heartElement.name)) || 0);
        hearts[`${heartElement.name}`] = count;
    }
    return Response.json(hearts);
}

export async function onRequestPost({ request, env }) {
    const emoji = ensureEmoji(await request.text());
    if (!emoji) return Response.json({status: 'not ok'}, { status: 500 });

    const key = `${emoji}`;
    // https://developers.cloudflare.com/workers/runtime-apis/kv/
    const currentCount = Number(await (env.HEARTS.get(key)) || 0);
    await env.HEARTS.put(key, currentCount + 1);

    return Response.json({status: 'ok'})
}

function ensureEmoji(emoji) {
    const segments = Array.from(new Intl.Segmenter({ granularity: 'grapheme' }).segment(emoji.trim()))
    const parsedEmoji = segments.length > 0 ? segments[0].segment : null
    if (/\p{Emoji}/u.test(parsedEmoji)) return parsedEmoji
}