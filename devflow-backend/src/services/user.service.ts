import { findAllUsers } from "../repositories/user.repository";

export function getAllUsers(){
    return findAllUsers();
}