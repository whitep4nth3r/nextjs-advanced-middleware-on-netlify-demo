function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function generateInvoices(count) {
  // generate example invoice data for {count} invoices
  const data = [];

  for (let i = 0; i < count; i++) {
    const invoice = {
      date: new Date(),
      number: Math.random().toFixed(3) * 1000,
      amount: (Math.random().toFixed(5) * 1000).toFixed(2),
      currency: "USD",
    };

    console.log(`Invoice ${i} generated`);
    data.push(invoice);
  }

  return data;
}

async function createPdf(invoiceData) {
  // generate pdf using {invoiceData}
  // this probably takes a while per invoice!

  const t0 = performance.now();
  await sleep(2000);
  const t1 = performance.now();
  console.log(`Created PDF in ${t1 - t0}ms`);
  return { pdfCreated: true, ...invoiceData };
}

async function sendEmail(pdf) {
  // use a fake mail service to mail a PDF

  const t0 = performance.now();
  await sleep(2000);
  const t1 = performance.now();
  console.log(`Email sent for invoice ${pdf.number} in ${t1 - t0}ms`);
}

export default async function handler(req, res) {
  // use a URL query param to configure how many invoices to process
  // (.e.g ?count=100)

  const { count } = req.query;
  const invoices = generateInvoices(count);

  try {
    for (const invoice of invoices) {
      await createPdf(invoice).then(async (pdf) => await sendEmail(pdf));
      console.log(`Invoice ${invoice.number} processed`);
    }

    // Resolve the response whilst the Background Function is processing
    res.send();
  } catch (error) {
    throw new Error(error);
  }
}

export const config = {
  type: "experimental-background",
};
