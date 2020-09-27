import Datastore from './Datastore'

class EpisodeStore extends Datastore<Episode> {
	private static Wookieepedia = 'https://starwars.fandom.com/wiki/'
	private static IMDB = 'https://imdb.com/title/'

	private static hydrate(episode: Episode): Episode {
		return {
			...episode,
			links: {
				wookieepedia: EpisodeStore.Wookieepedia + episode.links.wookieepedia,
				imdb: EpisodeStore.IMDB + episode.links.imdb,
			},
		}
	}

	sanitise(episode: Episode): Omit<Episode, '_id'> {
		return {
			season: episode.season,
			episode: episode.episode,
			title: episode.title,
			jediFortuneCookie: episode.jediFortuneCookie,
			links: { ...episode.links },
		}
	}

	count(withFortune: boolean = false) {
		const query: any = {}
		if (withFortune) query.jediFortuneCookie = { $ne: null }
		return super.count(query)
	}

	async findBySeason(season: number) {
		const docs = await this.find({ season }, { episode: 1 })
		return docs.map(EpisodeStore.hydrate)
	}

	async findBySeasonAndEpisode(season: number, episode: number) {
		const doc = await this.findOne({ season, episode })
		if (doc !== null) return EpisodeStore.hydrate(doc)
		else return doc
	}

	async findByRandomFortune(ignore: string[] = []) {
		const docs = await this.find({
			_id: { $nin: ignore },
			jediFortuneCookie: { $ne: null },
		})
		const count = docs.length
		if (count) {
			const index = Math.floor(Math.random() * count)
			return EpisodeStore.hydrate(docs[index])
		} else {
			return null
		}
	}

	async findAll() {
		return this.find({})
	}
}

export default new EpisodeStore('../../db/episodes.db')
