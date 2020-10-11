import React, { useEffect, useState } from "react";
import "../style/App.scss";
import db from "../config/fbConfig";
import Form from "./Form";
import Table from "./Table";

function App() {
	const [books, setBooks] = useState([]);	

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

	const handleModify = (id, obj) => {
		db.collection("books")
			.doc(id)
			.set(obj)
			.catch((error) => {
				console.log(`error: ${error}`);
			});
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
			<Form handleAdd={handleAdd} />
			<Table handleModify={handleModify} handleDelete={handleDelete} books={books} />
		</div>
	);
}

export default App;
