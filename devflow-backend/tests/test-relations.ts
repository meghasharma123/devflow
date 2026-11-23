import prisma from "../src/config/prisma";

async function createRel() {
  try {
    const google = await prisma.organization.create({
      data: {
        name: "Google",
      },
    });

    const microsoft = await prisma.organization.create({
      data: {
        name: "Microsoft",
      },
    });

    const user = await prisma.user.create({
      data: {
        name: "Ravi",
        email: "ravi@gmail.com",
      },
    });
    console.log("user:", user);

    const relation = await prisma.userOrganization.createMany({
      data: [
        {
          userId: user.id,
          organizationId: google.id,
          role: "ADMIN",
        },
        {
          userId: user.id,
          organizationId: microsoft.id,
          role: "MEMBER",
        },
      ],
    });

    console.log("relation:", relation);
  } catch (error) {
    console.log("Error in creating relation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchRel() {
  try {
    const resp = await prisma.user.findUnique({
      where: {
        email: "ravi@gmail.com",
      },
      select: {
        name: true,
        organizations: {
          select: {
            role: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    console.log(JSON.stringify(resp, null, 2));
  } catch (error) {
    console.log("Fetch error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchRel();
