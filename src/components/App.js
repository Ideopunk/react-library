import React, { useEffect, useState } from "react";
import "../style/App.scss";
import db from "../config/fbConfig";
import {Form, TopForm, Modifier} from "./Form";
import Table from "./Table";

function App() {
	const [books, setBooks] = useState([]);	
	const [modifier, setModifier] = useState(false)

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
		console.log(book)
		setModifier(book)
	}

	const handleModify = (id, obj) => {
		db.collection("books")
			.doc(id)
			.set(obj)
			.catch((error) => {
				console.log(`error: ${error}`);
			});

		setModifier(false)
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
					console.log(change, change.doc.data()); // just gonna check out this here new thing...
				} else if (change.type === "removed") {
					setBooks((books) =>
						books.filter((book) => {
							return book.id !== tempObj.id;
						})
					);
				}
			});
		});
	};

	useEffect(() => {
		databaseWhisperer();
	}, []);

	return (
		<div className="App">
			<TopForm handleAdd={handleAdd} />
			<Table initiateModify={initiateModify} handleDelete={handleDelete} books={books} />
			{modifier? <Modifier book={modifier} /> : ""}
		</div>
	);
}

export default App;
