//Importing the JSON file containing reservation data
const reservations = require("./00-reservations.json");

/**
 * Seed the reservations table with data from the specified JSON file.
 * @param {Object} knex - The Knex.js instance for database operations.
 * @returns {Promise} A promise that resolves when the seeding is complete.
 */

//exporting the seed function
exports.seed = function (knex) {
  console.log("Seeding reservations table...");
  //truncate the "reservations" table and restart the identity column
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      //insert new reservations into the "reservations table"
      return knex("reservations").insert(reservations);
    });
};
