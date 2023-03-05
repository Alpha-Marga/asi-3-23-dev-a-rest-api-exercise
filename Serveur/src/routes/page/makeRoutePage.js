import validate from "../../middlewares/validate.js"
import { NotFoundError } from "../../error.js"
import mw from "../../middlewares/mw.js"
import {
  idPageValidator,
  titlePageValidator,
  contentPageValidator,
  slugPageValidator,
  creatorIdPageValidator,
  modifiedByUsersPageValidator,
  publishedAtPageValidator,
  statusPageValidator,
} from "../../validator/pageValidator.js"
import auth from "../../middlewares/auth.js"
import checkPermission from "../../middlewares/permissions.js"

const makeRoutePage = ({ app, db }) => {
  const checkIfPageExists = async (pageId) => {
    const [pages] = await db("pages").select().where({ id: pageId })

    if (pages) {
      return pages
    }
  }

  app.post(
    "/pages",
    auth,
    checkPermission("pages", "create"),
    validate({
      body: {
        title: titlePageValidator.required(),
        content: contentPageValidator.required(),
        slug: slugPageValidator.required(),
        creator_id: creatorIdPageValidator.required(),
        modified_by_users: modifiedByUsersPageValidator,
        published_at: publishedAtPageValidator,
        status: statusPageValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        title,
        content,
        slug,
        creator_id,
        modified_by_users,
        published_at,
        status,
      } = req.data.body

      const [page] = await db("pages")
        .insert({
          title,
          content,
          slug,
          creator_id,
          modified_by_users,
          published_at,
          status,
        })
        .returning("*")

      res.send({ result: page })
    })
  )

  app.get(
    "/pages",
    auth,
    checkPermission("pages", "read"),
    mw(async (req, res) => {
      const pages = await db("pages")

      res.send({ result: pages })
    })
  )

  app.get(
    "/pages/:pageId",
    auth,
    checkPermission("pages", "read"),
    validate({
      params: { pageId: idPageValidator.required() },
    }),
    mw(async (req, res) => {
      const { pageId } = req.data.params
      const page = await checkIfPageExists(pageId)

      if (!page) {
        return
      }

      res.send({ result: page })
    })
  )

  app.patch(
    "/pages/:id",
    auth,
    checkPermission("pages", "update"),
    validate({
      params: { id: idPageValidator.required() },
      body: {
        title: titlePageValidator,
        content: contentPageValidator,
        slug: slugPageValidator,
        creator_id: creatorIdPageValidator,
        modified_by_users: modifiedByUsersPageValidator,
        published_at: publishedAtPageValidator,
        status: statusPageValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        body: {
          title,
          content,
          slug,
          creator_id,
          modified_by_users,
          published_at,
          status,
        },
        params: { id },
      } = req.data

      const page = await checkIfPageExists(id, res)

      if (!page) {
        return
      }

      const updatePage = await db("pages")
        .update({
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
          ...(slug ? { slug } : {}),
          ...(creator_id ? { creator_id } : {}),
          ...(modified_by_users ? { modified_by_users } : {}),
          ...(published_at ? { published_at } : {}),
          ...(status ? { status } : {}),
        })
        .where({ id: id })

      res.send({ result: updatePage })
    })
  )

  app.delete(
    "/pages/:id",
    auth,
    checkPermission("pages", "delete"),
    validate({
      params: { id: idPageValidator.required() },
    }),
    mw(async (req, res) => {
      const { id } = req.data.params
      const [page] = await db("pages").select().where({ id })

      if (!page) {
        throw new NotFoundError("pages", id)
      }

      await db("pages").delete().where({ id })

      res.send({ result: page })
    })
  )
}

export default makeRoutePage
