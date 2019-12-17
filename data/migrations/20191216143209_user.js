exports.up = function(knex) {
  return knex.schema.createTable('user', tbl => {
    tbl.increments()
    tbl.text('username', 20).unique().notNullable()
    tbl.text('password').notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user')
};
