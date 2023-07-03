//import the database connection
const knex = require('../db/connection');


/**
 * Retrieves a list of tables from the database.
 * @param {string} date - Optional date parameter for filtering tables.
 * @returns {Promise<Array>} A promise that resolves to an array of tables.
 */

function list(date) {
    return knex("tables")
        .select()
        .orderBy("table_name");
}

/**
 * Creates a new table in the database.
 * @param {Object} newTable - The new table object to be created.
 * @returns {Promise<Object>} A promise that resolves to the created table.
 */

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then(tableData => tableData[0]);
}

/**
 * Retrieves a specific table from the database.
 * @param {number} table_id - The ID of the table to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the retrieved table.
 */

function read(table_id) {
    return knex("tables")
        .select()
        .where({ table_id })
        .first();
}

/**
 * Assigns a reservation to a table and updates the reservation status to 'seated'.
 * @param {number} table_id - The ID of the table to seat the reservation.
 * @param {number} reservation_id - The ID of the reservation to be seated.
 * @returns {Promise<Object>} A promise that resolves to the updated table or reservation.
 */

function seat(table_id, reservation_id) {
    return knex.transaction(function (trx) {
        return trx("tables")
            .where({ table_id })
            .update({ reservation_id })
            .returning("*")
            .then(() => {
                return trx("reservations")
                    .where({ reservation_id })
                    .update({ status: 'seated' })
                    .returning("*")
                    .then((updatedResponse) => updatedResponse[0]);
            });
    });
}

/**
 * Removes a reservation from a table and updates the reservation status to 'finished'.
 * @param {Object} params - Object containing the table_id and reservation_id.
 * @returns {Promise<Object>} A promise that resolves to the updated table or reservation.
 */

function unseat({ table_id, reservation_id }) {
    return knex.transaction(function (trx) {
        return trx("tables")
            .where({ table_id })
            .update({ reservation_id: null })
            .returning("*")
            .then(() => {
                return trx("reservations")
                    .where({ reservation_id })
                    .update({ status: 'finished'})
                    .returning("*")
                    .then((tableData) => tableData[0]);
            });
    });
}

module.exports = {
    list,
    create,
    read,
    seat,
    unseat,
}