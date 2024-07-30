import dbConnect from "@/lib/dbConnect";
import { auth } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
	await dbConnect();

	const session = await auth();
	const user: User = session?.user;

	if (!session || !user) {
		return Response.json(
			{
				success: false,
				message: "Not Authenticated",
			},
			{ status: 401 }
		);
	}

	const userId = user._id;
	const { acceptMessages } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				isAcceptingMessage: acceptMessages,
			},
			{ new: true }
		);
		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "failed to update user status to accept messages",
				},
				{ status: 401 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "message acceptance status updated successfully",
				updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("failed to update user status to accept messages", error);
		return Response.json(
			{
				success: false,
				message: "failed to update user status to accept messages",
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	await dbConnect();

	const session = await auth();
	const user: User = session?.user;

	if (!session || !user) {
		return Response.json(
			{
				success: false,
				message: "Not Authenticated",
			},
			{ status: 401 }
		);
	}

	try {
		const userId = user._id;
		const foundUser = await UserModel.findById(userId);
		if (!foundUser) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				success: true,
				message: "",
				isAcceptingMessage: foundUser.isAcceptingMessage,
			},
			{ status: 404 }
		);
	} catch (error) {
		console.log("erorr in getting message acceptance status", error);
		return Response.json(
			{
				success: false,
				message: "erorr in getting message acceptance status",
			},
			{ status: 500 }
		);
	}
}
