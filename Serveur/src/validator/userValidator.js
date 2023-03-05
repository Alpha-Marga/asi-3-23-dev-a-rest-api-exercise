import * as yup from "yup"

export const idUserValidator = yup.number().integer().positive()
export const firstNameUserValidator = yup
  .string()
  .matches(/^[\p{L} -]+$/u, "Name is invalid")
export const lastNameUserValidator = yup
  .string()
  .matches(/^[\p{L} -]+$/u, "Name is invalid")
export const emailUserValidator = yup.string().email()
export const roleIdUserValidator = yup.number().integer().positive()
export const passwordUserValidator = yup
  .string()
  .matches(
    /^(?=.*[^\p{L}0-9])(?=.*[0-9])(?=.*\p{Lu})(?=.*\p{Ll}).{8,}$/u,
    "Password must be at least 8 chars & contain at least one of each: lower case, upper case, digit, special char."
  )
