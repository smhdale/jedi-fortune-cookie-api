import Datastore from './Datastore'
import Episode from './Episode'

class StatStore extends Datastore<Stat> {
	private async bootstrapEpisode(season: number, episode: number) {
		const existing = await this.findOne({ season, episode })
		if (!existing) {
			const _id = [season, episode].join('.')
			await this.insert({ _id, season, episode, views: 0 })
		}
	}

	async bootstrap() {
		const episodes = await Episode.findAll()
		return Promise.all(
			episodes.map((ep) => {
				return this.bootstrapEpisode(ep.season, ep.episode)
			})
		)
	}

	track(season: number, episode: number) {
		this.updateOne({ season, episode }, { $inc: { views: 1 } })
	}
}

export default new StatStore('../../db/stats.db', 86400000)
