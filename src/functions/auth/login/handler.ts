import {loginUser} from '../../../infrastructure/cognito';
import express, {Request, Response} from 'express';
import serverless from "serverless-http";

export const app = express();
app.use(express.json());

app.post('/auth/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const result = await loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export const loginHandler = serverless(app);
