const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const Parser = require('./parser');
const {Client} = require('pg');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const newsRouter = require('./routes/news');
const settingsRoutes = require('./routes/settings')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const app = express();

const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'News_db',
    password: 'Pa$$w0rd',
    port: 5432  
});

//Настройка handlebars
app.engine('hbs', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',//имя лайаута
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views','views')//папка по умолчанию

//регистрация папки
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}));

app.use('/',newsRouter)
app.use('/settings',settingsRoutes)

app.listen(PORT, () => {
    db.connect();
    
    setInterval( () => {
        Parser.Parser();
    }, 432000000)

    console.log(`Server is running on port ${PORT}`)
})

module.exports.db = db;

