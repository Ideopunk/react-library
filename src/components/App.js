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
	const [login, setLogin] = useState(false);

	const handleSignUp = (email, password) => {
		setLoadingUser(true);
		console.log("new account");
		auth.createUserWithEmailAndPassword(email, password).then((cred) => {
			console.log(cred.user);
			setLogin(true);
			setLoadingUser(false);
		});
	};

	const handleSignOut = () => {
		auth.signOut().then(() => {
			console.log("logged out");
		});
	};

	const handleLogin = (email, password) => {
		setLoadingUser(true);
		auth.signInWithEmailAndPassword(email, password).then((cred) => {
			console.log("log-in");
			console.log(cred.user);
			setLogin(true);
			setLoadingUser(false);
		});
	};

	const handleAdd = (obj) => {
		db.collection("books")
			.add(obj)
			.then((docRef) => {
				console.log(docRef);
			})
			.catch((error) => {
				console.log(`error: ${error}`);
			});
	};

	const handleDelete = (id) => {
		db.collection("books")
			.doc(id)
			.delete()
			.catch((error) => {
				console.log(`error: ${error}`);
			});
	};

	const initiateModify = (book) => {
		console.log(book);
		setModifier(book);
	};

	const handleModify = (id, obj) => {
		console.log("handleModify");
		db.collection("books")
			.doc(id)
			.set(obj)
			.then(console.log("Succesful modification!"))
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
				console.log('user logged in', user)
				setLogin(true)
			} else {
				console.log('user logged out')
				setLogin(false)
			}
		});
	};

	const databaseWhisperer = () => {
		db.collection("books").onSnapshot((snapshot) => {
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
		});
	};

	useEffect(() => {
		userWhisperer();
		databaseWhisperer();
	}, []);

	if (login) {
		return (
			<div className="App">
				<Profile handleSignOut={handleSignOut} />
				<TopForm handleAdd={handleAdd} />
				{!loadingDB ? (
					<Table
						initiateModify={initiateModify}
						handleDelete={handleDelete}
						books={books}
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
	} else {
		return (
			<div className="App">
				<Menu
					loading={loadingUser}
					handleLogin={handleLogin}
					handleSignUp={handleSignUp}
					login={login}
				/>
			</div>
		);
	}
}

export default App;
