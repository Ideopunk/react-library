import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCRMxRUqUr9OcBFRsdr0k5CSYCn8jwUVTM",
	authDomain: "react-library-93b10.firebaseapp.com",
	databaseURL: "https://react-library-93b10.firebaseio.com",
	projectId: "react-library-93b10",
	storageBucket: "react-library-93b10.appspot.com",
	messagingSenderId: "613694204962",
	appId: "1:613694204962:web:fa9f221640e0ccf012ee7b",
};
firebase.initializeApp(firebaseConfig);

// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
export { auth, db };
