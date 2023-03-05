import getPermissions from "../db/model/permissons.js"
import mw from "./mw.js"

const checkPermission = (resource, request) => {
  return mw(async (req, res, next) => {
    try {
      const roleId = 5
      const permission = await getPermissions(roleId, resource, request)

      if (permission) {
        next()
      } else {
        res.status(403).json({
          error: "Vous n'avez pas la permission d'effectuer cette action.",
        })
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({
        error:
          "Une erreur est survenue lors de la vérification des permissions.",
      })
    }
  })
}

export default checkPermission
