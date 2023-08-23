const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const { v4: uuidv4 } = require("uuid");

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  // Ambil data semua wishlist
  getDataWishlist(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_wishlist;
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
  // Ambil data wishlist berdasarkan ID
  getDataWishlistByUUID(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_wishlist WHERE wishlist_uuid = ?;
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
  // Simpan data wishlist
  addDataWishlist(req, res) {
    let data = {
      wishlist_uuid: uuidv4(),
      wishlist_userUUID: req.body.userUUID,
      wishlist_productUUID: req.body.productUUID,
    };
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                INSERT INTO tabel_wishlist SET ?;
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
  // Update data wishlist
  editDataWishlist(req, res) {
    let dataEdit = {
      wishlist_userUUID: req.body.userUUID,
      wishlist_productUUID: req.body.productUUID,
    };
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                UPDATE tabel_wishlist SET ? WHERE wishlist_uuid = ?;
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
  // Delete data wishlist
  deleteDataWishlist(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                DELETE FROM tabel_wishlist WHERE wishlist_uuid = ?;
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
