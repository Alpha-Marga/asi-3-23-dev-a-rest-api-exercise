export const up = async (knex) => {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.json("permissions").notNullable()
  })

  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary()
    table
      .integer("roleId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("roles")
    table.string("email").notNullable().unique()
    table.string("firstName").notNullable()
    table.string("lastName").notNullable()
    table.text("passwordHash")
    table.text("passwordSalt")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("roles")
  await knex.schema.dropTable("users")
}
