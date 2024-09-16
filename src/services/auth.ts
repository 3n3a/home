export async function getToken(env=import.meta.env) {
    const { API_URL, API_USERNAME, API_PASSWORD } = env;

    const response = await fetch(`${API_URL}/api/collections/users/auth-with-password`, {
        method: "POST",
        redirect: "follow",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identity: API_USERNAME,
            password: API_PASSWORD
        })
    });
    const data = await response.json();
    return data["token"];
}