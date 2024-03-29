export async function onRequestGet({ request, env }) {
    const path_group = request.url.split('/api/gallery')

    if (path_group.length > 0) {
      const path = path_group[1]
      if (path.length > 0) {
        console.log(env)
        const reqUrl = `${env['API_URL']}/files${path}`
        console.log(reqUrl)
        const modifiedRequest = new Request(reqUrl, {
          headers: {
            'Accept': request.headers['accept'],
            'apikey': env['API_KEY']
          },
          redirect: 'manual'
        })
        return fetch(modifiedRequest);
      }
    }
    const info = JSON.stringify({error: "Path is incorrect or missing."}, null, 2);
    return new Response(info);
  }
  