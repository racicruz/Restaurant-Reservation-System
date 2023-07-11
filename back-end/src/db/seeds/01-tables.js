//Importing the JSON file containing tables data
const tables = require("./01-tables.json");

/**
 * Seed the "tables" table with data from the specified JSON file.
 * @param {Object} knex - The Knex.js instance for database operations.
 * @returns {Promise} A promise that resolves when the seeding is complete.
 */

//exporting the seed function
exports.seed = function (knex) {
  //console.log("Seeding tables table...");
  //truncate the "tables" table and restart the identity column
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(function () {
      //insert new tables into the "tables" table
      return knex("tables").insert(tables);
    });
};
