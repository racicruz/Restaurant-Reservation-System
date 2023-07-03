const service = require("../reservations/reservations.service");
const hasProperties = require("../utils/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

/**
 * Validates the properties of a reservation request.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Next function to pass control to the next middleware.
 * @returns {void}
 */

async function validateProperties(req, res, next) {
  // Extract the required properties from res.locals
  const {
    data: { reservation_date, reservation_time, people },
  } = res.locals;
  try {

    // Validate reservation_date format
    if(!validateDate(reservation_date)) {
      const error = new Error(
        `'${reservation_date}' is invalid 'reservation_date' format. Use YYY-MM-DD`
      );
      error.status = 400;
      throw error;
    }

    // Validate reservation_time format
    if(!validateTime(reservation_time)) {
      const error = new Error(
        `'${reservation_time}' is invalid 'reservation_time' format. Use HH:MM:SS`
      );
      error.status = 400;
      throw error;
    }

    // Validate people is a number
    if(typeof people !== "number") {
      const error = new Error(`people must be a number`);
      error.status = 400;
      throw error;
    }

    // Validate people is at least 1
    if (people < 1) {
      const error = new Error(`people must be at least 1`);
      error.status = 400;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}


/**
 * Validates the format of a date.
 * @param {string} date - The date in string format (YYYY-MM-DD).
 * @returns {boolean} - Returns true if the date is in a valid format, otherwise false.
 */

function validateDate(date) {
  let date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  return date_regex.test(date);
}

/**
 * Validates the reservation date and time.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Next function to pass control to the next middleware.
 * @returns {void}
 */

function validateTime(time) {
  let time_regex = /^(2[0-3]|[01][0-9]):[0-5][0-9]$/;
  return time_regex.test(time);
}

/**
 * Validates the reservation date.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Next function to pass control to the next middleware.
 * @returns {void}
 */

function validateReservationDate(req, res, next) {
  const {
    data: { reservation_date, reservation_time },
  } = res.locals;

  const reservationDate = new Date(
    `${reservation_date}T${reservation_time}:00`
  );

  try {
    if (Date.now() > Date.parse(reservationDate)) {
      const error = new Error(`Reservation must be for a future date or time.`);
      error.status = 400;
      throw error;
    }
    if (reservationDate.getDay() == 2) {
      const error = new Error(`Periodic Tables is closed on Tuesdays. Sorry!`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves a list of reservations for a given time.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */

function validateReservationTime(req, res, next) {
  const {
    data: { reservation_time },
  } = res.locals;

  const [hours, minutes] = reservation_time.split(":");

  try {
    if ((hours <= 10 && minutes < 30) || hours <= 9) {
      const error = new Error(`Periodic Tables opens at 10:30 AM.`);
      error.status = 400;
      throw error;
    }
    if ((hours >= 21 && minutes > 30) || hours >= 22) {
      const error = new Error(
        `Periodic Tables stops accepting reservations at 9:30 PM.`
      );
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

/**
* Checks if a reservation exists.
* @param {Request} req - Express request object.
* @param {Response} res - Express response object.
* @param {NextFunction} next - Next function to pass control to the next middleware.
* @returns {void}
*/

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation was not found : ${req.params.reservation_id}`,
  });
}

/**
* Retrieves a list of reservations for a given date.
* @param {Request} req - Express request object.
* @param {Response} res - Express response object.
* @returns {Promise<void>} - A promise that resolves when the response is sent.
*/

async function list(req, res) {
  const today = new Date().toLocaleDateString().replaceAll("/", "-");
  const { date = today } = req.query;
  let reservations;
  if (date) {
    reservations = await service.list(date);
  }
  res.json({
    data: [...reservations],
  });
}

/**
 * Creates a new reservation.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */

async function create(req, res) {
  const data = await service.create(res.locals.data);
  res.status(201).json({ data });
}

/**
* Retrieves a single reservation by reservation_id.
* @param {Request} req - Express request object.
* @param {Response} res - Express response object.
* @returns {Promise<void>} - A promise that resolves when the response is sent.
*/

async function read(req, res) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  res.json({
    data,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties(...REQUIRED_PROPERTIES),
    asyncErrorBoundary(validateProperties),
    validateReservationDate,
    validateReservationTime,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ]
};