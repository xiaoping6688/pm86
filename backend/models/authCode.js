/**
 * @author jk
 * @version 1.0.0
 */

import $ from '../helpers';
import Base from './base';

const authCode = new Base('AuthCode', {
  user:  { type: Base.ObjectId(), ref: 'User' },
  email: { type: String, required: true },
  code:  { type: String, required: true },
  createdAt:  { type: Date, expires: 60 * 30, default: Date.now}
});

export default authCode
