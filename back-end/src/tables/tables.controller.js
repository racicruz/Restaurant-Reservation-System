const service = require("../tables/tables.service");
const hasProperties = require("../utils/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

const REQUIRED_PROPERTIES = ["table_name", "capacity"];

////////////////////////
//MIDDLEWARE FUNCTIONS//
////////////////////////


/**
 * Validates the properties of a table before creating or updating it.
 * Checks that the table_name is at least 2 characters long and the capacity is a number greater than or equal to 1.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise representing the execution of the validation.
 */

async function validateProperties(req, res, next) {
    const {
        data: { table_name, capacity },
    } = res.locals;

    try {

        if (table_name.length < 2) {
            const error = new Error(`'table_name must be at least 2 characters long!`);
            error.status = 400;
            throw error;
        }

        if (typeof capacity !== "number") {
            const error = new Error(`'capacity' must be a number!`);
            error.status = 400;
            throw error;
        }

        if (capacity < 1) {
            const error = new Error(`'capacity' must be at least 1`);
            error.status = 400;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Checks if a table with the specified table_id exists in the database.
 * If the table exists, stores the table data in the "res.locals.table" property.
 * Otherwise, throws a 404 error.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise representing the execution of the check.
 */

async function tableExists(req, res, next) {
    const data = await service.read(req.params.table_id);
    if (data) {
        res.locals.table = data;
        return next();
    }
    return next({
        status: 404,
        message: `${req.params.table_id} not found`
    });
}

/**
 * Checks if a reservation with the specified reservation_id exists in the database.
 * If the reservation exists, stores the reservation data in the "res.locals.reservation" property.
 * Otherwise, throws a 404 error.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A promise representing the execution of the check.
 */

async function reservationExists(req, res, next) {
    const data = await reservationService.read(res.locals.data.reservation_id);
    if (data) {
        res.locals.reservation = data;
        return next();
    }
    return next({
        status: 404,
        message: `${req.body.data.reservation_id} not found`
    });
}

/**
 * Checks if a reservation with the specified reservation_id is already seated.
 * If the reservation is already seated, throws a 400 error.
 * Otherwise, proceeds to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */

async function notSeated(req, res, next) {
    if (res.locals.reservation.status === "seated") {
        return next({
            status: 400,
            message: `${req.body.data.reservation_id} is already seated`
        });
    }
    next();
}

/**
 * Checks if the table has sufficient capacity for the reservation.
 * If the table does not have sufficient capacity, throws a 400 error.
 * Otherwise, proceeds to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */

function capacity(req, res, next) {
    const { people } = res.locals.reservation;
    const { capacity } = res.locals.table;
    if (people > capacity) {
        return next({
            status: 400,
            message: `table does not have sufficient capacity`
        });
    }
    return next();
}

/**
 * Checks if the table is already occupied by a reservation.
 * If the table is occupied, throws a 400 error.
 * Otherwise, proceeds to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */

function occupied(req, res, next) {
    const occupied = res.locals.table.reservation_id;
    if (occupied) {
        return next({
            status: 400,
            message: `table is occupied`
        });
    }
    return next();
}

/**
 * Checks if the table is not occupied by any reservation.
 * If the table is not occupied, throws a 400 error.
 * Otherwise, proceeds to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */

function notOccupied(req, res, next) {
    const occupied = res.locals.table.reservation_id;
    if (!occupied) {
        return next({
            status: 400,
            message: `table is not occupied`
        });
    }
    return next();
}


//////////////////
//ROUTE HANDLERS//
//////////////////


/**
 * Assigns a reservation to a table by updating the reservation's table_id.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise representing the execution of the seat operation.
 */

async function seat(req, res) {
    const { reservation_id } = req.body.data;
    const { table_id } = req.params;
    const data = await service.seat(table_id, reservation_id);
    res.json({
        data,
    });
}

/**
 * Unassigns a reservation from a table by removing the reservation's table_id.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise representing the execution of the unseat operation.
 */

async function unseat(req, res) {
    const { table_id } = req.params;
    const { table } = res.locals;
    const data = await service.unseat(table);
    res.json({
        data,
    });
}

/**
 * Retrieves a list of tables from the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise representing the execution of retrieving the list of tables.
 */

async function list(req, res) {
    const tables = await service.list();
    res.json({
        data: [...tables],
    });
}

/**
 * Creates a new table in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise representing the execution of creating a new table.
 */

async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasProperties(...REQUIRED_PROPERTIES),
        asyncErrorBoundary(validateProperties),
        asyncErrorBoundary(create)
    ],
    seat: [
        hasProperties("reservation_id"),
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(notSeated),
        asyncErrorBoundary(capacity),
        asyncErrorBoundary(occupied),
        asyncErrorBoundary(seat),

    ],
    unseat: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(notOccupied),
        asyncErrorBoundary(unseat),
    ],
}