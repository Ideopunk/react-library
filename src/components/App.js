import React, { useEffect, useState } from "react";
import "../style/App.scss";
import { auth, db } from "../config/fbConfig";
import { TopForm, Modifier } from "./Form";
import Table from "./Table";
import Loader from "react-loader-spinner";
import { Profile, Menu } from "./Login";

function App() {
	const [books, setBooks] = useState([]);
	const [modifier, setModifier] = useState(false);
	const [loadingDB, setLoadingDB] = useState(true); // Hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
	const [loadingUser, setLoadingUser] = useState(false);
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

	const initiateModify = (book) => {
		setModifier(book);
	};

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

	const closeModify = () => {
		setModifier(false);
	};

	const userWhisperer = () => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUID(user.uid)
				db.collection("users")
					.doc(user.uid)
					.get()
					.then((result) => {
						setName(result.data().name);
						setLogin(1);
						databaseWhisperer(user.uid);
					}).catch(error => {console.log(error)});
				
			} else {
				setLogin(2);
			}
		});
	};

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
						console.log(err.message);
					}
				);
		}
	};

	useEffect(() => {
		userWhisperer();
	}, []);

	if (login === 1) {
		return (
			<div className="App">
				<Profile name={name} handleSignOut={handleSignOut} />
				<TopForm handleAdd={handleAdd} />
				{!loadingDB ? (
					<Table
						initiateModify={initiateModify}
						handleDelete={handleDelete}
						books={books}
						name={name}
					/>
				) : (
					<div className="center">
						<Loader
							type="TailSpin"
							color="pink"
							height={100}
							width={100}
							timeout={3000} //3 secs
						/>
					</div>
				)}
				{modifier ? (
					<Modifier
						closeModify={closeModify}
						handleModify={handleModify}
						book={modifier}
					/>
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
				<div className="center">
					<Loader
						type="TailSpin"
						color="pink"
						height={100}
						width={100}
						timeout={3000} //3 secs
					/>
				</div>
			</div>
		);
	}
}

export default App;
