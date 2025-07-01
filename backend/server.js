import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3030
connectDB();

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.get('/', (req,res)=>(res.send('server ready')));
app.use(notFound);
app.use(errorHandler);



app.listen(port, ()=>{
    console.log(`server started`);
    console.log(`http://localhost:${port}`);
});