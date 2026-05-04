export const TOKEN_KEY = "access_token";

export const ROUTES = {
  ADMIN: "/dashboard_admin",
  ALUMNI: "/dashboard_alumni",
  CALON: "/dashboard_calon",
};

export const ROLE_REDIRECT: Record<string, string> = {
  admin: ROUTES.ADMIN,
  alumni: ROUTES.ALUMNI,
  calon: ROUTES.CALON,
};