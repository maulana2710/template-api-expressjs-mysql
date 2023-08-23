const config = require("../configs/database");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const pool = mysql.createPool(config);
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  // Ambil data semua user
  getDataUser(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_user;
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
  // Ambil data user berdasarkan UUID
  getDataUserByUUID(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
                SELECT * FROM tabel_user WHERE user_uuid = ?;
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
  // Simpan data user
  addDataUser(req, res) {
    const password = req.body.password;
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.error("Terjadi kesalahan saat mengenkripsi password:", err);
          return;
        }
        // console.log("Password yang dienkripsi:", hash);
        let data = {
          user_uuid: uuidv4(),
          user_username: req.body.username,
          user_password: hash,
          user_phoneNumber: req.body.phoneNumber || "",
          user_address: req.body.address || "",
          user_postalCode: req.body.postalCode || "",
          user_role: req.body.role || "",
        };
        console.log(data);
        pool.getConnection(function (err, connection) {
          if (err) throw err;
          connection.query(
            `
                    SELECT * FROM tabel_user WHERE user_username = ?;
                    `,
            [data.user_username],
            function (error, results) {
              if (error) throw error;
              // console.log('cek results: ', results[0]?.user_username);
              // console.log('cek data: ', data?.user_username);
              if (results[0]?.user_username === data?.user_username) {
                console.log("username", data.user_username, "terdaftar");
                res.status(200).json({
                  success: false,
                  message: "Username telah digunakan",
                });
              } else {
                console.log("username dapat digunakan");
                pool.getConnection(function (err, connection) {
                  if (err) throw err;
                  connection.query(
                    `
                          INSERT INTO tabel_user SET ?;
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
              }
            }
          );
          connection.release();
        });
      });
    });
  },
  // Update data user
  editDataUser(req, res) {
    const password = req.body.password;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.error("Terjadi kesalahan saat mengenkripsi password:", err);
          return;
        }
        let dataEdit = {
          user_username: req.body.username,
          user_password: hash,
          user_phoneNumber: req.body.phoneNumber,
          user_address: req.body.address,
          user_postalCode: req.body.postalCode,
          user_role: req.body.role,
        };
        let uuid = req.params.uuid;
        console.log("cek update data user :", dataEdit);
        pool.getConnection(function (err, connection) {
          if (err) throw err;
          connection.query(
            `
                    UPDATE tabel_user SET ? WHERE user_uuid = ?;
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
      });
    });
  },
  // Delete data user
  deleteDataUser(req, res) {
    let uuid = req.params.uuid;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
            DELETE FROM tabel_user WHERE user_uuid = ?;
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

  // autentikasi login user
  getDataUserLogin(req, res) {
    const { username, password } = req.body;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
          SELECT * FROM tabel_user WHERE user_username = ?;
          `,
        [username],
        function (error, results) {
          if (error) throw error;
          var createToken = jwt.sign({ results }, "shhhhh");
          if (username === results[0]?.user_username) {
            bcrypt.compare(
              password,
              results[0]?.user_password,
              (err, result) => {
                if (err) {
                  console.error(
                    "Terjadi kesalahan saat memeriksa password:",
                    err
                  );
                  return;
                }

                if (result) {
                  const token = createToken; // Fungsi untuk menghasilkan token
                  // var decoded = jwt.verify(token, "shhhhh");
                  console.log("role :", results[0]?.user_role);
                  console.log("token :", token);
                  res.status(202).json({ success: true, token: token, r: results[0]?.user_role });
                } else {
                  res.json({ success: false, message: "Autentikasi gagal" });
                  console.log("autentikasi gagal");
                  console.log("Password tidak cocok");
                }
              }
            );
            // Jika autentikasi berhasil, kirim respons sukses dengan token
          } else {
            // Jika autentikasi gagal, kirim respons gagal
            res
              .status(401)
              .json({ success: false, message: "Autentikasi gagal" });
          }
        }
      );
      connection.release();
    });
  },
  // autentikasi login user

  // reset password user
  getDataResetPassword(req, res) {
    const { username, phoneNumber } = req.body;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `
          SELECT * FROM tabel_user WHERE user_username = ?;
          `,
        [username],
        function (error, results) {
          if (error) throw error;

          if (username === results[0]?.user_username) {
            console.log("Data Username Cocok");
            if (phoneNumber === results[0]?.user_phoneNumber) {
              console.log("Data Username dan NoTelp Cocok");
              res.status(202).json({ success: true, data: results[0] });
            } else {
              console.log("Data NoTelp Tidak Cocok");
              res.status(202).json({ success: false });
            }
          } else {
            console.log("Data Username Tidak Cocok");
            res.status(202).json({ success: false });
          }
        }
      );
      connection.release();
    });
  },
  // reset password user
};
