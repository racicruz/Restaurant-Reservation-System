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

module.exports = {
    list,
    create,
}