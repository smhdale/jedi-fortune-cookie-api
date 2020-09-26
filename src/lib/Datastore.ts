import { resolve } from 'path'
import Nedb from 'nedb'

export default abstract class Datastore<T extends any> {
	protected db: Nedb

	constructor(filename: string, autocompactionInterval?: number) {
		this.db = new Nedb<T>({
			filename: resolve(__dirname, filename),
			autoload: true,
		})
		if (autocompactionInterval) {
			this.db.persistence.setAutocompactionInterval(autocompactionInterval)
		}
	}

	protected async find(query: any): Promise<T[]> {
		return new Promise((resolve, reject) => {
			this.db.find(query, (err: Error | null, docs: T[]): void => {
				if (err) reject(err)
				else resolve(docs)
			})
		})
	}

	protected async findOne(query: any): Promise<T | null> {
		return new Promise((resolve, reject) => {
			this.db.findOne(query, (err, doc): void => {
				if (err) reject(err)
				else resolve(doc)
			})
		})
	}
}
