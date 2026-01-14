import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Uploads a File to Firebase Storage and returns its download URL.
 * @param {File} file - browser File object
 * @returns {Promise<string>} download URL
 */
export default async function uploadImageToFirebase(file) {
  if (!file) throw new Error("No file provided");

  const filename = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `hotels/${filename}`);

  // uploadBytes accepts a File/Blob
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);
  return url;
}
