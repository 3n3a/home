export async function onRequestGet({ request, env }) {
    const path_group = request.url.split('/api/gallery')

    const response = await fetch(`${env["API_URL"]}/api/collections/users/auth-with-password`, {
        method: "POST",
        redirect: "follow",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identity: env["API_USERNAME"],
            password: env["API_PASSWORD"]
        })
    });
    const data = await response.json();
    const token = data["token"];

    if (path_group.length > 0) {
      const path = path_group[1]
      if (path.length > 0) {
        const reqUrl = `${env['API_URL']}/api/files${path}`
        const modifiedRequest = new Request(reqUrl, {
          headers: {
            'Accept': request.headers['accept'],
            'Authorization': "Bearer " + token
          },
          redirect: 'manual'
        })
        return fetch(modifiedRequest);
      }
    }
    const info = JSON.stringify({error: "Path is incorrect or missing."}, null, 2);
    return new Response(info);
  }
  