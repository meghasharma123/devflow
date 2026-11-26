import prisma from "../config/prisma";

export async function findOrgFromId(id: string) {
  return prisma.organization.findUnique({
    where: { id },
  });
}

export async function updateOrg(id: string, name: string) {
  return prisma.organization.update({
    where: { id },
    data: { name },
  });
}
