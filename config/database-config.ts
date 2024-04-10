import { DatabaseConfig } from '../src/interfaces/database';

const config: DatabaseConfig = {
    databaseName: 'todo',
    uri: 'mongodb://' + process.env.DocumentDBHost
};

export default config;