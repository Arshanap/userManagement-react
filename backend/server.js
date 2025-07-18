import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
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

if (process.env.NODE_ENV == 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('*', ((req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))))
} else {
    app.get('/', (req,res)=>(res.send('server ready')));
}

app.use(notFound);
app.use(errorHandler);



app.listen(port, ()=>{
    console.log(`server started`);
    console.log(`http://localhost:${port}`);
});