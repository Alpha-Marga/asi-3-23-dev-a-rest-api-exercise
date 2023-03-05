export const up = async (knex) => {
  await knex.schema.alterTable("roles", (table) => {
    table.json("permissions").alter()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("roles", (table) => {
    table.string("permissions").alter()
  })
}
