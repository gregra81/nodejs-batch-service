import express from 'express';
import bodyParser from 'body-parser';

import batchRoutes from './api/routes/batchRoutes';

const app = express();
const port = process.env.PORT || 3001;

//routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

batchRoutes(app); //register the batch route

app.listen(port);

console.log('RESTful API server started on: ' + port);