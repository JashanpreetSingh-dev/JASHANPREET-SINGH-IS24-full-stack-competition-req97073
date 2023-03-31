const express = require('express');
const app = express();
const port = 3000;
const Joi = require('joi');
const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product API',
            description: 'This API is developed for IS24 Full Stack Developer Coding Challenge from BC Ministry of Citizens Services - Information Management Branch by Jashanpreet Singh',
            version: '1.0.0',
        },
    },
    apis: ['./server.js'],
}

const specs = swaggerJSDoc(options);

app.use('/api/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(cors());

const products = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const productSchema = Joi.object({
    productNumber: Joi.number().integer().valid(...products.map(p => p.productNumber)),
    productName: Joi.string().required(),
    productOwner: Joi.string().required(),
    developers: Joi.array().items(Joi.string()).max(5).unique().required(),
    scrumMaster: Joi.string().required(),
    startDate: Joi.date(),
    methodology: Joi.string().valid("Agile", "Waterfall").required(),
});

function filterBy(req, res, products, queryParam, propName) {
    let product = {}
    if ( propName !== "developers"){
        product = products.filter(p => p[propName] === req.query[queryParam]);
    } else {
        product = products.filter(p => p[propName].includes(req.query[queryParam]));
    }
    if (product.length === 0) {
        res.status(404).send('The product with the given ' + queryParam + ' was not found.');
    } else {
        console.log(product);
        res.send(product);
    }
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productNumber:
 *           type: integer
 *           example: 1
 *         productName:
 *           type: string
 *           example: "Product 1"
 *         productOwner:
 *           type: string
 *           example: "John Doe"
 *         developers:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Jane Doe", "Bob Smith"]
 *         scrumMaster:
 *           type: string
 *           example: "Alice Johnson"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2023-03-26T13:00:00.000Z"
 *         methodology:
 *           type: string
 *           example: "Agile"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products with optional filters. If no filters are specified, all products are returned.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: productOwner
 *         schema:
 *           type: string
 *         description: Filter by product owner
 *       - in: query
 *         name: developerName
 *         schema:
 *           type: string
 *         description: Filter by developer name
 *       - in: query
 *         name: scrumMaster
 *         schema:
 *           type: string
 *         description: Filter by scrum master
 *       - in: query
 *         name: methodology
 *         schema:
 *           type: string
 *         description: Filter by methodology
 *     responses:
 *       '200':
 *         description: A list of products that match the filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               - productNumber: 1
 *                 productName: "Product 1"
 *                 productOwner: "Isabelle"
 *                 developers: ["Olivia","Peter","Cathy","Jake"]
 *                 scrumMaster: "Fiona"
 *                 startDate: "2023-03-27T01:56:31.384Z"
 *                 methodology: "Agile"
 *               - productNumber: 2
 *                 productName: "Product 2"
 *                 productOwner: "Henry"
 *                 developers: ["Tina"]
 *                 scrumMaster: "Ian"
 *                 startDate: "2023-03-27T01:56:31.384Z"
 *                 methodology: "Waterfall"
 *       '400':
 *         description: Bad request. Invalid request parameters.
 *       '500':
 *         description: Internal server error. Failed to read from data file.
 */
app.get('/api/products', (req, res) => {
    // res.send(products);
    if (req.query.productOwner) {
        filterBy(req, res, products, "productOwner", "productOwner");
    } else if (req.query.developerName) {
        filterBy(req, res, products, "developerName", "developers");
    } else if (req.query.scrumMaster) {
        filterBy(req, res, products, "scrumMaster", "scrumMaster");
    } else if (req.query.methodology) {
        filterBy(req, res, products, "methodology", "methodology");
    } else {
        res.send(products);
    }
});

/**
 * @swagger
 * /api/product/{productNumber}:
 *   get:
 *     summary: Get a product by its product number
 *     description: Retrieve a product from the system by its unique product number
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productNumber
 *         required: true
 *         description: Numeric ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product found and returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               productNumber: 41
 *               productName: "Product 41"
 *               productOwner: "John Doe"
 *               developers: ["Jane Doe", "Bob Smith"]
 *               scrumMaster: "Mary Johnson"
 *               startDate: "2023-03-26T10:00:00.000Z"
 *               methodology: "Agile"
 *       '404':
 *         description: The product with the given ID was not found.
 *       '500':
 *         description: Internal server error. Failed to read data file.
 */
app.get('/api/product/:productNumber', (req, res) => {
    const products = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    const product = products.find(p => p.productNumber === parseInt(req.params.productNumber));
    if (!product) res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the system
 *     tags:
 *       - Products
 *     requestBody:
 *       description: Product object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             productName: "Product 41"
 *             productOwner: "John Doe"
 *             developers: ["Jane Doe", "Bob Smith"]
 *             scrumMaster: "Mary Johnson"
 *             startDate: "2023-03-26T10:00:00.000Z"
 *             methodology: "Agile"
 *     responses:
 *       '200':
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               productNumber: 41
 *               productName: "Product 41"
 *               productOwner: "John Doe"
 *               developers: ["Jane Doe", "Bob Smith"]
 *               scrumMaster: "Mary Johnson"
 *               startDate: "2023-03-26T10:00:00.000Z"
 *               methodology: "Agile"
 *       '400':
 *         description: Bad request. Invalid request body or product name already exists.
 *       '500':
 *         description: Internal server error. Failed to write to data file.
 */
app.post('/api/product', (req, res) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return;
    }

    if (products.find(p => p.productName === req.body.productName)) {
        res.status(400).send('Product name already exists.');
        return;
    }

    const maxProductNumber = Math.max(...products.map(p => p.productNumber));

    const product = {
        productNumber: maxProductNumber + 1,
        productName: req.body.productName,
        productOwner: req.body.productOwner,
        developers: req.body.developers,
        scrumMaster: req.body.scrumMaster,
        startDate: req.body.startDate,
        methodology: req.body.methodology
    };
    products.push(product);
    fs.writeFileSync('./data.json', JSON.stringify(products));
    res.send(product);
});

/**
 * @swagger
 * /api/product/{productNumber}:
 *   put:
 *     summary: Update an existing product
 *     description: Update an existing product in the system
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productNumber
 *         description: ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Product object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             productName: "Product 41"
 *             productOwner: "John Doe"
 *             developers: ["Jane Doe", "Bob Smith"]
 *             scrumMaster: "Mary Johnson"
 *             startDate: "2023-03-26T10:00:00.000Z"
 *             methodology: "Agile"
 *     responses:
 *       '200':
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               productNumber: 41
 *               productName: "Product 41"
 *               productOwner: "John Doe"
 *               developers: ["Jane Doe", "Bob Smith"]
 *               scrumMaster: "Mary Johnson"
 *               startDate: "2023-03-26T10:00:00.000Z"
 *               methodology: "Agile"
 *       '400':
 *         description: Bad request. Invalid request body or product name already exists.
 *       '404':
 *         description: The product with the given ID was not found.
 *       '500':
 *         description: Internal server error. Failed to write to data file.
 */
app.put('/api/product/:productNumber', (req, res) => {
    const product = products.find(p => p.productNumber === parseInt(req.params.productNumber));
    if (!product) res.status(404).send('The product with the given ID was not found.');

    const { error } = productSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    product.productName = req.body.productName;
    product.productOwner = req.body.productOwner;
    product.developers = req.body.developers;
    product.scrumMaster = req.body.scrumMaster;
    product.startDate = req.body.startDate;
    product.methodology = req.body.methodology;
    fs.writeFileSync('./data.json', JSON.stringify(products));
    res.send(product);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));