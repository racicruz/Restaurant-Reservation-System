/**
 * Create the "tables" table in the database.
 *
 * @param {import('knex')} knex - The Knex instance representing the database connection.
 * @returns {Promise} A promise that resolves when the table is created.
 */

exports.up = function(knex) {
    //create new table called "tables"
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary(); //auto incrementing primary key
        table.string("table_name").notNullable(); //string column called "table_name" that cannot be null
        table.integer("capacity").notNullable(); //integer column called "capacity" that cannot be null
        table.integer("reservation_id").unsigned(); // unsigned integer column called "reservation_id"
        //define a foreign key constraint for the "reservation_id" column
        table
            .foreign("reservation_id")
            .references("reservation_id")
            .inTable("reservations")
            .onDelete("cascade");
        
        table.timestamps(true, true); //add "created_at" and "updated_at" timestamp columns
    });
};


/**
 * Drop the "tables" table from the database.
 *
 * @param {import('knex')} knex - The Knex instance representing the database connection.
 * @returns {Promise} A promise that resolves when the table is dropped.
 */

exports.down = function(knex) {
    return knex.schema.dropTable("tables");
};
