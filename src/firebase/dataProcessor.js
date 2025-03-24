// Import core Firebase services
import { initializeApp } from "firebase/app";

// Import Firestore
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  writeBatch,
  updateDoc,
} from "firebase/firestore";

// Import Authentication
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { User } from "../logic/collectData";

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

/**
 * Save full user + experiments + trials to Firestore.
 */
export async function saveTrialData() {
  try {
    const userDocRef = doc(db, "users", User.prolific_pid);

    // Step 1: Save main user info
    await setDoc(userDocRef, {
      prolific_pid: User.prolific_pid,
      create_time: User.create_time,
      end_time: User.end_time,
    });

    // Step 2: Save experiments
    for (const experiment of User.experiments) {
      const expRef = doc(
        collection(userDocRef, "experiments"),
        `${experiment.experiment_id}`
      );

      await setDoc(expRef, {
        experiment_id: experiment.experiment_id,
        create_time: experiment.create_time,
        end_time: experiment.end_time,
        num_trials: experiment.num_trials,
      });

      // Step 3: Save all trials under this experiment
      const trialBatch = writeBatch(db);
      for (const trial of experiment.trials) {
        const trialRef = doc(collection(expRef, "trials"), `${trial.trial_id}`);

        trialBatch.set(trialRef, {
          trial_id: trial.trial_id,
          create_time: trial.create_time,
          end_time: trial.end_time,
          performance: trial.performance,
          user_score: trial.user_score,
          best_score: trial.best_score,
          replay_num: trial.replay_num,
          reselect_num: trial.reselect_num,
          think_time: trial.think_time,
          total_time: trial.total_time,
          ai_choice: trial.ai_choice,
          best_choice: trial.best_choice,
          user_choice: trial.user_choice,
        });
      }
      await trialBatch.commit();
    }

    console.log(`✅ User ${User.prolific_pid}'s data saved to Firestore.`);
  } catch (error) {
    console.error("❌ Failed to save trial data:", error);
  }
}

/**
 * Save user feedback to Firestore under subcollection `feedback`.
 * @param {Object} feedbackData
 */
export async function saveFeedbackData(feedbackData) {
  try {
    const userRef = doc(db, "users", User.prolific_pid);
    const feedbackRef = doc(collection(userRef, "feedback"), "feedback_main");

    // ✅ Save feedback + update user end_time
    await Promise.all([
      setDoc(feedbackRef, {
        ...feedbackData,
      }),
      updateDoc(userRef, {
        end_time: User.end_time,
      }),
    ]);

    console.log("✅ Feedback saved and end_time updated in Firestore.");
  } catch (error) {
    console.error("❌ Failed to save feedback:", error);
  }
}
