import validate from "../../middlewares/validate.js"
import { NotFoundError } from "../../error.js"
import mw from "../../middlewares/mw.js"
import hashPassword from "../../hashPassword.js"
import {
  idUserValidator,
  firstNameUserValidator,
  lastNameUserValidator,
  emailUserValidator,
  passwordUserValidator,
} from "../../validator/userValidator.js"
import auth from "../../middlewares/auth.js"
import checkPermission from "../../middlewares/permissions.js"

const makeRouteUser = async ({ app, db }) => {
  const checkIfUserExists = async (userId) => {
    const [users] = await db("users").select().where({ id: userId })

    if (users) {
      return users
    }

    throw new NotFoundError("users", userId)
  }

  app.post(
    "/users",
    auth,
    checkPermission("users", "create"),
    validate({
      body: {
        firstName: firstNameUserValidator.required(),
        lastName: lastNameUserValidator.required(),
        email: emailUserValidator.required(),
        password: passwordUserValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { firstName, lastName, email, password, roleId } = req.data.body
      const [passwordHash, passwordSalt] = hashPassword(password)
      const [user] = await db("users")
        .insert({
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
          roleId,
        })
        .returning("*")

      res.send({ result: user })
    })
  )

  app.get(
    "/users",
    auth,
    checkPermission("users", "read"),
    mw(async (req, res) => {
      const users = await db("users")

      res.send({ result: users })
    })
  )
  app.get(
    "/users/:usersId",
    auth,
    checkPermission("users", "read"),
    validate({
      params: { usersId: idUserValidator.required() },
    }),
    mw(async (req, res) => {
      const { usersId } = req.data.params
      const user = await checkIfUserExists(usersId)

      if (!user) {
        return
      }
      res.send({ result: user })
    })
  )

  app.patch(
    "/users/:id",
    auth,
    checkPermission("users", "update"),
    validate({
      params: { id: idUserValidator.required() },
      body: {
        firstName: firstNameUserValidator,
        lastName: lastNameUserValidator,
        email: emailUserValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          body: { firstName, lastName, email, password },
          params: { id },
        },
        session: { user: sessionUser },
      } = req

      if (id !== sessionUser.id) {
        throw new InvalidAccessError()
      }

      const users = await checkIfUserExists(id, res)

      if (!users) {
        return
      }

      const updateUser = await db("users")
        .update({
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
        })
        .where({ id: id })

      console.log(req)
      res.send({ result: updateUser })
    })
  )

  app.delete(
    "/users/:id",
    auth,
    checkPermission("users", "delete"),
    mw(async (req, res) => {
      const users = await checkIfUserExists(req.params.id, res)
      if (!users) {
        return
      }

      await db("users").delete().where({ id: req.params.id })
      res.send({ result: users })
    })
  )
}

export default makeRouteUser
