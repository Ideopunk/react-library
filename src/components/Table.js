import React from "react";
import edit from "../assets/create-outline.svg";
import trash from "../assets/trash-outline.svg";

const Table = (props) => {
	const booksTable = props.books.map((book) => {
		return (
			<div key={book.id} id={book.id} className="row">
				<div className="row-data">
					<div>{book.title}</div>
					<div>{book.author}</div>
					<div>{book.pages} pages</div>
					<div>{book.read ? "I've read this!" : `I haven't read this yet!`}</div>
				</div>
				<div className="row-buttons">
					<img
						src={edit}
						className="edit-button row-button"
						onClick={() => props.initiateModify(book)}
						alt="edit"
					/>
					<img
						src={trash}
						className="delete-button row-button"
						onClick={() => props.handleDelete(book.id)}
						alt="trash"
					/>
				</div>
			</div>
		);
	});
	return (
		<div className="table-container">
			<h1 className="table-title">My Books</h1>
			<div className="table">{booksTable}</div>
		</div>
	);
};

export default Table;
