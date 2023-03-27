const express = require('express');
const app = express();
const port = 3000;
const Joi = require('joi');
const fs = require('fs');

app.use(express.json());

const products = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const productSchema = Joi.object({
    productNumber: Joi.number().integer().valid(...products.map(p => p.productNumber)),
    productName: Joi.string().required().valid(...products.map(p => p.productName)),
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

app.get('/api/product/:productNumber', (req, res) => {
    const products = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    const product = products.find(p => p.productNumber === parseInt(req.params.productNumber));
    if (!product) res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

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

app.get('/', (req, res) => {
    const products = [];

    const owners = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry", "Isabelle", "Jack"];
    const developers = ["Adam", "Beth", "Cathy", "Dan", "Emily", "Fred", "Gina", "Harry", "Ivy", "Jake", "Kelly", "Luke", "Megan", "Nate", "Olivia", "Peter", "Quinn", "Rachel", "Steve", "Tina"];
    const scrumMasters = ["Amy", "Ben", "Chloe", "Derek", "Emma", "Fiona", "Glen", "Haley", "Ian", "Jenna"];

    for (let i = 1; i <= 40; i++) {
        const ownerName = owners[Math.floor(Math.random() * owners.length)];
        const scrumMasterName = scrumMasters[Math.floor(Math.random() * scrumMasters.length)];
        const numDevelopers = Math.floor(Math.random() * 5) + 1;
        const developerNames = [];
        for (let j = 0; j < numDevelopers; j++) {
            const developerName = developers[Math.floor(Math.random() * developers.length)];
            developerNames.push(developerName);
        }
        const methodology = Math.random() < 0.5 ? "Agile" : "Waterfall";
        const startDate = new Date();

        const product = {
            productNumber: i,
            productName: `Product ${i}`,
            productOwner: ownerName,
            developers: developerNames,
            scrumMaster: scrumMasterName,
            startDate: startDate,
            methodology: methodology,
            // organization: "BC Ministry of Citizen Services",
            // department: "Information Management Branch"
        };

        products.push(product);
    }

    console.log(products);
    res.send(products);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));