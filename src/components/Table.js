import React from "react";
import edit from "../assets/create-outline.svg";
import trash from "../assets/trash-outline.svg";
// import ToggleSwitch from "./ToggleSwitch";

const Table = (props) => {
	const booksTable = props.books.map((book) => {
		return (
			<div key={book.id} id={book.id} className="row">
				<div>{book.title}</div>
				<div>{book.author}</div>
				<img
					src={edit}
					className="edit-button row-button"
					onClick={() => props.initiateModify(book)}
					alt="edit"
				/>
				<div>{book.pages} pages</div>
				<div>{book.read}</div>
				<img
					src={trash}
					className="delete-button row-button"
					onClick={() => props.handleDelete(book.id)}
					alt="trash"
				/>
			</div>
		);
	});
	return (
		<div className="table-container">
			<h1 className="table-title">Table</h1>
			<div className="table">{booksTable}</div>
		</div>
	);
};

export default Table;
