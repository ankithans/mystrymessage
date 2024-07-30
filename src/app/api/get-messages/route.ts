import dbConnect from "@/lib/dbConnect";
import { auth } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GetMessages(request: Request) {
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

	const userId = new mongoose.Types.ObjectId(user._id);
	try {
		const user = await UserModel.aggregate([
			{ $match: { id: userId } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);

		if (!user || user.length === 0) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 401 }
			);
		}

		return Response.json(
			{
				success: true,
				messages: user[0].messages,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error adding message", error);
		return Response.json(
			{
				success: false,
				message: "Error adding messsage",
			},
			{ status: 500 }
		);
	}
}
