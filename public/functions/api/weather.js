// In the Future this returns the weather for a location

export async function onRequestGet({ params }) {
  //const res = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`);
  //const data = await res.json();
  const data = {
    weathers: "cool"
  }
  const info = JSON.stringify(data, null, 2);
  return new Response(info);
}
