import { Image } from '../interfaces/image';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import mkdirp = require('mkdirp');
const spawn = require('child-process-promise').spawn;

const storage = admin.storage();

const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

export const GenerateThumbnail = (image: Image): Promise<Image> => {
	return new Promise(async (resolve, reject) => {
		const response = image;
		response['url_thumb'] = image.url;
		try {
			const filePath = image.path;
			const contentType = image.contentType; // This is the image MIME type
			const fileDir = path.dirname(filePath);
			const fileName = path.basename(filePath);
			const thumbFilePath = path.normalize(
				path.join(fileDir, `${THUMB_PREFIX}${fileName}`)
			);
			const tempLocalFile = path.join(os.tmpdir(), filePath);
			const tempLocalDir = path.dirname(tempLocalFile);
			const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

			if (!contentType.startsWith('image/')) return resolve(response);

			const bucket = storage.bucket();
			const file = bucket.file(filePath);
			const thumbFile = bucket.file(thumbFilePath);
			const metadata = {
				contentType: contentType,
			};
			await mkdirp(tempLocalDir);
			await file.download({ destination: tempLocalFile });
			await spawn(
				'convert',
				[
					tempLocalFile,
					'-thumbnail',
					`${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
					tempLocalThumbFile,
				],
				{ capture: ['stdout', 'stderr'] }
			);
			await bucket.upload(tempLocalThumbFile, {
				destination: thumbFilePath,
				metadata: metadata,
			});
			fs.unlinkSync(tempLocalFile);
			fs.unlinkSync(tempLocalThumbFile);
			const url = await thumbFile.getSignedUrl({
				action: 'read',
				expires: '03-01-2500',
			});
			response['url_thumb'] = url[0];
			return resolve(response);
		} catch (error) {
			console.error(error);
			resolve(image);
		}
	});
};
