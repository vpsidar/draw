import express, {Request, Response} from 'express'
import AuthController from './controllers/authController';
const PORT =  process.env.SERVER_PORT ?? 3001;
export default class App {
    private readonly express = express();
    protected registerControllers():this {
        this.express.get('/', (req:Request, res:Response) => {
            res.status(200).json({'message':'Hello from draw backend'});
        })
        //all route to controller mappings
        this.express.use('/auth', new AuthController().registerRoute())
        return this;
    }

    async startExpressServer() {
        //this.express.use() //cors
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended:true}))
        try {
            //db connect here
        } catch (error) {
            console.log('Error occured', error);
        }
        this.registerControllers();
        this.express.listen(PORT, () => {
            console.log(`app listening on port ${PORT}`);
        })
    }
}