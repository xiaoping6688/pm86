/**
 * @author jk
 * @version 1.0.0
 */


import mongoose from 'mongoose';
import $        from '../helpers';

const rules  = [{ path: 'user', select: '' }, { path: '' }];
const select = '';

// baseModel
export default class Base {

  constructor(name, options) {

    const schema = mongoose.Schema(options, {
      versionKey: false,
      toObject:   { virtuals: true },
      toJSON:     { virtuals: true },
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    })

    addVirtual(schema);

    this.schema  = schema;
    this.model   = mongoose.model(name, schema);
  };

  static ObjectId() {
    return mongoose.Schema.ObjectId;
  };

  // try catch methods
  async all(query, start, count) {
    const _count = count || 20;
    const _start = start || 0;
    try {
      return await this.model.find(query)
        .limit(_count).skip(_count * _start)
        .select(select).populate(rules).sort({ createdAt: -1 });
    } catch (e) {
      console.error(e);
    }
  };

  async find(query) {
    try {
      return await this.model.findOne(query)
        .populate(rules);
    } catch (e) {
      console.error(e);
    }
  };

  async create(query) {
    try {
      return await this.model.create(query);
    } catch (e) {
      console.error(e);
    }
  };

  async update(query, info) {
    try {
      return await this.model.update(query, { $set: info })
    } catch (e) {
      console.error(e);
    }
  };

  async delete(query) {
    try {
      return await query.remove();
    } catch (e) {
      console.error(e);
    }
  };

}

//  virtual
function addVirtual (schema) {
  schema.virtual('created_at').get(function (doc) {
    return $.dateformat(this.createdAt);
  });
  schema.virtual('updated_at').get(function () {
    return $.dateformat(this.updatedAt);
  });
  schema.options.toObject.transform = function (doc, ret, options) {
    delete ret.id;
  };
  schema.options.toJSON.transform = function (doc, ret, options) {
    delete ret.id;
  };
}
