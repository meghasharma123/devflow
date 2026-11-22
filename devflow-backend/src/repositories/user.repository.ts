// database operations

import prisma from "../config/prisma";

export function createUser(name: string, email: string) {
  return prisma.user.create({ data: { name, email } });
}

export function findAllUsers(skip: number, limit: number) {
  return prisma.user.findMany({ skip, take: limit });
}

export function countUsers() {
  return prisma.user.count();
}
