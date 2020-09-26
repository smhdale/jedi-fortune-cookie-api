type Episode = {
	season: number
	episode: number
	title: string
	jediFortuneCookie: string | null
	links: {
		wookieepedia: string
		imdb: string
	}
}
