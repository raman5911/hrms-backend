// contains functions to execute basic mongo queries - Raman, 24/07/24

const mongoose = require('mongoose');

/**
 * checks if the model_name passed is a valid Mongoose model or not and return true or false.
 *
 * @param {mongoose.model} model_name - Pass the mongoose model of collection.
 * @returns {boolean} true or false.
 */
const isSchemaValidOrNot = (model_name) => {
    // checking if model_name paramter is empty or not
    if (!model_name) {
        throw new Error("model_name is missing in function parameters while calling");
    }

    return model_name.modelName !== undefined;   // returns true if model is valid
}


/**
 * fetch all the documents from the database.
 *
 * @param {mongoose.Model} model_name - Import the mongoose model of collection whose data you want and pass it in parameter while calling function.
 * @returns {Array} data (in json format) - result fetched from query.
 */
module.exports.getAll = async (model_name) => {
    // checking if model is a valid mongoose schema or not
    if (!isSchemaValidOrNot(model_name)) {
        throw new Error("model_name passed is invalid, not a proper mongoose schema");
    }

    else {
        try {
            const data = await model_name.find({});
            return data;
        } catch (err) {
            throw new Error(err);
        }
    }
}

/**
 * fetch a particular employee details from the database.
 *
 * @param {mongoose.Model} model_name - Import the mongoose model of collection whose data you want and pass it in parameter while calling function.
 * @param {string} employee_id - Pass the employee_id of record whose data you want to fetch
 * @returns {object} data - result fetched from query.
 */
module.exports.getByEmployeeId = async (model_name, employee_id) => {
    // checking if model is a valid mongoose schema or not
    if (!isSchemaValidOrNot(model_name)) {
        throw new Error("model_name passed is invalid, not a proper mongoose schema");
    }

    // checking if employee id is empty or not
    else if (!employee_id) {
        throw new Error("Employee id is not passed in parameters while calling function");
    }

    else if (typeof employee_id !== 'string') {
        throw new Error("Invalid Employee Id. Employee Id should be of type string.");
    }

    else {
        try {
            const data = await model_name.find({ Employee_Id: employee_id });
            return data;
        } catch (err) {
            throw new Error(err);
        }
    }
}

/**
 * fetch a particular record from the database using a key. Note - Nested query is not supported.
 *
 * @param {mongoose.Model} model_name - Import the mongoose model of collection whose data you want and pass it in parameter while calling function.
 * @param {string} key_name - Pass the key name on the basis of which you will search a record.
 * @param {any} key_value - Pass the key value for the key.
 * @returns {Array} data (in json format) - result fetched from query.
 */
module.exports.searchWithKey = async (model_name, key_name, key_value) => {
    // checking if model is a valid mongoose schema or not
    if (!isSchemaValidOrNot(model_name)) {
        throw new Error("model_name passed is invalid, not a proper mongoose schema");
    }

    // check if key_name is of type string or not
    else if (typeof key_name !== 'string') {
        throw new Error("Invalid key_name. key_name should be of type string.");
    }

    // checking if key_name is missing or not
    else if (!key_name) {
        throw new Error("key_name is not passed in parameters while calling function");
    }

    // checking if key_value is missing or not
    else if (!key_value) {
        throw new Error("key_value is not passed in parameters while calling function");
    }

    else {
        try {
            // Create a query object with the key_name as the dynamic key
            const query = { [key_name]: key_value };
            const data = await model_name.find(query);
            return data;
        } catch (err) {
            throw new Error(err);
        }
    }
}

/**
 * Creates a new document in the database.
 *
 * @param {mongoose.Model} model_name - Import the mongoose model of collection whose data you want and pass it in parameter while calling function.
 * @param {object} input data - Pass the input data of the record.
 * @returns {Array} data (in json format) - result fetched from query.
 */
module.exports.createNewRecord = async (model_name, input_data) => {
    // checking if model is a valid mongoose schema or not
    if (!isSchemaValidOrNot(model_name)) {
        throw new Error("model_name passed is invalid, not a proper mongoose schema");
    }

    else if (typeof input_data !== 'object') {
        throw new Error("Invalid input data. Data passed should be an object.")
    }

    else {
        try {
            console.log(input_data);
            const data = await model_name.create(input_data);
            return data;
        } catch (err) {
            throw new Error(err);
        }
    }
}

/**
 * Updates a document in the database.
 *
 * @param {mongoose.Model} model_name - Import the mongoose model of collection whose data you want and pass it in parameter while calling function.
 * @param {object} input data - Pass the input data of the record.
 * @returns {Array} data (in json format) - result fetched from query.
 */
module.exports.updateRecord = async (model_name, query, new_value) => {
    // checking if model is a valid mongoose schema or not
    if (!isSchemaValidOrNot(model_name)) {
        throw new Error("model_name passed is invalid, not a proper mongoose schema");
    }

    else if ( typeof new_value !== 'object') {
        throw new Error("Invalid input data. Data passed should be an object.")
    }

    else if (typeof query !== 'object') {
        throw new Error("Invalid search query. Query passed should be an object.")
    }

    else {
        try {
            const updated_document = await model_name.findOneAndUpdate(query, new_value);
            return updated_document;
        } catch (err) {
            throw new Error(err);
        }
    }
}