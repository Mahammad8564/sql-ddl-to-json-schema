const Datatype = require('./datatype');

const utils = require('../../../../shared/utils');

/**
 * Table column.
 */
class Column {

  /**
   * Create Column instance from compact JSON format.
   *
   * @param {any} json Column in compact JSON format.
   * @returns {Column} Built column instance.
   */
  static fromCompactJson(json) {
    const column = new Column();

    column.name = json.name;
    column.datatype = Datatype.fromCompactJson(json.type);

    const options = json.options;

    if (options) {
      if (options.unsigned) {
        column.datatype.isUnsigned = options.unsigned;
      }

      if (options.default === null || utils.isString(options.default) && options.default.length) {
        column.default = options.default;
      }

      if (utils.isString(options.comment) && options.comment.length) {
        column.comment = options.comment;
      }

      column.required = options.nullable;
      column.autoincrement = options.autoincrement;
    }

    return column;
  }

  /**
   * Column constructor.
   */
  constructor() {

    /**
     * Column name.
     * @type {string}
     */
    this.name = undefined;

    /**
     * Column data type.
     * @type {Datatype}
     */
    this.datatype = undefined;

    /**
     * Whether column is nullable.
     * @type {boolean}
     */
    this.required = undefined;

    /**
     * Whether column is primary key.
     * @type {boolean}
     */
    this.ref = undefined;
    this.index = undefined;
    this.unique = undefined;
    this.primary = undefined;
    
    /**
     * Column comment.
     * @type {string}
     */
    this.comment = undefined;

    /**
     * Column default value.
     * @type {boolean|string|number}
     */
    this.default = undefined;

    this.reference = undefined;
    this.autoincrement = undefined;
  }

  /**
   * JSON casting of this object calls this method.
   *
   * @returns {any} JSON format.
   */
  toJSON() {
    const json = {};
    const type = this.datatype.toJSON();

    Object.getOwnPropertyNames(type)
      .map(k => [k, type[k]])
      .filter(([, v]) => {
        return utils.isNumber(v) ? isFinite(v) : true;
      })
      .forEach(([k, v]) => { json[k] = v; });

    if (utils.isDefined(this.default)) { json.default = this.default; }
    if (utils.isDefined(this.comment)) { json.description = this.comment; }
    if (utils.isDefined(this.unique)) { json.unique = this.unique; }
    if (utils.isDefined(this.primary)) { json.primary = this.primary; }
    if (utils.isDefined(this.ref)) { json.ref = this.ref; }
    if (utils.isDefined(this.index)) { json.index = this.index; }
    if (utils.isDefined(this.required)) { json.required = this.required; }
    if (utils.isDefined(this.reference)) { json.reference = this.reference; }
    if (utils.isDefined(this.autoincrement)) { json.autoincrement = this.autoincrement; }
   
    return json;
  }
}

module.exports = Column;
