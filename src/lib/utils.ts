import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// const user = await currentUser();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export async function getSignedInStatus() {
//   if (user) {
//     return true;
//   } else return false;
// }

// export async function getAdminStatus() {
//   const adminId = user?.publicMetadata?.adminId;
//   if (adminId) {
//     return true;
//   } else return false;
// }
