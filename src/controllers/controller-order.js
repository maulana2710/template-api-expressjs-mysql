const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  // Ambil data semua order
  getDataOrder(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
            SELECT * FROM tabel_order;
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
  // Ambil data semua order
  getDataOrderFiltered(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
        SELECT
          o.order_uuid,
          u.user_uuid,
          p.product_uuid,
          p.product_name,
          p.product_price,
          p.product_discountPercentage,
          p.product_category,
          p.product_quantityStock,
          p.product_sku,
          p.product_description,
          p.product_imageUrl1,
          p.product_imageUrl2,
          p.product_imageUrl3,
          u.user_username,
          o.order_receiver,
          o.order_phoneNumber,
          o.order_address,
          o.order_postalCode,
          o.order_status,
          o.order_receipt,
          o.create_at,
          o.update_at

        FROM
          tabel_order o
        JOIN
          tabel_user u ON o.order_userUUID = u.user_uuid
        JOIN
          tabel_product p ON o.order_productUUID = p.product_uuid;
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
  // Ambil data order by ID
  getDataOrderByUserUUID(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
      SELECT
        o.order_uuid,
        u.user_uuid,
        p.product_uuid,
        p.product_name,
        p.product_price,
        p.product_discountPercentage,
        p.product_category,
        p.product_quantityStock,
        p.product_sku,
        p.product_description,
        p.product_imageUrl1,
        p.product_imageUrl2,
        p.product_imageUrl3,
        u.user_username,
        o.order_receiver,
        o.order_phoneNumber,
        o.order_address,
        o.order_postalCode,
        o.order_status,
        o.order_receipt,
        o.create_at,
        o.update_at

      FROM
        tabel_order o
      JOIN
        tabel_user u ON o.order_userUUID = u.user_uuid
      JOIN
        tabel_product p ON o.order_productUUID = p.product_uuid
      WHERE order_userUUID = ?;
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
  // Ambil data order by ID
  getDataOrderByUUID(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
      SELECT
        o.order_uuid,
        u.user_uuid,
        p.product_uuid,
        p.product_name,
        p.product_price,
        p.product_discountPercentage,
        p.product_category,
        p.product_quantityStock,
        p.product_sku,
        p.product_description,
        p.product_imageUrl1,
        p.product_imageUrl2,
        p.product_imageUrl3,
        u.user_username,
        o.order_receiver,
        o.order_phoneNumber,
        o.order_address,
        o.order_postalCode,
        o.order_status,
        o.order_receipt,
        o.create_at,
        o.update_at

      FROM
        tabel_order o
      JOIN
        tabel_user u ON o.order_userUUID = u.user_uuid
      JOIN
        tabel_product p ON o.order_productUUID = p.product_uuid
      WHERE order_uuid = ?;
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
  // Tambah data order
  addDataOrder(req, res) {
    if (req.files === null)
      return res.status(400).json({ msg: "No File Uploaded" });
    const file1 = req.files.file1;
    const name1 = file1.name;
    const ext1 = path.extname(name1);
    const fileName1 = file1 === undefined ? file1 : file1.md5 + "1" + ext1;
    const url1 =
      fileName1 === undefined
        ? "undefined"
        : `${req.protocol}://${req.get("host")}/images/orders/${fileName1}`;
    let data = {
      order_uuid: uuidv4(),
      order_userUUID: req.body.userUUID ?? "",
      order_productUUID: req.body.productUUID ?? "",
      order_receiver: req.body.receiver ?? "",
      order_phoneNumber: req.body.phoneNumber ?? "",
      order_address: req.body.address ?? "",
      order_postalCode: req.body.postalCode ?? "",
      order_status: req.body.status ?? "",
      order_receipt: url1 ?? "",
    };
    const allowedType = [".png", ".jpg", ".jpeg", ".svg", ".pdf"];

    if (!allowedType.includes(ext1.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    console.log(data);
    file1.mv(`./src/public/images/orders/${fileName1}`, async (err) => {
      if (err) throw err;
    });

    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                INSERT INTO tabel_order SET ?;
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
  // Perbarui data order
  editDataOrder(req, res) {
    let uuid = req.params.uuid;
    if (!uuid) return res.status(404).json({ msg: "Id is required" });
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
            SELECT * FROM tabel_order WHERE order_uuid = ?;
            `,
        [uuid],
        function (error, results) {
          if (error) throw error;
          let order;
          order = results[0];
          console.log(results[0]?.order_name);
          if (!order) return res.status(404).json({ msg: "Data Not Found" });
          let fileName = "";
          let fileName1 = "";
          if (req.files === null) {
            let dataEdit = {
              order_userUUID: order?.order_userUUID,
              order_productUUID: order?.order_productUUID,
              order_receiver: order?.order_receiver,
              order_phoneNumber: order?.order_phoneNumber,
              order_address: order?.order_address,
              order_postalCode: order?.order_postalCode,
              order_status: req.body.status,
              order_receipt: order?.order_receipt,
            };
            console.log(dataEdit);
            pool.getConnection(function (err, connection) {
              if (err) throw err;
              connection.query(
                `
                  UPDATE tabel_order SET ? WHERE order_uuid = ?;
                  `,
                [dataEdit, uuid],
                function (error, results) {
                  if (error) throw error;
                  res.send({
                    success: true,
                    message: "Berhasil edit data!",
                    data: dataEdit,
                  });
                }
              );
              connection.release();
            });
          }
        }
      );
      connection.release();
    });
  },
  // Hapus data order
  deleteDataOrder(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                DELETE FROM tabel_order WHERE order_uuid = ?;
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
