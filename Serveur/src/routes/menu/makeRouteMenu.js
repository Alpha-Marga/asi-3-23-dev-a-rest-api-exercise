import validate from "../../middlewares/validate.js"
import { NotFoundError } from "../../error.js"
import mw from "../../middlewares/mw.js"
import {
  idMenuValidator,
  nameMenuValidator,
} from "../../validator/menuValidator"
import auth from "../../middlewares/auth.js"
import checkPermission from "../../middlewares/permissions.js"

const makeRoutemenu = ({ app, db }) => {
  const checkIfmenuExists = async (menuId) => {
    const [menus] = await db("navigation_menus").select().where({ id: menuId })

    if (menus) {
      return menus
    }
  }

  app.post(
    "/menus",
    auth,
    checkPermission("menu", "create"),
    mw(async (req, res) => {
      const { name, pages } = req.data.body

      const [menu] = await db("navigation_menus").insert({
        name,
        pages,
      })

      res.send({ result: menu })
    })
  )

  app.get(
    "/menus",
    auth,
    checkPermission("menu", "read"),
    mw(async (req, res) => {
      const menus = await db("navigation_menus")

      res.send({ result: menus })
    })
  )

  app.get(
    "/menus/:menuId",
    auth,
    checkPermission("menu", "read"),
    validate({
      params: { menuId: idMenuValidator.required() },
    }),
    mw(async (req, res) => {
      const { menuId } = req.data.params
      const menu = await checkIfmenuExists(menuId)

      if (!menu) {
        return
      }

      res.send({ result: menu })
    })
  )

  app.patch(
    "/menus/:id",
    auth,
    checkPermission("menu", "update"),
    mw(async (req, res) => {
      const {
        body: { name, pages },
        params: { id },
      } = req.data

      const menu = await checkIfmenuExists(id, res)

      if (!menu) {
        return
      }

      const updatemenu = await db("navigation_menus")
        .update({
          ...(name ? { name } : {}),
          ...(pages ? { pages } : {}),
        })
        .where({ id: id })

      res.send({ result: updatemenu })
    })
  )

  app.delete(
    "/menus/:id",
    auth,
    checkPermission("menu", "delete"),
    validate({
      params: { id: idMenuValidator.required() },
    }),
    mw(async (req, res) => {
      const { id } = req.data.params
      const [menu] = await db("navigation_menus").select().where({ id })

      if (!menu) {
        throw new NotFoundError("menus", id)
      }

      await db("navigation_menus").delete().where({ id })

      res.send({ result: menu })
    })
  )
}

export default makeRoutemenu
