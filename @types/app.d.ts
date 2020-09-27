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

type User = {
	_id: string
	seen: string[]
}

type Stat = {
	_id: string
	views: number
}
