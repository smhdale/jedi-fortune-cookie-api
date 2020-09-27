import Datastore from './Datastore'

class UserStore extends Datastore<User> {
	create(uuid: string) {
		return this.insert({ _id: uuid, seen: [] })
	}

	findByUuid(uuid: string) {
		return this.findOne({ _id: uuid })
	}

	markSeen(uuid: string, episodeId: string) {
		return this.updateOne({ _id: uuid }, { $push: { seen: episodeId } })
	}

	clearSeen(uuid: string) {
		return this.updateOne({ _id: uuid }, { seen: [] })
	}
}

export default new UserStore('../../db/users.db', 86400000)
