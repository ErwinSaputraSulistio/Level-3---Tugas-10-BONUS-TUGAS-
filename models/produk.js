const Sequelize = require("sequelize");
const db = require("../config/db");

const produk = db.define(
    "produk",
    {
        nama_produk: {type: Sequelize.STRING},
        keterangan: {type: Sequelize.STRING},
        harga: {type: Sequelize.INTEGER},
        jumlah: {type: Sequelize.INTEGER}
    },
    {
        freezeTableName: true
    }
);

module.exports = produk;