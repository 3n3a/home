import quotes from './quotes.json'

export async function onRequestGet({ }) {
    const randQuote = quotes[Math.floor(Math.random() * quotes.length)]
    const stringified = JSON.stringify(randQuote, null, 2)
    return new Response(stringified)
}