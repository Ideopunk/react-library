import React, { useState } from "react";
// import ToggleSwitch from "./ToggleSwitch";

const TopForm = (props) => {
	const initialState = { title: "", author: "", pages: 0, read: false };
	return (
		<Form
			type="top"
			handleAdd={props.handleAdd}
			initialState={initialState}
			cn="form-container"
		/>
	);
};

const Modifier = (props) => {
	const initialState = {
		title: props.book.title,
		author: props.book.author,
		pages: props.book.pages,
		read: props.book.read,
	};

	const closeModal = (e) => {
		const value = e.target.getAttribute("value");
		if (value === "cover") {
			props.closeModify();
		}
	};

	return (
		<div className="cover" value="cover" name="cover" onClick={(e) => closeModal(e)}>
			<Form
				id={props.book.id}
				handleModify={props.handleModify}
				type="modifier"
				initialState={initialState}
				cn="modifier"
			/>
		</div>
	);
};

const Form = (props) => {
	const [form, setForm] = useState(props.initialState);

	const handleChange = (e) => {
		const target = e.target;
		const name = target.name;
		let value = target.type === "checkbox" ? target.checked : target.value;
		console.log(name, value);
		if (name === "read") {
			value = Boolean(value);
		}
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		props.handleAdd(form);
		setForm({ title: "", author: "", pages: 0, read: false });
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		e.preventDefault();
		props.handleModify(props.id, form);
	};

	return (
		<div name={props.cn} className={props.cn}>
			<h1>{props.type === "top" ? "Add a book" : "Update book"}</h1>
			<form className="form" onSubmit={props.type === "top" ? handleSubmit : handleEdit}>
				<label>
					Title
					<input type="text" name="title" value={form.title} onChange={handleChange} />
				</label>
				<label>
					Author
					<input type="text" name="author" value={form.author} onChange={handleChange} />
				</label>
				<label>
					Pages
					<input
						type="number"
						min="0"
						max="10000"
						step="1"
						name="pages"
						value={form.pages}
						onChange={handleChange}
					/>
				</label>
				{/* <label>
					Read
					<input type="checkbox" name="read" value={form.read} onChange={handleChange} />
				</label> */}

				<div className="toggle-wrapper">
					<div className="toggle normal">
						<input
							id={props.type === "top" ? "top-read" : "edit-read"}
							type="checkbox"
							name="read"
							value={form.read}
							onChange={handleChange}
						/>
						<label
							className="toggle-item"
							name="read"
							htmlFor={props.type === "top" ? "top-read" : "edit-read"}
							s
						></label>
					</div>
					<div className="name">Read</div>
				</div>
				<input
					type="submit"
					className="submit"
					value={props.type === "top" ? "Submit" : "Update"}
					onClick={props.type === "top" ? handleSubmit : handleEdit}
				/>
			</form>
		</div>
	);
};

export { Form, TopForm, Modifier };
