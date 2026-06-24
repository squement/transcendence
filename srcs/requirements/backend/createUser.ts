import { prisma } from "./src/lib/prisma"

export default async function createUser()
{
	const user = await prisma.user.create({
		data: {
			username: "bowie_knife_99",
			email: "shunt@fyou.com",
		},
	});
	console.log("Created user: ", user);
	
	const allUsers = await prisma.user.findMany({});

	console.log("All users:", JSON.stringify(allUsers, null, 2));
}
