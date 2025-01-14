import admin from 'firebase-admin';
import { v4 } from 'uuid';

export const ImageUpload = async (base64Img, filePath) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(`images/${filePath}`);

  const mimeType = 'image/jpeg';
  const base64EncodedImageString = base64Img;
  const imageBuffer = new Buffer.from(base64EncodedImageString, 'base64');
  const uuid = v4();

  const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`images/${filePath}`)}?alt=media&token=${uuid}`;

  await file.save(imageBuffer, {
    metadata: {
      contentType: mimeType,
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
  });

  return downloadURL;
};

export const ImageDelete = async (imageURL) => {
  if (imageURL) {
    const pathArray = decodeURIComponent(imageURL)
      .split('?')[0]
      .split('/')
      .reverse();
    const imagePath = `${pathArray[2]}/${pathArray[1]}/${pathArray[0]}`;
    await admin.storage().bucket().file(imagePath).delete();
  }
};
