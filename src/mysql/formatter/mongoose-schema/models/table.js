const Column = require('./column');

const utils = require('../../../../shared/utils');

/**
 * Class to represent a table as parsed from compact format.
 */
class Table {

  /**
   * Create Table instance from compact JSON format.
   *
   * @param {any} json Table in compact JSON format.
   * @returns {Table} Built table instance.
   */
  static fromCompactJson(json) {
    const table = new Table();

    table.name = json.name;
    table.columns = json.columns.map(c => Column.fromCompactJson(c));

    if (utils.isDefined(json.primaryKey)) {
      /**
       * Set property in column(s) that is/are primary key(s).
       */
      json.primaryKey.columns
        .map(c => c.column)
        .map(name => table.columns.find(c => c.name === name))
        .filter(column => !!column)
        .forEach(column => {
          column.unique = true;
          column.primary = true;
          column.required = true;
        });
    }

    if (utils.isDefined(json.foreignKeys)) {
      /**
       * Set property in column(s) that is/are foreign key(s).
       */
      json.foreignKeys
        .forEach(foreignKey => {
          foreignKey.columns
            .map(c => c.column)
            .map(name => table.columns.find(c => c.name === name))
            .filter(column => !!column)
            .forEach((column, index) => {
              column.ref = foreignKey.reference.table;
              column.reference = {
                ref: foreignKey.reference.table,
                localField: column.name,
                foreignField: foreignKey.reference.columns[index].column
              };
            });
        });
    }

    if (utils.isDefined(json.indexes)) {
      /**
       * Set property in column(s) that is/are index(es).
       */
      json.indexes
        .forEach(index => {
          index.columns
            .map(c => c.column)
            .map(name => table.columns.find(c => c.name === name))
            .filter(column => !!column)
            .forEach(column => {
              column.index = true;
            });
        });
    }

    const options = json.options;
    if (options) {
      if (utils.isDefined(options.comment)) {
        table.comment = options.comment;
      }
    }

    return table;
  }

  /**
   * Table constructor.
   */
  constructor() {

    /**
     * Table columns.
     * @type {Column[]}
     */
    this.columns = [];

    /**
     * Table name.
     * @type {string}
     */
    this.name = undefined;

    /**
     * Table comment.
     * @type {string}
     */
    this.comment = undefined;
  }

  /**
   * JSON casting of this object calls this method.
   *
   * @returns {any} JSON Schema document.
   */
  toJSON() {
    const json = {
      title: this.name,
    };

    if (utils.isDefined(this.comment)) {
      json.description = this.comment;
    }

    json.columns = {};

    this.columns.forEach(c => {
      json.columns[c.name] = c.toJSON();
    });

    return json;
  }
}

module.exports = Table;
