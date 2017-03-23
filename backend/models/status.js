/**
 * @author jk
 * @version 1.0.0
 */

import $ from '../helpers';
import Base from './base';

const Status = new Base('Status', {
  public_key: { type: String, required: true },
  sent_at:    { type: Date, required: true },
  createdAt:  { type: Date, expires: 3600 * 24 * 7, default: Date.now},
  type:       String,
  data:       {},
  meta:       {},
});

export default Status
