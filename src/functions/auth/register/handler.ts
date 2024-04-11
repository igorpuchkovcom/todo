import {registerUser} from '../../../infrastructure/cognito';
import express, {Request, Response} from 'express';
import {json} from 'body-parser';

export const app = express();
app.use(json());

app.post('/auth/register', async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    try {
        const result = await registerUser(username, email, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
