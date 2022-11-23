import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	User,
	signOut,
	onAuthStateChanged,
	NextOrObserver,
	connectAuthEmulator,
} from "firebase/auth";
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	connectFirestoreEmulator,
	collection,
	getDocs,
} from "firebase/firestore";
import {
	connectFunctionsEmulator,
	getFunctions,
	httpsCallable,
} from "firebase/functions";

const firebaseConfig = {
	apiKey: "AIzaSyAd0-9EYosQxLtZeqtXVVPlzzYUXCvCeos",
	authDomain: "authentication-63e55.firebaseapp.com",
	projectId: "authentication-63e55",
	storageBucket: "authentication-63e55.appspot.com",
	messagingSenderId: "691711446145",
	appId: "1:691711446145:web:b4c00fccfd38108ef5d180",
};

// initialize firebase tools
const firebaseApp = initializeApp(firebaseConfig);
const functions = getFunctions();
export const auth = getAuth();
export const db = getFirestore();

if (process.env.NODE_ENV === "development") {
	console.log("setting up firebase emulators");
	connectAuthEmulator(auth, "http://localhost:9099");
	connectFirestoreEmulator(db, "localhost", 8080);
	connectFunctionsEmulator(functions, "localhost", 5001);
}

// set up google authentication
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
	prompt: "select_account",
});

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// firestore document functions
export const createUserDocumentFromAuth = async (userAuth: User) => {
	const userDocRef = doc(db, "users", userAuth.uid);
	const userSnapshot = await getDoc(userDocRef);

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
			});
		} catch (error: any) {
			console.log("error creating user", error.message);
		}
	}
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
	onAuthStateChanged(auth, callback);

// cloud function calls

// get and set functions
export const getUsers = async () => {
	const usersRef = collection(db, "users");
	const snapshot = await getDocs(usersRef);
	return snapshot;
};
