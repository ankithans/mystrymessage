import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import brcypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthConfig = {
	providers: [
		Credentials({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials: any): Promise<any> => {
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.email },
							{ username: credentials.email },
						],
					});
					if (!user) {
						throw new Error("No user found with this email");
					}
					if (!user.isVerified) {
						throw new Error(
							"Please verify your account before login"
						);
					}
					const isPasswordCorrect = await brcypt.compare(
						credentials.password,
						user.password
					);
					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect password");
					}
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
				session.user.username = token.username;
			}
			return session;
		},
	},
};
