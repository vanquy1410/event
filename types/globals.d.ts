export { };

// Create a type for the roles
export type Roles = "admin" | "moderator" | "employee";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    };
  }
}