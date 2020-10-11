import React from "react";

const Table = (props) => {
	const booksTable = props.books.map((book) => {
		return (
			<div key={book.id} id={book.id} className="row">
				<div>{book.title}</div>
				<div>{book.author}</div>
				<div>{book.pages}</div>
				<div>{book.read}</div>
                <div onClick={() => props.handleDelete(book.id)}>x</div>
			</div>
		);
	});
	return (
		<div className="table">
			<h1>Table</h1>
            {booksTable}
		</div>
	);
};

export default Table;
