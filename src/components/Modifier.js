import React, {useState, useEffect} from "react";
import Form from "./Form";

const Modifier = (props) => {
	const [fade, setFade] = useState(false);

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

	useEffect(() => {
		setFade(true);
	}, []);

	return (
		<div
			className={`cover ${fade ? "cover-fade" : ""}`}
			value="cover"
			name="cover"
			onClick={(e) => closeModal(e)}
		>
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

export default Modifier;