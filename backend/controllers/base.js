/**
 * @author jk
 * @version 1.0.0
 */
import $ from '../helpers';

export default class Base {
  constructor(options) {
    this.model   = options.model || {};
    this.methods = addMethods(this);
  }
}


function addMethods(_this) {
  let methods = {};
  methods.find = async function(req, res, next) {
    $.result(res, await _this.model.findById(req.params.id));
  }

  methods.all = async function(req, res, next) {
    $.result(res, await _this.model.all({}, req.query.start));
  }

  methods.create = async function(req, res, next) {
    let exist = await _this.model.find({email: req.body.email});
    if ($.empty(exist)) {
      return $.result(res, await _this.model.create(req.body));
    }
    $.debug(exist);
    $.result(res, 'already existing');
  }

  methods.update = async function(req, res, next) {
    let documents = await _this.model.update({
      "_id": req.params.id
    }, req.body)
    if (documents === -1) $.result(res, 'update failed');
    else $.result(res, documents);
  }

  methods.delete = async function(req, res, next) {
    let documents = await _this.model.delete({
      "_id": req.params.id
    })
    if (documents === -1) $.result(res, 'delete failed');
    else $.result(res, documents);
  }

  return methods;
}
