import "@babel/polyfill";

import { Router } from 'express';

import
{ 
    createUser, getUser, getUsers, deleteUser, updateUsers
} from '../controllers/UserC';

const router = Router();

router.post('/getUsers', getUsers);
router.post('/getUser', getUser);
router.post('/create-user', createUser);
router.delete('/removeUser', deleteUser);
router.put('/updateUser', updateUsers);

export default router;