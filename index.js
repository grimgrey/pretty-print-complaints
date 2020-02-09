const chalk = require('chalk');
const CLI = require('clui');
const clear = require('clear');
const doc = require('./lib/document');
const parser = require('./lib/parser');

const FILE_PATH = '/home/grey/Documents/pending_orders.csv';
const { Spinner } = CLI;

clear();


const run = async () => {
  const status = new Spinner('Generating Report');
  status.start();
  try {
    const records = parser.readCsv(FILE_PATH);

    if (records.length) {
      const html = doc.create(parser.processRecords(records));
      await doc.generatePDF(html);
    } else {
      throw new Error('There are no Pending Orders!');
    }
  } catch (error) {
    console.log(chalk.red(error));
  } finally {
    status.stop();
  }
};

run();
