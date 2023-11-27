/** INCASE IF YOU WANT TO GO BACK TO PDFKIT TEMPLATES UNCOMMENT THE COMMENTED CODE AND COMMENT THE MARKED CODE */

const path = require('path');
const logger = require('./logger/logger.service');
const getFunctionName = require('./get-function-name.service');
const currencyArr = require('../../constants/currency');
const converter = require('number-to-words');
const moment = require('moment');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const { TEMPLATES } = require('../../constants/invoiceTemplate');
const { TEMPLATE_CONFIG } = require('../../constants/templateConfig');
// const axios = require('axios');

// const INVOICE_TEMPLATE_DEFAULT = require('../invoiceTemplates/invoice.template.default');
// const INVOICE_TEMPLATE_TWO = require('../invoiceTemplates/invoice.template.two');

// async function fetchImage(src) {
//   const image = await axios.get(src, {
//     responseType: 'arraybuffer'
//   });
//   return image.data;
// }

const generatePdf = async (invoiceData, invoiceTemplateId) => {
  const template = TEMPLATES[invoiceTemplateId];
  const templateName = template ? `template${template}` : 'templateOne';
  const html = fs.readFileSync(
    path.join(__dirname, `../../invoice-templates/${templateName}.html`),
    'utf-8'
  );

  const document = {
    html,
    data: invoiceData,
    type: 'buffer'
  };
  return await pdf.create(document, TEMPLATE_CONFIG);
};

/**
 *
 * @param {object} invoiceData
 * @param {number} invoiceTemplateId
 * @returns {PDF}
 * @returns {boolean}
 */
const generateInvoice = async (invoiceData, invoiceTemplateId) => {
  try {
    if (!invoiceData) {
      return false;
    }
    if (invoiceData) {
      // for converting number to words
      invoiceData.amountInWords =
        converter.toWords(invoiceData.total).charAt(0).toUpperCase() +
        converter.toWords(invoiceData.total).slice(1);

      const decPart = String(invoiceData.total).split('.')[1];

      if (decPart && decPart !== '00') {
        invoiceData.decimalExists = true;
        const decPartNumber = Number(decPart);
        invoiceData.decimalAmountInWords = converter.toWords(decPartNumber);
      } else {
        invoiceData.decimalAmountInWords = '';
      }

      // for adding prefix and postfix to currency
      let currencyPrefix;
      let currencyPostfix;

      switch (invoiceData.currency) {
        case 'INR':
          if (String(invoiceData.total).split('.')[0] === '1') {
            currencyPrefix = 'rupee';
          }
          if (decPart && decPart === '1') {
            currencyPostfix = 'paisa';
          }
          if (
            String(invoiceData.total).split('.')[0] === '1' &&
            decPart &&
            decPart !== '1'
          ) {
            currencyPrefix = 'rupee';
            currencyPostfix = 'paisa';
          }
          if (
            String(invoiceData.total).split('.')[0] !== '1' &&
            decPart &&
            decPart === '1'
          ) {
            currencyPrefix = 'rupees';
            currencyPostfix = 'paisa';
          }
          if (
            String(invoiceData.total).split('.')[0] !== '1' &&
            decPart &&
            decPart !== '1'
          ) {
            currencyPrefix = 'rupees';
            currencyPostfix = 'paisa';
          }
          break;
        case 'USD':
          if (String(invoiceData.total).split('.')[0] === '1') {
            currencyPrefix = 'dollar';
          }
          if (decPart && decPart === '1') {
            currencyPostfix = 'cent';
          }
          if (
            String(invoiceData.total).split('.')[0] === '1' &&
            decPart &&
            decPart !== '1'
          ) {
            currencyPrefix = 'dollar';
            currencyPostfix = 'cents';
          }
          if (
            String(invoiceData.total).split('.')[0] !== '1' &&
            decPart &&
            decPart === '1'
          ) {
            currencyPrefix = 'dollars';
            currencyPostfix = 'cent';
          }
          if (
            String(invoiceData.total).split('.')[0] !== '1' &&
            decPart &&
            decPart !== '1'
          ) {
            currencyPrefix = 'dollars';
            currencyPostfix = 'cents';
          }
          break;
        default:
          break;
      }
      invoiceData.currencyPrefix = currencyPrefix;
      invoiceData.currencyPostfix = currencyPostfix;

      // for converting server time to normal time
      const formattedItemsTime = invoiceData.items.map((item) => {
        item.duration.from = moment(item.duration.from).format('DD-MMM-YYYY');
        item.duration.to = moment(item.duration.to).format('DD-MMM-YYYY');
        return item;
      });
      invoiceData.items = formattedItemsTime;
      invoiceData.invoiceDate = moment(invoiceData.invoiceDate).format(
        'DD-MMM-YYYY'
      );

      // for getting currency symbol
      let currencySymbol;
      currencyArr.forEach((currency) => {
        if (currency.value === invoiceData.currency) {
          currencySymbol = currency.logo;
        }
      });
      invoiceData.currencySymbol = currencySymbol;

      /* */
      // if (invoiceData.company.logo) {
      //   const companyLogo = invoiceData.company.logo;
      //   const logo = await fetchImage(companyLogo);
      //   // setting compatible image format for PDF generation
      //   invoiceData.company.logo = logo;
      // }

      // switch (invoiceTemplateId) {
      //   case '1':
      //     invoiceTemplate = INVOICE_TEMPLATE_DEFAULT;
      //     break;
      //   case '2':
      //     invoiceTemplate = INVOICE_TEMPLATE_TWO;
      //     break;
      // default:
      //       invoiceTemplate = INVOICE_TEMPLATE_DEFAULT;
      //       break;
      //   }
      //   const pdf = await invoiceTemplate(invoiceData);
      // return pdf;
      /* */

      return await generatePdf(invoiceData, invoiceTemplateId);
    }
    return false;
  } catch (error) {
    logger.error(`${error}`, {
      filePath: __filename.slice(__dirname.length + 1),
      fileName: path.dirname(__filename),
      req: 'POST',
      methodName: getFunctionName()
    });
    return false;
  }
};

module.exports = {
  generateInvoice
};
