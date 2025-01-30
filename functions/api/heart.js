/**
 * Send Emoji Reactions to my page
 * 
 * Source: openheart.fyi
 */

function getHeartId(request) {
    const referer = request.headers.get('referer');
    const id = btoa(referer);
    return id;
}

export async function onRequestGet({ request, env }) {
    const id = getHeartId(request);

    let hearts = {};
    const heartsList = await env.HEARTS.list({prefix: `${id}-`});

    if (heartsList.keys.length === 0) {
        hearts['❤️'] = 0;
    }

    for (const heartElement of heartsList.keys) {
        const count = Number(await (env.HEARTS.get(heartElement.name)) || 0);
        const [id, emoji] = heartElement.name.split("-");
        hearts[emoji] = count;
    }
    return Response.json(hearts);
}

export async function onRequestPost({ request, env }) {
    const id = getHeartId(request);

    const emoji = ensureEmoji(await request.text());
    if (!emoji) return Response.json({status: 'not ok'}, { status: 500 });

    const key = `${id}-${emoji}`;
    // https://developers.cloudflare.com/workers/runtime-apis/kv/
    const currentCount = Number(await (env.HEARTS.get(key)) || 0);
    const newCount = currentCount + 1;
    await env.HEARTS.put(key, newCount);

    return Response.json({status: 'ok', count: newCount})
}

function ensureEmoji(emoji) {
    const segments = Array.from(new Intl.Segmenter({ granularity: 'grapheme' }).segment(emoji.trim()))
    const parsedEmoji = segments.length > 0 ? segments[0].segment : null
    if (/\p{Emoji}/u.test(parsedEmoji)) return parsedEmoji
}