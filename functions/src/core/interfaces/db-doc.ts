import * as admin from 'firebase-admin';

export interface DBDoc {
	id: string;
	search?: string[];
	changed_by: string;
	created_by: string;
	last_changed_date: admin.firestore.Timestamp;
	created_date: admin.firestore.Timestamp;
}
