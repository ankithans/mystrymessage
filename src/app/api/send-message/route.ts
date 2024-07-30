import dbConnect from "@/lib/dbConnect";
import { auth } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Message } from "@/model/User";

export async function POST(request: Request) {
	await dbConnect();
	const { username, content } = await request.json();

	try {
		const user = await UserModel.findOne({ username });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// is user accepting the messages
		if (!user.isAcceptingMessage) {
			return Response.json(
				{
					success: false,
					message: "User is not accepting the messsages",
				},
				{ status: 403 }
			);
		}

		const newMessage = { content, createdAt: new Date() };
		user.messages.push(newMessage as Message);
		await user.save();

		return Response.json(
			{
				success: true,
				message: "Message sent successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("An unepected error occured", error);
		return Response.json(
			{
				success: false,
				message: "An unepected error occured",
			},
			{ status: 500 }
		);
	}
}
