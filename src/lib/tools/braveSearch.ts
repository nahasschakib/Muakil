export type BraveSearchResult = {
  title: string
  url: string
  description: string
}

export type BraveSearchResponse = {
  results: BraveSearchResult[]
  query: string
}

export async function braveSearch(
  query: string,
  count: number = 5
): Promise<BraveSearchResponse> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY
  if (!apiKey) throw new Error('BRAVE_SEARCH_API_KEY manquant')

  const url = new URL('https://api.search.brave.com/res/v1/web/search')
  url.searchParams.set('q', query)
  url.searchParams.set('count', String(count))
  url.searchParams.set('country', 'ALL')
  url.searchParams.set('search_lang', 'fr')
  url.searchParams.set('text_decorations', 'false')

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  })

  if (!res.ok) {
    throw new Error(`Brave Search erreur: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  const results: BraveSearchResult[] = (data.web?.results ?? []).map(
    (r: { title: string; url: string; description?: string }) => ({
      title: r.title,
      url: r.url,
      description: r.description ?? '',
    })
  )

  return { results, query }
}

export function formatSearchResults(response: BraveSearchResponse): string {
  if (response.results.length === 0) {
    return `Aucun résultat trouvé pour : "${response.query}"`
  }

  return [
    `Résultats de recherche pour : "${response.query}"`,
    '',
    ...response.results.map(
      (r, i) =>
        `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.description}`
    ),
  ].join('\n')
}
