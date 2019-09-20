export interface JwtResponseI {
  dataUser: {
    id: string,
    name: string,
    email: string,
    accessToken: string,
    expiresIn: string
  }
}
