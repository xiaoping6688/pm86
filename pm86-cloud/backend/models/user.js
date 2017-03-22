/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../helpers';
import Base from './base';

const User = new Base('User', {
  email:     { type: String, required: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now},
  meta:      {},
});

export default User
