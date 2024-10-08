import { Roles } from "@/types/globals"
import { auth } from "@clerk/nextjs/server"

export const checkRole = (roles: Roles | Roles[]) => {
  const { sessionClaims } = auth()
  const userRole = sessionClaims?.metadata.role as Roles

  return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
}

export const isOrganizer = () => {
  const { sessionClaims } = auth()
  return sessionClaims?.metadata.role === 'organizer'
}

export const getRole = (): Roles | undefined => {
  const { sessionClaims } = auth()
  return sessionClaims?.metadata.role as Roles
}