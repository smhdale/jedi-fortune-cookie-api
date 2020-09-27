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

	protected async insert(document: T): Promise<T> {
		return new Promise((resolve, reject) => {
			this.db.insert(document, (err, doc) => {
				if (err) reject(err)
				else resolve(doc)
			})
		})
	}

	protected async updateOne(query: any, update: any): Promise<T> {
		const opts: Nedb.UpdateOptions = { returnUpdatedDocs: true, multi: false }
		return new Promise((resolve, reject) => {
			this.db.update(query, update, opts, (err, updates, doc: T) => {
				if (err) reject(err)
				else resolve(doc)
			})
		})
	}

	protected async find(
		query: any,
		sort?: Record<string, number>
	): Promise<T[]> {
		return new Promise((resolve, reject) => {
			const cursor = this.db.find(query)
			if (sort) cursor.sort(sort)
			cursor.exec((err: Error | null, docs: T[]): void => {
				if (err) reject(err)
				else resolve(docs)
			})
		})
	}

	protected async findOne(query: any): Promise<T | null> {
		return new Promise((resolve, reject) => {
			this.db.findOne(query, (err, doc: T): void => {
				if (err) reject(err)
				else resolve(doc)
			})
		})
	}

	protected async count(query: any): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db.count(query, (err, count) => {
				if (err) reject(err)
				else resolve(count)
			})
		})
	}
}
