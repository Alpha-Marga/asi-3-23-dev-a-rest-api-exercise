import knex from "knex"
import config from "../../config.js"

const db = knex(config.db)

const getPermissions = async (roleId, ressource, request) => {
  const [result] = await db("roles").select("permissions").where({ id: roleId })

  if (result) {
    const permissions = JSON.parse(result.permissions)
    return permissions[ressource][request]
  }
}

export default getPermissions
