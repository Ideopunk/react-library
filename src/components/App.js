import React, { useEffect, useState } from "react";
import "../style/App.scss";
import db from "../config/fbConfig";
import Form from "./Form";
import Table from "./Table";

function App() {
	const [books, setBooks] = useState([]);

	const handleAdd = (obj) => {
		console.log(obj);
		setBooks([...books, obj]);
	};

	useEffect(() => {
		db.collection("books")
			.get()
			.then((snap) => {
				if (snap) {
					let tempArray = [];
					snap.docs.forEach((doc) => {
						tempArray.push(doc.data());
					});
					setBooks(tempArray);
				} else {
					console.log("no such collection");
				}
			})
			.catch((error) => {
				console.log(`error getting doc: ${error}`);
			});
	}, []);

	return (
		<div className="App">
			<Form handleAdd={handleAdd} />
			<Table books={books} />
		</div>
	);
}

export default App;
