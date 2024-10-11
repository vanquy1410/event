"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData: FormData) {
  // Check that the user trying to set the role is an admin or employee
  if (!checkRole(["admin", "organizer"])) {
    throw new Error("Not Authorized");
  }

  try {
    await clerkClient.users.updateUser(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      }
    );
  } catch (err) {
    console.error("Error updating user role:", err);
    throw new Error("Failed to update user role");
  }
}