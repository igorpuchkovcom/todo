const serverless = require('serverless-http');
import express, {Request, Response} from 'express';
import {confirmUser} from '../../../infrastructure/cognito';

export const app = express();
app.use(express.json());

app.post('/auth/confirm', async (req: Request, res: Response) => {
    try {
        const {code, username} = req.body;

        // Confirming user in Cognito
        const result = await confirmUser(code, username);

        // Returning successful response
        res.status(200).json(result);
    } catch (error) {
        // Handling confirmation error
        res.status(500).json({error: error.message});
    }
});

export const confirmHandler = serverless(app);
