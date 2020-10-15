import React from "react";
import Form from "./Form";

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

export default TopForm;
