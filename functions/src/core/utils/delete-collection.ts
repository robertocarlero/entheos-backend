import * as admin from 'firebase-admin';

const db = admin.firestore();

export const DeleteCollection = (
	collectionPath: string,
	batchSize: number = 10
): Promise<any> => {
	const collectionRef = db.collection(collectionPath);
	const query = collectionRef.limit(batchSize);
	return DeleteQueryBatch(query, batchSize);
};

const DeleteQueryBatch = (query: any, batchSize: number): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		try {
			const snapshot = await query.get();
			if (snapshot.size === 0) return resolve(0);
			const batch = db.batch();
			snapshot.docs.forEach((doc: any) => {
				batch.delete(doc.ref);
			});
			await batch.commit();
			await DeleteQueryBatch(query, batchSize);
		} catch (error) {
			reject(error);
		}
	});
};
