import { z } from "zod";

export const acceptMessageScehma = z.object({
	acceptMessages: z.boolean(),
});
