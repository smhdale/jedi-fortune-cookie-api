type Episode = {
	_id: string
	season: number
	episode: number
	title: string
	jediFortuneCookie: string | null
	links: {
		wookieepedia: string
		imdb: string
	}
}
