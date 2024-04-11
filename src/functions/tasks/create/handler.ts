import {insertTaskIntoDatabase} from '../../../infrastructure/database';
import config from '../../../../config/database-config';
import express, {Request, Response} from 'express';
import {json} from 'body-parser';

export const app = express();
app.use(json());

app.post('/tasks/create', async (req: Request, res: Response) => {
    const {title, description} = req.body;
    try {
        await insertTaskIntoDatabase({title, description}, config);
        res.status(200).json({message: 'New task created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
