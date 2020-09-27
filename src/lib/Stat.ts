import Datastore from './Datastore'
import Episode from './Episode'

class StatStore extends Datastore<Stat> {
	private async bootstrapEpisode({ _id }: Episode) {
		const existing = await this.findOne({ _id })
		if (!existing) await this.insert({ _id, views: 0 })
	}

	async bootstrap() {
		const episodes = await Episode.findAll()
		const bootstrap = this.bootstrapEpisode.bind(this)
		return Promise.all(episodes.map(bootstrap))
	}

	track({ _id }: Episode) {
		this.updateOne({ _id }, { $inc: { views: 1 } })
	}
}

export default new StatStore('../../db/stats.db', 86400000)
