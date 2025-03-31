export async function onRequestGet({ request, env }) {
  const latitude = request.cf.latitude;
  const longitude = request.cf.longitude;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${env['WEATHER_API_KEY']}&units=metric`);
  const data = await res.json();
  const info = JSON.stringify(data, null, 2);
  return new Response(info);
}
