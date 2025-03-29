const express = require('express');
const dotenv= require('dotenv');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
require('./config/database')

dotenv.config()

const app =  express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT} port`)
})