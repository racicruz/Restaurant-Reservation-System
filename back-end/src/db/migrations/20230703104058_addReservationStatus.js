/**
 * Modifies the reservations table by adding a new column named "status".
 * The new column is of type string, is not nullable, and has a default value of "booked".
 *
 * @param {import('knex')} knex - The Knex instance for database operations.
 * @returns {Promise} A promise representing the execution of the migration.
 */

exports.up = function(knex) {
    return knex.schema.table("reservations", (table) => {
        table.string("status").notNullable().defaultTo("booked");
    });
};

/**
 * Reverts the modifications made in the up function.
 * Drops the "status" column from the reservations table.
 *
 * @param {import('knex')} knex - The Knex instance for database operations.
 * @returns {Promise} A promise representing the execution of the migration rollback.
 */

exports.down = function(knex) {
    return knex.schema.table("reservations", (table) => {
        table.dropColumn("status");
    });
};
