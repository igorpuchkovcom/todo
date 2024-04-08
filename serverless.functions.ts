import register from '@functions/auth/register';
import login from '@functions/auth/login';
import createTask from '@functions/tasks/create';
import deleteTask from '@functions/tasks/delete';
import getTasks from '@functions/tasks/get';
import updateTask from '@functions/tasks/update';

export default {
    register,
    login,
    createTask,
    deleteTask,
    getTasks,
    updateTask,
};
