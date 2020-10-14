import React, { useState } from "react";
import Loader from "react-loader-spinner";
import power from "../assets/power-outline.svg";

const UserMenu = (props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		props.handleSubmit(email, password, name);
	};

	const user = (
		<label>
			Username
			<input
				name="name"
				required
				value={name}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
		</label>
	);

	return (
		<form className="sign-up-menu" onSubmit={(e) => handleSubmit(e)}>
			{props.type === "sign-up" ? user : ""}
			<label>
				Email
				<input
					type="email"
					name="email"
					value={email}
					required
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
			</label>
			<label>
				Password
				<input
					type="password"
					name="password"
					minLength={6}
					value={password}
					placeholder={props.warning ? props.warning : ""}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
			</label>
			<input type="submit" value={props.submitText} />
		</form>
	);
};

const Menu = (props) => {
	const [signUpMenu, setSignUpMenu] = useState(false);
	const [loginMenu, setLoginMenu] = useState(false);

	const toggleSignUp = () => {
		setSignUpMenu(!signUpMenu);
		setLoginMenu(false);
	};

	const toggleLogin = () => {
		setLoginMenu(!loginMenu);
		setSignUpMenu(false);
	};

	const logUl = (
		<ul className="menu">
			{props.error ? (
				<li className="error-message">Login failed. Check your spelling or something??</li>
			) : (
				""
			)}
			<li className={loginMenu ? "active" : ""} onClick={toggleLogin}>
				Login
			</li>
			<li className={signUpMenu ? "active" : ""} onClick={toggleSignUp}>
				Sign up
			</li>
		</ul>
	);

	if (props.loading) {
		return (
			<div className="center">
				<Loader
					type="TailSpin"
					color="pink"
					height={100}
					width={100}
					timeout={3000} //3 secs
				/>
			</div>
		);
	} else {
		return (
			<div>
				{logUl}
				{signUpMenu ? (
					<UserMenu
						warning="Do not reuse passwords"
						type="sign-up"
						submitText="Create Account"
						handleSubmit={props.handleSignUp}
					/>
				) : (
					""
				)}
				{loginMenu ? (
					<UserMenu type="log-in" submitText="Log in" handleSubmit={props.handleLogin} />
				) : (
					""
				)}
			</div>
		);
	}
};

const Profile = (props) => {
	// const [profile, setProfile] = useState(false);
	// const resetProfile = () => {
	// 	setProfile(false);
	// };

	return (
		<div className="profile-div">
			<p>Hi {props.name}!</p>
			<img
				src={power}
				className="power-button"
				onClick={() => props.handleSignOut()}
				alt="end session"
			/>
		</div>
	);
};

export { Profile, Menu };
