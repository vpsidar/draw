import express, { Request,Response } from 'express';
const app = express();
app.listen(3001)
app.get('/', (req:Request, res:Response) => {
    res.json('Hello from http server')
})