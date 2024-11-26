// stores/models/User.js
import { types } from 'mobx-state-tree';

const User = types.model('User', {
    id: types.identifierNumber,
    username: types.string,
    email: types.string,
    is_staff: types.boolean,
    password: types.string,
});

export default User;

