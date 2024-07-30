import { signIn } from "@/app/api/auth/[...nextauth]/options";
import React from "react";

const SignIn = () => {
	return (
		<form
			action={async (formData) => {
				"use server";
				await signIn("credentials", formData);
			}}
		>
			<label>
				Email
				<input name="email" type="email" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<button>Sign In</button>
		</form>
	);
};

export default SignIn;
