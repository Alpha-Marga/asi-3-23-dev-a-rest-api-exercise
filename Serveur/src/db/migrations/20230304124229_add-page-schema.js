export const up = async (knex) => {
  await knex.schema.createTable("pages", function (table) {
    table.increments("id").primary()
    table.string("title").notNullable()
    table.text("content").nullable()
    table.string("slug").notNullable().unique()
    table
      .integer("creator_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users")
    table.json("modified_by_users").nullable()
    table.dateTime("published_at").nullable()
    table.enum("status", ["draft", "published"])
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("pages")
}
