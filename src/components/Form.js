import React, { useState } from "react";

const Form = (props) => {
	const [form, setForm] = useState({ title: "", author: "", pages: 0, read: false });

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
        props.handleAdd(form)
	};

	return (
		<div className="form-container">
			<h1>Form</h1>
			<form className="form" onSubmit={handleSubmit}>
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

				<input type="submit" className="submit" value="Submit"/>
			</form>
		</div>
	);
};

export default Form;
