//import the database connection
const knex = require('../db/connection');

/**
 * Retrieves a list of reservations for a given date.
 * @param {string} date - The date in string format (YYYY-MM-DD).
 * @returns {Promise<Array>} - A promise that resolves to an array of reservations.
 */

function list(date) {
    return knex("reservations")
        .select()
        .where({ reservation_date: date.toString() })
        .whereNot({ 'reservations.status': 'finished' })
        .whereNot({ 'reservations.status': 'cancelled'})
        .orderBy("reservation_time");
}
  

/**
 * Creates a new reservation.
 * @param {Object} reservation - The reservation object containing reservation details.
 * @returns {Promise<Object>} - A promise that resolves to the created reservation object.
 */  

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then(createdRecords => createdRecords[0]);
}

/**
*  Retrieves a reservation from the database based on the given reservation ID.
* @param {number} reservation_id - The ID of the reservation to retrieve.
* @returns {Promise<Object|null>} A promise that resolves to the retrieved reservation object, or null if not found.
*/

function read(reservation_id) {
    return knex("reservations")
        .select()
        .where({ reservation_id })
        .first();
}

/**
 * Updates the status of a reservation in the database.
 *
 * @param {number} reservation_id - The ID of the reservation to be updated.
 * @param {object} data - The updated data, including the new status.
 * @param {string} data.status - The new status of the reservation.
 * @returns {Promise<object>} - A Promise that resolves to the updated reservation object.
 */

function updateStatus(reservation_id, data) {
    const { status } = data;
    return knex("reservations")
        .select()
        .where({ reservation_id })
        .update({ status })
        .returning('*')
        .then((reservatioData) => reservatioData[0]);
}

module.exports = {
    list,
    create,
    read,
    updateStatus,
}