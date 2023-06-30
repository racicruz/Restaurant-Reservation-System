/**
 * Creates the reservations table.
 * @param {import('knex')} knex - The Knex instance.
 * @returns {Promise} A promise representing the completion of the operation.
 */

exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary(); //auto-incrementing primary key
    table.string("first_name"); //first name column
    table.string("last_name"); //last name column
    table.string("mobile_number"); //mobile number column
    table.date("reservation_date"); //reservation date column
    table.string("reservation_time"); //reservation time column
    table.integer("people"); //number of people column
    table.timestamps(true, true); //created at and updated at columns
  });
};

/**
 * Drops the reservations table.
 * @param {import('knex')} knex - The Knex instance.
 * @returns {Promise} A promise representing the completion of the operation.
 */

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
