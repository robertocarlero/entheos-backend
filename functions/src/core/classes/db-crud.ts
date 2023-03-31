import { GenerateId } from '../utils/generate-id';
import * as admin from 'firebase-admin';

export abstract class DBCrud {
	protected PATH = '';
	protected db = admin.firestore();

	constructor() {
		setTimeout(() => {
			this.initialize();
		}, 0);
	}

	protected initialize() {}

	protected set(data: any, id?: string, path = this.PATH): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const doc_id = id || GenerateId();
				data['changed_by'] = 'firebase-functions';
				data['last_change'] = admin.firestore.Timestamp.now();
				delete data?.id;
				const ref = this.db.doc(`${path}/${doc_id}`);
				await ref.set(data, { merge: true });
				resolve('La información fue guardada exitosamente.');
			} catch (error) {
				console.log(error);
				reject('Hubo un error al intentar guardar la información.');
			}
		});
	}

	protected delete(id: string, path = this.PATH): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.doc(`${path}/${id}`).delete();
				resolve('La información fue eliminda exitosamente.');
			} catch (error) {
				reject('Hubo un error al intentar eliminar la información.');
			}
		});
	}

	protected get(id: string, path = this.PATH): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const doc = await this.db.doc(`${path}/${id}`).get();
				const data = this.transformDoc(doc);
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	}

	protected getAll(path = this.PATH): Promise<any[]> {
		return new Promise(async (resolve) => {
			const res = await this.db.collection(path).get();
			const data = res.docs.map((doc) => this.transformDoc(doc));
			resolve(data);
		});
	}

	protected transformDoc(doc: admin.firestore.DocumentData): any {
		if (!doc?.exists) return null;
		return {
			...doc.data(),
			id: doc.id,
		};
	}
}
