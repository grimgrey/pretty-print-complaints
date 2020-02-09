const _ = require('underscore');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const REQUIRED_KEYS = ['Exchange', 'Phone No', 'Order Submission Date', 'Order Type', 'BB User ID', 'Customer Name', 'Mobile No'];

const pickRequiredKeys = (record) => _.pick(record, REQUIRED_KEYS);


module.exports = {
  processRecords: (records) => _.map(parse(records, {
    columns: true,
    skip_empty_lines: true,
  }), pickRequiredKeys),

  readCsv: (path) => fs.readFileSync(path, 'utf8'),
};
