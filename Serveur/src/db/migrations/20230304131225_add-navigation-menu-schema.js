export const up = async (knex) => {
  await knex.schema.createTable("navigation_menus", function (table) {
    table.increments("id").primary()
    table.string("name").notNullable()
    table.json("pages").nullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("navigation_menus")
}
