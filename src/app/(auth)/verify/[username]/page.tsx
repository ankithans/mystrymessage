"use client";

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post("/api/verify-code", {
				username: params.username,
				code: data.code,
			});

			toast({
				title: "Success",
				description: response.data.message,
			});
			router.replace("/sign-in");
			setIsSubmitting(false);
		} catch (error) {
			console.error("Error in sign up of user", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Sign up failed",
				description: errorMessage,
				variant: "destructive",
			});
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify Your Account
					</h1>
					<p className="mb-4">
						Enter your verification code sent to your email
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="code"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<Input placeholder="code" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Please wait
								</>
							) : (
								"Submit"
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerifyAccount;
