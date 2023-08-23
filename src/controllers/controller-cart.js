const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const { v4: uuidv4 } = require("uuid");

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  // Ambil data semua cart
  getDataCart(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_cart;
                `,
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
      connection.release();
    });
  },
  // Ambil data cart berdasarkan ID
  getDataCartByUUID(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_cart WHERE cart_uuid = ?;
                `,
        [uuid],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
      connection.release();
    });
  },
  // Simpan data cart
  addDataCart(req, res) {
    let data = {
      cart_uuid: uuidv4(),
      cart_userUUID: req.body.userUUID,
      cart_productUUID: req.body.productUUID,
      cart_cartValue: req.body.cartValue,
    };
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                INSERT INTO tabel_cart SET ?;
                `,
        [data],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil tambah data!",
          });
        }
      );
      connection.release();
    });
  },
  // Update data cart
  editDataCart(req, res) {
    let dataEdit = {
      cart_userUUID: req.body.userUUID,
      cart_productUUID: req.body.productUUID,
      cart_cartValue: req.body.cartValue,
    };
    let uuid = req.params.uuid;
    // console.log(dataEdit, uuid);
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                UPDATE tabel_cart SET ? WHERE cart_uuid = ?;
                `,
        [dataEdit, uuid],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil edit data!",
          });
        }
      );
      connection.release();
    });
  },
  // Delete data cart
  deleteDataCart(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                DELETE FROM tabel_cart WHERE cart_uuid = ?;
                `,
        [uuid],
        function (error, results) {
          if (error) throw error;
          res.send({
            success: true,
            message: "Berhasil hapus data!",
          });
        }
      );
      connection.release();
    });
  },
};
