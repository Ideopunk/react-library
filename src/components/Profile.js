import React from "react";
import power from "../assets/power-outline.svg";

const Profile = (props) => {
	return (
		<div className="profile-div" onClick={() => props.handleSignOut()}>
			<p>Hi {props.name}!</p>
			<img src={power} className="power-button" alt="end session" />
		</div>
	);
};

export default Profile;