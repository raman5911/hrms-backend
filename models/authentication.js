const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs");
const authentication = new mongoose.Schema({
    Sign_up:{
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    Login:{
        email:{
            type: String,
        },
        password:{
            type: String,
        },
    }
}
})
authentication.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
  });
module.exports = mongoose.model("authentication" , authentication);
