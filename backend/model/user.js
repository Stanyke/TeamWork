import Sequelize from 'sequelize';
import client from '../server';


const User = client.define('users',
{
    id: { type: Sequelize.INTEGER, primaryKey: true },
    firstname: { type: Sequelize.STRING },
    lastname: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING, unique: true },
    password: { type: Sequelize.STRING },
    gender: { type: Sequelize.STRING, unique: true },
    jobRole: { type: Sequelize.STRING },
    department: { type: Sequelize.STRING },
    is_admin: { type: Sequelize.STRING },
},
{
    timestamps: false
});
 

export default User;