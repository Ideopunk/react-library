import React, { useEffect, useState } from "react";
import "../style/App.scss";
import db from "../config/fbConfig";
import { TopForm, Modifier } from "./Form";
import Table from "./Table";
import Loader from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
	const [books, setBooks] = useState([]);
	const [modifier, setModifier] = useState(false);
	const [loading, setLoading] = useState(true);

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

	const databaseWhisperer = () => {
		db.collection("books").onSnapshot((snapshot) => {
			let changes = snapshot.docChanges();
			console.log(changes);
			changes.forEach((change) => {
				console.log(change.doc.data());
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
					console.log(change, change.doc.data()); // just gonna check out this here new thing...
				} else if (change.type === "removed") {
					setBooks((books) =>
						books.filter((book) => {
							return book.id !== tempObj.id;
						})
					);
				}
			});
			setLoading(false);
		});
	};

	useEffect(() => {
		databaseWhisperer();
	}, []);

	return (
		<div className="App">
			<TopForm handleAdd={handleAdd} />
			{!loading ? (
				<Table initiateModify={initiateModify} handleDelete={handleDelete} books={books} />
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
				<Modifier closeModify={closeModify} handleModify={handleModify} book={modifier} />
			) : (
				""
			)}
		</div>
	);
}

export default App;
