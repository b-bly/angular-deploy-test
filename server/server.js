const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const path = require('path');
const dotenv = require("dotenv").config();

const clientPath = '../dist/angular-deploy-test/';

if (dotenv.error) { console.log(dotenv.error); }
console.log(process.env.NODE_ENV)

const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

// log sessions for dev only




const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

app.get('/api', function (req, res) {
	console.log(req.body);
	res.end();
})

if (process.env.NODE_ENV === 'production') {
	console.log('*** production environment ***');
	app.use('/static', express.static(path.join(__dirname, clientPath + 'index.html')));
	app.get('*', function (req, res) {
			console.log('get /');
			console.log(__dirname)
			console.log(path.join(__dirname, clientPath));

			// res.sendFile(path.join(__dirname, clientPath));

			if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
				console.log(path.resolve(__dirname, `${clientPath}${req.url}`))
				res.sendFile(path.resolve(__dirname, `${clientPath}${req.url}`));
			} else {
				console.log(path.resolve(__dirname, `${clientPath}index.html`));
				res.sendFile(path.resolve(__dirname, `${clientPath}index.html`));
			}
	});
	app.use('/', express.static(path.join(__dirname, clientPath)));
}

// Starting Server 
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})
