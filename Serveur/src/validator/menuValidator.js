import * as yup from "yup"

export const idMenuValidator = yup.number().integer().positive()
export const nameMenuValidator = yup.string().trim()
