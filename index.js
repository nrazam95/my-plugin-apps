var express = require('express');
var fs = require('fs');
var extender = require('./extender');
var reducer = require('./reducer');

class App {
    constructor() {
        this.server = express();
        this.server.use(express.json())
        this.router = express.Router();
        this.plugins = {};
    }

    start() {
        this.router.route('/mami/:slug/load').get((req, res) => {
            fs.readFile('./plugins.json', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } 

                try {
                    const plugins = JSON.parse(fs.readFileSync('./plugins.json', 'utf-8'));
                    const path = plugins[req.params.slug];
                    const module = require(path);
                    this.plugins[req.params.slug] = module;

                    extender(App.prototype, 'start', this.plugins[req.params.slug].load(this.router));
                    res.json({
                        message: 'Plugin loaded'
                    })

                } catch (e) {
                    console.log(e);
                }
            })
            
        })

        this.router.route('/mami/:slug/unload').get((req, res) => {
            fs.readFile('./plugins.json', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } 

                try {
                    const plugins = JSON.parse(fs.readFileSync('./plugins.json', 'utf-8'));
                    const path = plugins[req.params.slug];
                    const module = require(path);
                    this.plugins[req.params.slug] = module;

                    reducer(App.prototype, 'start');
                    this.plugins = {};
                    res.json({
                        message: 'Plugin unloaded'
                    })

                } catch (e) {
                    console.log(e);
                }
            })
            
        })

        this.server.use('/', this.router)

        this.server.listen(3000, () => {
            console.log('Server started on port 3000');
        });
    }

    stop() {
        this.server.close();
    }
}

const app = new App();
app.start();