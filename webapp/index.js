const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

//const products = require("./apis/products/products.js");
const ata = require("./apis/atas/atas.js");
const stages = require("./apis/products/stages");
const history = require("./apis/products/history.js");

// set default views folder
app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registra a sessão do usuário
app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false
}));

const authRoutes = require('./apis/routes/auth.js');

app.get('/', (req, res) => {
    res.redirect('/api/auth');
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

// * Products pages * //
<<<<<<< HEAD
//app.get("/addProducts", products.renderAddProducts);
//app.get("/getProducts", products.renderGetProducts);

//app.post("/addProducts", products.addProducts);
//app.get("/listProducts", products.getProducts);
=======
app.get("/addProducts", products.renderAddProducts);
app.get("/getProducts", products.renderGetProducts);
app.get("/editProduct", products.renderEditProduct);

app.post("/addProducts", products.addProducts);
app.post("/updateProduct", products.updateProduct);
app.get("/listProducts", products.getProducts);
>>>>>>> da57ed45b49cfdc770eeefb4d6f635e438dbb1b8

// * Estágios * //
app.get("/addStage", stages.renderAddStage);
app.get("/getStages", stages.renderGetStages);

app.post("/addStage", stages.addStage);
app.get("/listStages", stages.listStages);

<<<<<<< HEAD

app.get("/exibirRegistroAta", ata.exibirRegistroAta);
app.post("/registrarAta", ata.registrarAta);

app.get("/listarAtasReuniao", ata.listarAtasReuniao);
app.get("/listarAtasRegistradas", ata.listarAtasRegistradas);


app.post( "/comentarAta", ata.registrarComentario );
app.post( "/listarComentarios", ata.listarComentarios );

=======
// * History * //
app.get("/addHistory", history.renderAddHistory);
app.post("/addHistory", history.addHistory);

app.get("/getHistory", history.getHistory);
app.get("/listHistory", history.renderGetHistory);
>>>>>>> da57ed45b49cfdc770eeefb4d6f635e438dbb1b8

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})