const mongoose = require('mongoose');
const Employee = require("../models/new_usermodel");
const { MONGO_URL, PORT } = process.env;

mongoose.connect(MONGO_URL ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await Employee.collection.dropIndex('EmployeeID_1');
      console.log('Index dropped successfully');
    } catch (error) {
      console.error('Error dropping index:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));