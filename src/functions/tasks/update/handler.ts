import {updateTaskInDatabase} from '../../../infrastructure/database';
import config from '../../../../config/database-config';
import express, {json, Request, Response} from 'express';

export const app = express();
app.use(json());

app.put('/tasks/update/:id', async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const {title, description} = req.body;
    try {
        await updateTaskInDatabase(taskId, {title, description}, config);
        res.status(200).json({message: 'Task updated successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
