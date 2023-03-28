const express = require('express');
const app = express();
const port = 3000;
const Joi = require('joi');
const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product API',
            version: '1.0.0',
        },
    },
    apis: ['./server.js'],
}

const specs = swaggerJSDoc(options);

app.use('/api/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());

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
    const product = products.filter(p => p[propName] === req.query[queryParam]);
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
 *     summary: Get a list of products
 *     parameters:
 *       - in: query
 *         name: productOwner
 *         description: Filter by product owner
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: developerName
 *         description: Filter by developer name
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: scrumMaster
 *         description: Filter by scrum master
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: methodology
 *         description: Filter by methodology
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
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
 *     summary: Get a product by product number
 *     parameters:
 *       - in: path
 *         name: productNumber
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to retrieve
 *     responses:
 *       '200':
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productNumber:
 *                   type: integer
 *                   description: The unique identifier for the product
 *                   example: 12345
 *                 productName:
 *                   type: string
 *                   description: The name of the product
 *                   example: "Example Product"
 *                 productOwner:
 *                   type: string
 *                   description: The name of the product owner
 *                   example: "John Doe"
 *                 developers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The list of developers working on the product
 *                   example: ["Alice", "Bob"]
 *                 scrumMaster:
 *                   type: string
 *                   description: The name of the scrum master for the product
 *                   example: "Jane Doe"
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the product development
 *                   example: "2022-01-01T00:00:00.000Z"
 *                 methodology:
 *                   type: string
 *                   description: The development methodology used for the product
 *                   example: "Agile"
 *       '404':
 *         description: Product not found
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
        res.status(400).send(error.details[0].message);
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
        startDate: new Date(),
        methodology: req.body.methodology
    };
    products.push(product);
    fs.writeFileSync('./data.json', JSON.stringify(products));
    res.send(product);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));