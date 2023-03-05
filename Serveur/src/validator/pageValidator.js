import * as yup from "yup"

export const idPageValidator = yup.number().integer().positive()
export const titlePageValidator = yup.string().trim()
export const contentPageValidator = yup.string().trim()
export const slugPageValidator = yup.string().trim()
export const creatorIdPageValidator = yup.number().integer().positive()

export const modifiedByUsersPageValidator = yup
  .array()
  .of(yup.number().integer().positive())
export const publishedAtPageValidator = yup.date().nullable().default(null)
export const statusPageValidator = yup.string().oneOf(["draft", "published"])
