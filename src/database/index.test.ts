import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';
import { insertTaskIntoDatabase, deleteTaskFromDatabase } from './index';

describe('insertTaskIntoDatabase', () => {
    let mongoServer: MongoMemoryServer;
    let mongoClient: MongoClient;
    let mongoUri: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
    });

    afterAll(async () => {
        await mongoClient.close();
        await mongoServer.stop();
    });

    it('should insert task into the database', async () => {
        const taskData = { title: 'Test Task', description: 'This is a test task' };
        const config = { databaseName: 'test', uri: mongoUri };

        await insertTaskIntoDatabase(taskData, config);

        const database = mongoClient.db(config.databaseName);
        const tasksCollection = database.collection('tasks');
        const insertedTask = await tasksCollection.findOne({ title: 'Test Task' });

        expect(insertedTask).toBeTruthy();
        expect(insertedTask.title).toEqual(taskData.title);
        expect(insertedTask.description).toEqual(taskData.description);
    });
});

describe('deleteTaskFromDatabase', () => {
    let mongoServer: MongoMemoryServer;
    let mongoClient: MongoClient;
    let mongoUri: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
    });

    afterAll(async () => {
        await mongoClient.close();
        await mongoServer.stop();
    });

    it('should delete task from the database', async () => {
        // Добавляем задачу в базу данных
        const taskData = { title: 'Test Task', description: 'This is a test task' };
        const config = { databaseName: 'test', uri: mongoUri };
        await insertTaskIntoDatabase(taskData, config);

        // Получаем добавленную задачу
        const database = mongoClient.db(config.databaseName);
        const tasksCollection = database.collection('tasks');
        const insertedTask = await tasksCollection.findOne({ title: 'Test Task' });

        // Удаляем задачу по её идентификатору
        await deleteTaskFromDatabase(insertedTask._id.toString(), config);

        // Проверяем, что задача удалена из базы данных
        const deletedTask = await tasksCollection.findOne({ _id: new ObjectId(insertedTask._id) });
        expect(deletedTask).toBeNull();
    });
});