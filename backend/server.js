import express from 'express';
import dotenv from 'dotenv';
import color from 'colors';

import appSecMiddleware from './config/securityMiddleware.js';
import userRouter from './routes/user.routes.js'
import chatRouter from './routes/chat.routes.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

import connectToTB from './config/db.js';



dotenv.config();
connectToTB();
const PORT = process.env.PORT || 4000;

const app = express();


// Handling cors & other issues
appSecMiddleware(app);

app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)


app.use(notFound);
// app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`app is up and running at port ${PORT}`.yellow.bold);
})