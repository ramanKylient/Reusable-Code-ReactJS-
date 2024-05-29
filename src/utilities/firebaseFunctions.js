// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWvOnUYhVGBFNpAJnr1Fs7QN6l8xa0Qg8",
  authDomain: "reusable-4e9f6.firebaseapp.com",
  projectId: "reusable-4e9f6",
  storageBucket: "reusable-4e9f6.appspot.com",
  messagingSenderId: "689174154544",
  appId: "1:689174154544:web:4765d6f96124c09b780cf5",
  measurementId: "G-99KK2FM61V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Function to handle file upload to Firebase Storage
export const handleFileUpload = async (file) => {
  try {
    // Construct reference to the storage location
    const storageRef = ref(storage, `user/profile/${v4()}`);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the path_ property directly and return it
    const path_ = storageRef._location.path_;

    return path_;
  } catch (error) {
    // Handle errors
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Function to get download URL
export const downloadResource = async (storagePath) => {
  try {
    // Get the download URL for the file at the given path
    const downloadURL = await getDownloadURL(ref(storage, storagePath));
    return downloadURL;
  } catch (error) {
    // Handle errors
    console.error("Error getting download URL for path:", storagePath, error);
    if (error.code === "storage/object-not-found") {
      // File not found, return null
      console.error("File not found at path:", storagePath);
      return null;
    } else {
      // Unexpected error, throw an exception
      throw new Error("Unexpected error occurred while getting download URL.");
    }
  }
};
