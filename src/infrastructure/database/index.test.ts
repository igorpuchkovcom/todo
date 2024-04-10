import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoClient, ObjectId} from 'mongodb';
import {deleteTaskFromDatabase, getAllTasksFromDatabase, insertTaskIntoDatabase, updateTaskInDatabase} from './index';

const title = 'Test Task';
const description = 'This is a test task';
const databaseName = 'test';
const name = 'tasks';

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
        const taskData = {title: title, description: description};
        const config = {databaseName: databaseName, uri: mongoUri};

        await insertTaskIntoDatabase(taskData, config);

        const database = mongoClient.db(config.databaseName);
        const tasksCollection = database.collection(name);
        const insertedTask = await tasksCollection.findOne({title: title});

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
        const taskData = {title: title, description: description};
        const config = {databaseName: databaseName, uri: mongoUri};
        await insertTaskIntoDatabase(taskData, config);

        // Получаем добавленную задачу
        const database = mongoClient.db(config.databaseName);
        const tasksCollection = database.collection(name);
        const insertedTask = await tasksCollection.findOne({title: title});

        // Удаляем задачу по её идентификатору
        await deleteTaskFromDatabase(insertedTask._id.toString(), config);

        // Проверяем, что задача удалена из базы данных
        const deletedTask = await tasksCollection.findOne({_id: new ObjectId(insertedTask._id)});
        expect(deletedTask).toBeNull();
    });
});

describe('getAllTasksFromDatabase', () => {
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

    it('should return all tasks from the database', async () => {
        // Добавляем несколько задач в базу данных для тестирования
        const tasksData = [
            {title: 'Test Task 1', description: 'Description for Test Task 1'},
            {title: 'Test Task 2', description: 'Description for Test Task 2'},
        ];
        const config = {databaseName: databaseName, uri: mongoUri};
        for (const taskData of tasksData) {
            await insertTaskIntoDatabase(taskData, config);
        }

        // Получаем все задачи из базы данных
        const tasks = await getAllTasksFromDatabase(config);

        // Проверяем, что количество полученных задач соответствует количеству добавленных
        expect(tasks.length).toEqual(tasksData.length);

        // Проверяем, что каждая добавленная задача присутствует в полученном списке
        for (const taskData of tasksData) {
            const foundTask = tasks.find(task => task.title === taskData.title && task.description === taskData.description);
            expect(foundTask).toBeTruthy();
        }
    });
});

describe('updateTaskInDatabase', () => {
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

    it('should update task in the database', async () => {
        // Добавляем задачу в базу данных
        const taskData = {title: title, description: description};
        const config = {databaseName: databaseName, uri: mongoUri};
        await insertTaskIntoDatabase(taskData, config);

        // Получаем добавленную задачу
        const database = mongoClient.db(config.databaseName);
        const tasksCollection = database.collection(name);
        const insertedTask = await tasksCollection.findOne({title: title});

        // Обновляем задачу
        const newData = {title: 'Updated Task', description: 'This is an updated task'};
        await updateTaskInDatabase(insertedTask._id.toString(), newData, config);

        // Получаем обновленную задачу из базы данных
        const updatedTask = await tasksCollection.findOne({_id: new ObjectId(insertedTask._id)});

        // Проверяем, что задача обновлена
        expect(updatedTask).toBeTruthy();
        expect(updatedTask.title).toEqual(newData.title);
        expect(updatedTask.description).toEqual(newData.description);
    });
});