// In the Future this returns the weather for a location

export async function onRequestGet({ request, env }) {
  const latitude = request.cf.latitude;
  const longitude = request.cf.longitude;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${env['API_KEY']}`);
  const data = await res.json();
  const info = JSON.stringify(data, null, 2);
  return new Response(info);
}
