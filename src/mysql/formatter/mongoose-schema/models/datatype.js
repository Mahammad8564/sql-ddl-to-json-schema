/**
 * Data type.
 */
class Datatype {

  /**
   * Create Datatype instance from compact JSON format.
   *
   * @param {any} json Datatype in compact JSON format.
   * @returns {Datatype} Built datatype instance.
   */
  static fromCompactJson(json) {
    const datatype = new Datatype();

    Object.getOwnPropertyNames(json)
      .map(k => [k, json[k]])
      .forEach(([k, v]) => { datatype[k] = v; });

    return datatype;
  }

  /**
   * Get standardized name for datatype, according to parsed compact JSON type.
   *
   * @param {string} type Datatype parsed from compact JSON format.
   * @returns {string} Standardized JSON Schema type.
   */
  static filterDatatype(type) {

    /**
     * Filters: int, integer, tinyint, smallint, mediumint, bigint
     */
    if (type === 'int')                { return Number; }

    /**
     * Filters: decimal, numeric, float, double
     */
    if (type === 'decimal')            { return Number; }
    if (type === 'float')              { return Number; }
    if (type === 'double')             { return Number; }

    /**
     * Filters: bool, boolean
     */
    if (type === 'boolean')            { return Boolean; }

    if (type === 'date')               { return Date; }
    if (type === 'time')               { return Date; }
    if (type === 'datetime')           { return Date; }


    /**
     * Everything else is a string.
     */
    return String;
  }

  /**
   * Datatype constructor.
   */
  constructor() {

    /**
     * Datatype name.
     * @type {string}
     */
    this.datatype = undefined;

    /**
     * Width (in bytes) for integer types.
     * @type {number}
     */
    this.width = undefined;

    /**
     * Length of year type or length of a number
     * including decimals (for numeric types).
     *
     * @type {number}
     */
    this.digits = undefined;

    /**
     * Length of decimal portion of a number (for numeric types).
     * @type {number}
     */
    this.decimals = undefined;

    /**
     * Length property for bit, textual and blob types.
     * @type {number}
     */
    this.length = undefined;

    /**
     * Fractional length for date types.
     * @type {number}
     */
    this.fractional = undefined;

    /**
     * Possible values for enum and set.
     * @type {string[]}
     */
    this.values = undefined;

    /**
     * Whether datatype is unsigned.
     * @type {boolean}
     */
    this.isUnsigned = undefined;
  }

  /**
   * JSON casting of this object calls this method.
   * Perform some special formattings
   * according to the datatype.
   *
   * No special operations are needed with datatypes:
   * - double (rules depends on hardware)
   * - bit (string with no limitations)
   * - boolean (simple boolean)
   * - timestamp (simple integer)
   * - blob (lengths are ignored)
   * - geometry (too complex for JSON Schema)
   * - point (too complex for JSON Schema)
   * - linestring (too complex for JSON Schema)
   * - polygon (too complex for JSON Schema)
   * - multipoint (too complex for JSON Schema)
   * - multilinestring (too complex for JSON Schema)
   * - multipolygon (too complex for JSON Schema)
   * - geometrycollection (too complex for JSON Schema)
   * - json (too complex for JSON Schema)
   *
   * @returns {any} JSON format.
   */
  toJSON() {
    const json = {
      type: Datatype.filterDatatype(this.datatype),
    };

    /**
     * Set min and max for int.
     */
    if (this.datatype === 'int') {
      const width = Math.pow(2, 8 * this.width);
      if (this.isUnsigned) {
        json.min = 0;
        json.max = width;
      } else {
        json.min = 0 - (width / 2);
        json.max = 0 - json.min - 1;
      }

    /**
     * Set min and max for decimal and float.
     *
     * According to mySQL and MariaDB documentation, min and max
     * of double datatype depend on hardware so they are not added here.
     */
    } else if (this.datatype === 'decimal' || this.datatype === 'float') {
      if (this.isUnsigned) {
        json.min = 0;
      } else {
        json.min = 0 - (Number(
          '9'.repeat(this.digits - this.decimals) + '.' + '9'.repeat(this.decimals)
        ));
      }
      json.max = 0 - json.min;

    /**
     * Use JSON Schema date format.
     */
    } else if (this.datatype === 'date') {
      json.format = 'date';

    /**
     * Use JSON Schema time format.
     */
    } else if (this.datatype === 'time') {
      json.format = 'time';

    /**
     * Use JSON Schema date-time format.
     */
    } else if (this.datatype === 'datetime') {
      json.format = 'date-time';

    /**
     * Validate according to number of digits.
     */
    } else if (this.datatype === 'year') {
      json.pattern = `\\d{1,${this.digits}}`;

    /**
     * Set maxlength to length of the text.
     */
    } else if (
      this.datatype === 'char' ||
      this.datatype === 'binary' ||
      this.datatype === 'varchar' ||
      this.datatype === 'varbinary' ||
      this.datatype === 'text'
    ) {
      json.maxlength = this.length;

    /**
     * Use enum values validation.
     */
    } else if (this.datatype === 'enum') {
      json.enum = this.values;

    /**
     * Use pattern validation for set datatype.
     */
    } else if (this.datatype === 'set') {
      const options = this.values.join('|');
      json.pattern = `^(${options})(,(${options}))*$`;
    }

    return json;
  }
}

module.exports = Datatype;
