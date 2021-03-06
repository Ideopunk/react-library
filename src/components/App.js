import React, { lazy, Suspense, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import "../style/App.scss";
import { auth, db } from "../config/fbConfig";
import Menu from "./Login";
const Table = lazy(() => import("./Table"));
const Profile = lazy(() => import("./Profile"));
const TopForm = lazy(() => import("./TopForm"));
const Modifier = lazy(() => import("./Modifier"));

const LoaderContainer = () => {
	return (
		<div className="center">
			<Loader
				type="TailSpin"
				color="pink"
				height={100}
				width={100}
				timeout={3000} //3 secs
			/>
		</div>
	);
};

function App() {
	const [books, setBooks] = useState([]);
	const [modifier, setModifier] = useState(false);
	const [loadingDB, setLoadingDB] = useState(true); // for loader
	const [loadingUser, setLoadingUser] = useState(false); // for loader
	const [login, setLogin] = useState(0);
	const [error, setError] = useState(false);
	const [UID, setUID] = useState("");
	const [name, setName] = useState("");

	const handleSignUp = (email, password, name) => {
		setLoadingUser(true);
		auth.createUserWithEmailAndPassword(email, password).then((cred) => {
			return db
				.collection("users")
				.doc(cred.user.uid)
				.set({
					name: name,
				})
				.then(() => {
					setLogin(1);
					setLoadingUser(false);
					setError(false);
				});
		});
	};

	const handleSignOut = () => {
		setLogin(0);

		auth.signOut()
			.then(() => {
				setLogin(2);
				setBooks([]);
				setModifier(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleLogin = (email, password) => {
		setLoadingUser(true);
		auth.signInWithEmailAndPassword(email, password)
			.then((cred) => {
				setLogin(1);
				setLoadingUser(false);
				setError(false);
			})
			.catch((errorMessage) => {
				setLogin(2);
				setLoadingUser(false);
				setError(true);
				console.log(errorMessage);
			});
	};

	const handleAdd = (obj) => {
		console.log(`UID: ${UID}`);
		db.collection("users")
			.doc(UID)
			.collection("books")
			.add(obj)

			.catch((error) => {
				console.log(`error: ${error}`);
			});
	};

	const handleDelete = (id) => {
		db.collection("users")
			.doc(UID)
			.collection("books")
			.doc(id)
			.delete()
			.catch((error) => {
				console.log(`error: ${error}`);
			});
	};

	// popup the mod form.
	const initiateModify = (book) => {
		setModifier(book);
	};

	// submit modification.
	const handleModify = (id, obj) => {
		db.collection("users")
			.doc(UID)
			.collection("books")
			.doc(id)
			.set(obj)
			.catch((error) => {
				console.log(`error: ${error}`);
			});

		setModifier(false);
	};

	// close the mod form.
	const closeModify = () => {
		setModifier(false);
	};

	// we have a user token? Then we set some variables and start listening to database changes too.
	const userWhisperer = () => {
		auth.onAuthStateChanged((user) => {
			while (loadingUser) {
				setTimeout(() => {
					console.log("waiting for user's name to be added to database");
				}, 200);
			}
			if (user) {
				setUID(user.uid);
				db.collection("users")
					.doc(user.uid)
					.get()
					.then((result) => {
						setName(result.data().name);
						setLogin(1);
						databaseWhisperer(user.uid);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setLogin(2);
			}
		});
	};

	// listening for database changes.
	const databaseWhisperer = (UID) => {
		if (UID) {
			db.collection("users")
				.doc(UID)
				.collection("books")
				.onSnapshot(
					(snapshot) => {
						let changes = snapshot.docChanges();
						changes.forEach((change) => {
							let tempObj = change.doc.data();
							tempObj.id = change.doc.id;
							if (change.type === "added") {
								setBooks((books) => [...books, tempObj]);
							} else if (change.type === "modified") {
								setBooks((books) =>
									books.map((book) => {
										if (book.id === tempObj.id) {
											book = tempObj;
										}
										return book;
									})
								);
							} else if (change.type === "removed") {
								setBooks((books) =>
									books.filter((book) => {
										return book.id !== tempObj.id;
									})
								);
							}
						});
						setLoadingDB(false);
					},
					(err) => {
						console.log(err);
					}
				);
		}
	};

	// after mounting, check to see if we have a user token.
	useEffect(() => {
		userWhisperer();
	}, []);

	if (login === 1) {
		return (
			<div className="App">
				<Suspense fallback={<LoaderContainer />}>
					<Profile name={name} handleSignOut={handleSignOut} />
				</Suspense>
				<Suspense fallback={<LoaderContainer />}>
					<TopForm handleAdd={handleAdd} />
				</Suspense>
				{!loadingDB ? (
					<Suspense fallback={<LoaderContainer />}>
						<Table
							initiateModify={initiateModify}
							handleDelete={handleDelete}
							books={books}
							name={name}
						/>
					</Suspense>
				) : (
					<LoaderContainer />
				)}
				{modifier ? (
					<Suspense fallback={<LoaderContainer />}>
						<Modifier
							closeModify={closeModify}
							handleModify={handleModify}
							book={modifier}
						/>
					</Suspense>
				) : (
					""
				)}
			</div>
		);
	} else if (login === 2) {
		return (
			<div className="App">
				<Menu
					loading={loadingUser}
					handleLogin={handleLogin}
					handleSignUp={handleSignUp}
					error={error}
				/>
			</div>
		);
	} else {
		return (
			<div className="App">
				<LoaderContainer />
			</div>
		);
	}
}

export default App;
