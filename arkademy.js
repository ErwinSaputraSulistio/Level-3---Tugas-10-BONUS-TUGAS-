//require
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("req-flash");
const app = express();

//routing
const db = require("./config/db");
const produk = require("./models/produk");

//setting
const hostname = "localhost";
const port = 1009;
db.authenticate().then(() => {
app.listen(port, hostname, () => 
    {console.log("\x1b[32m%s\x1b[0m", `Server telah aktif! - Alamat host adalah "http://${hostname}:${port}/"`)}
    )
});

//hbs
hbs.handlebars.registerHelper('notUndefinedType', function(variable) {
    if (typeof variable != 'undefined' && variable) {
        return variable;
    }
  })
  
app.use(session({
    secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
    resave: false,
    saveUninitialized: true
    }));
app.use(flash());

//set
app.set("views",path.join(__dirname,"views"));
app.set("view engine", "hbs");

//use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({extended: true}));

//create
app.post("/create", async (req,res) => { 
    try { 
        const nama_produk = req.body.nama_produk;
        const keterangan = req.body.keterangan;
        const harga = req.body.harga;
        const jumlah = req.body.jumlah;
        const newProduk = new produk({
            nama_produk, 
            keterangan, 
            harga,
            jumlah
        })
        await newProduk.save(); //"await" akan menunggu "async" selesai dahulu, baru akan berjalan
        res.redirect("/");
    } 
    catch (err) { //NOTE (penting!) : fitur "try" dan "catch" hanya berlaku untuk kode-kode yang terlibat!
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

//home
app.get("/", async (req,res) => {
    const getAllProduk = await produk.findAll({})
    console.log(req.flash('deletePostSuccessMsg'))
    res.render("crud",{ deletePostSuccessMsg: req.flash('deletePostSuccessMsg'), deletePostErrorMsg: req.flash('deletePostErrorMsg'), all_produk : getAllProduk});
});

//edit
app.get("/edit/:id", async (req,res) => {
    try {
        await produk.findAll({where: {id: req.params.id}}).then(function(result){
            res.json({produkData: result[0], status: 200});
        })
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

//update
app.post("/update",async (req,res) => {
    try {
        const nama_baru = req.body.nama_baru;
        const keterangan_baru = req.body.keterangan_baru;
        const harga_baru = req.body.harga_baru;
        const jumlah_baru = req.body.jumlah_baru;
        const id_produk = req.body.id_produk;
        
        const updateProduk = await produk.update({
            nama_produk: nama_baru, 
            keterangan: keterangan_baru, 
            harga: harga_baru,
            jumlah: jumlah_baru,
        },{where : { id:id_produk } } );

        await updateProduk;
        res.redirect("/");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

//delete
app.post("/delete",async (req,res) => {
    try {
        const id = req.body.id_produk
        const deleteProduk = await produk.destroy({where: {id:id}});
        if(deleteProduk) {
            req.flash('deletePostSuccessMsg');
            /* alert("Delete berhasil!"); */
        }
        else{
            req.flash('deletePostErrorMsg', 'Something went wrong while deleting post!');
        }
        res.redirect("/");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});
