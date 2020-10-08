import React from "react";

const Table = (props) => {
	const booksTable = props.books.map((book) => {
		return (
			<div className="row">
				<div>{book.title}</div>
				<div>{book.author}</div>
				<div>{book.pages}</div>
				<div>{book.read}</div>
			</div>
		);
	});
	return (
		<div>
			<h1>Table</h1>
            {booksTable}
		</div>
	);
};

export default Table;
