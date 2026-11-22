// buisness logic

import {
  findAllUsers,
  countUsers,
  createUser,
} from "../repositories/user.repository";

export async function registerUser(name: string, email: string) {
  return createUser(name, email);
}

export async function getAllUsers(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [users, totalUsers] = await Promise.all([
    findAllUsers(skip, limit),
    countUsers(),
  ]);

  const totalPage = Math.ceil(totalUsers / limit);

  return { users, totalUsers, totalPage };
}
