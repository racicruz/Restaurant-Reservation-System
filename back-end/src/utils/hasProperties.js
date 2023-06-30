/**
 * Middleware function to check if request body has required properties
 * @param {...string} properties - List of required properties
 * @returns {Function} - Middleware function
 */

function hasProperties(...properties) {
    return function(req, res, next) {
        //extract the data property from the request body
        const { data = {} } = req.body;

        try {
            //iterate over the list of required properties
            properties.forEach(property => {
                //check if the property is missing in the data
                if (!data[property]) {
                    //if the property is missing, throw an error
                    const error = new Error(`A '${property}' property is required`);
                    error.status = 400;
                    throw error;
                }
            });

            //if all the required properties are present, assign the data to res.locals
            res.locals.data = data;

            //call the next middleware function
            next();
        } catch (error) {
            //if an error occured, pass it to the next middleware function
            next(error);
        }
    };
}

module.exports = hasProperties;