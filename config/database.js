const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/slot-booking')
.then(() =>{
    console.log('Database is connected');
}).catch(()=>{
    console.log('There is some error while connecting with database');
})

module.exports = mongoose;