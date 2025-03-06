// Import core Firebase services
import { initializeApp } from "firebase/app";

// Import Firestore
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

// Import Authentication
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { User } from "../data/model";

const firebaseConfig = {
  apiKey: "AIzaSyD3a4Fpidhih8x1piqgojtVt5pV-Nz1b0E",
  authDomain: "human-ai-interaction-a1355.firebaseapp.com",
  projectId: "human-ai-interaction-a1355",
  storageBucket: "human-ai-interaction-a1355.firebasestorage.app",
  messagingSenderId: "695175357546",
  appId: "1:695175357546:web:cea7b036fe881e1d5a5613",
};

// Initialize App
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export var firebaseUserId = "not initialized yet";

await signInAnonymously(auth)
  .then(() => {
    //console.log( "Firebase authentication successful...")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const msg =
      "Firebase authentication failed. Errorcode: " +
      errorCode +
      " : " +
      errorMessage;
    //console.error( msg );
    throw msg;
  });

await onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    firebaseUserId = user.uid;
    //console.log( "User is signed in. Firebase user id=" + firebaseUserId );
  } else {
    // User is signed out
    //console.log( "User is signed out" );
  }
});

// Function to add user data
/**
 * @param {User} user
 */
async function addUser(user) {
  try {
    console.log(
      "User-prolific_pid:",
      user.prolific_pid,
      "create_time:",
      user.create_time,
      "end_time:",
      user.end_time,
      "feedback:",
      user.feedback
    );
    await setDoc(doc(db, "users", user.prolific_pid), {
      prolific_pid: user.prolific_pid,
      create_time: user.create_time,
      end_time: user.end_time,
      feedback: user.feedback,
      experiments: [``],
    });
    console.log(`User ${user.prolific_pid} added successfully!`);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
}

export function saveTrialData() {
  addUser(User);
}
