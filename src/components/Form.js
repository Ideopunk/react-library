import React, { useState } from "react";
// import ToggleSwitch from "./ToggleSwitch";

const TopForm = (props) => {
	const initialState = { title: "", author: "", pages: 0, read: false }
	return (
		<Form type="top" handleAdd={props.handleAdd} initialState={initialState} cn="form-container"/>
	)
}

const Modifier = (props) => {
	const initialState = { title: props.book.title, author: props.book.author, pages: props.book.pages, read: props.book.read}

	const closeModal = () => {
		props.closeModify()
	}

	return (
		<div className="cover" onClick={(e) => e.target.value === "cover"? closeModal : ""}>
			<Form id={props.book.id} handleModify={props.handleModify} type="modifier" initialState={initialState} cn="modifier"/>
		</div>
	)
}

const Form = (props) => {
	const [form, setForm] = useState(props.initialState);

	const handleChange = (e) => {
		console.log(e.target)
		let { name, value } = e.target;
		if (name === "read") {
			value = Boolean(value)
		}
		console.log(name, value)
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
        console.log(e.target);
		props.handleAdd(form);
		setForm({ title: "", author: "", pages: 0, read: false })
	};

	const handleEdit = (e) => {
		e.preventDefault()
		console.log(e.target)
		props.handleModify(props.id, form)
	}

	return (
		<div name={props.cn} className={props.cn}>
			<h1>Form</h1>
			<form className="form" onSubmit={props.type === "top"? handleSubmit : handleEdit}>
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
				<label>
					Read
					<input type="checkbox" name="read" value={form.read} onChange={handleChange} />
				</label>

				<input type="submit" className="submit" value={props.type === "top"? "Submit" : "Update"}/>
			</form>
		</div>
	);
};

export { Form, TopForm, Modifier};
