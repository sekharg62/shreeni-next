/** The signed-in shopper, as returned by the auth endpoints. */
export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  /** "+91XXXXXXXXXX" */
  phone: string;
};

/** `POST /auth/register` body. */
export type RegisterPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  /** 10-digit Indian mobile; the API normalises it. */
  phone: string;
  password: string;
};

/** `POST /auth/login` body. */
export type LoginPayload = {
  /** Email address or 10-digit mobile number. */
  identifier: string;
  password: string;
};

/** `POST /auth/register` and `POST /auth/login` response body. */
export type AuthResponse = {
  user: Customer;
  auth_token: string;
};

/** `GET /auth/me` response body. */
export type MeResponse = Customer;
