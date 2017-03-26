/**
 * @author jk
 * @version 1.0.0
 */

import $ from '../helpers';
import Base from './base';

const Bucket = new Base('Bucket', {
  user:               { type: Base.ObjectId(), ref: 'User' },
  secret_key:         { type: String, required: true },
  public_key:         { type: String, required: true },
  bucket_name:        { type: String, required: true },
  bucket_description: { type: String, default: '' },
  createdAt:          { type: Date, default: Date.now}
});

export default Bucket
