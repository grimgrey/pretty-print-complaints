const _ = require('underscore');
const fs = require('fs');
const puppeteer = require('puppeteer');

const DESTINATION_PATH = '/home/grey/Documents/CSV to HTML';
const CSS_PATH = '/home/grey/Projects/Dev/JavaScript/pretty-print-complaints/lib/table.css';
const REQUIRED_KEYS = ['Exchange', 'Phone No', 'Order Submission Date', 'Order Type', 'BB User ID', 'Customer Name', 'Mobile No'];

const CSS = fs.readFileSync(CSS_PATH);

const thTemplate = (header) => `<th class="column-header">${header}</th>`;

const tableColumns = () => _.map(REQUIRED_KEYS, thTemplate).join('');

const tdTemplate = (data) => `<td>${data}</td>`;

const templateTableRow = (record) => {
  const dataCells = _.map(REQUIRED_KEYS, (key) => tdTemplate(record[key]));
  return `<tr>${dataCells.join('')}</tr>`;
};

const tableRows = (records) => _.map(records, templateTableRow).join('\n');

const templateTableHead = () => `<thead><tr>${tableColumns()}</tr></thead>`;

const templateTableBody = (records) => `<tbody>${tableRows(records)}</tbody>`;

module.exports = {
  create: (records) => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${CSS}</style>
      </head>
      <body>
        <div>
          <table class="pure-table pure-table-bordered">
          ${templateTableHead()}
          ${templateTableBody(records)}
          </table>
        </div>
      </body>
    </html>`;
    fs.writeFileSync(`${DESTINATION_PATH}/records.html`, html);
    return html;
  },

  generatePDF: async (html) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: `${DESTINATION_PATH}/report.pdf`, format: 'A4' });

    await browser.close();
  },
};
