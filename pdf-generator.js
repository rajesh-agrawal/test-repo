const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
//var handlebarsStatic = require('handlebars-static');

// const express = require('express'); used to expose the local assests for jdf-logo
// const app = express();
// app.use(express.static('./assests'))
// app.listen(3000);
const express = require('express');
 const app = express();
app.use(express.static((path.join(__dirname, './public'))));


var customerData = require('./data-hn.json');

async function createPDF(data){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
	var template = handlebars.compile(templateHtml);
	var html = template(data);
	var timestamp = new Date().getTime().toString();

	var pdfPath = path.join('pdf', `${customerData.title}-${timestamp}.pdf`);

	var headerTemplate = fs.readFileSync(path.join(process.cwd(), './public/headerTemplate.html'), 'utf8');
	var footerTemplate = fs.readFileSync(path.join(process.cwd(), './public/footerTemplate.html'), 'utf8');
	var options = {
		width: '790px',
		height: '870px',
		landscape: true,
		headerTemplate:headerTemplate,
	footerTemplate:footerTemplate,
		displayHeaderFooter:true,
		// format: 'A5',
margin:{
	top:"140px",
	bottom:"80px"
},
		printBackground: true,
		path: pdfPath,
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	var page = await browser.newPage();
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});
	await page.addStyleTag({path: "./public/css/style.css"}) // to include the css file	

	await page.pdf(options);

	await browser.close();
}
// convert to function which will accept the parameteres

function generateDate(){
	var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
return today;
}
customerData.date = generateDate();
createPDF(customerData);