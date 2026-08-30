import { getRequest } from "@tanstack/react-start/server";

import { withDatabase } from "#/db";
import { getAuth } from "#/lib/auth";

function getAdminEmail() {
	const email = process.env.ADMIN_EMAIL;

	if (!email) {
		throw new Error("ADMIN_EMAIL is missing");
	}

	return email.toLowerCase();
}

export async function getCurrentAuth() {
	return withDatabase(async () => {
		const session = await getAuth().api.getSession({
			headers: getRequest().headers,
		});

		if (!session) {
			return null;
		}

		return {
			user: session.user,
			isOwner: session.user.email.toLowerCase() === getAdminEmail(),
		};
	});
}
