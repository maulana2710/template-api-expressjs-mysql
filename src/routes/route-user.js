const router = require('express').Router();
const { user } = require('../controllers');

// GET localhost:8080/user => Ambil data semua user
router.get('/', user.getDataUser);

// GET localhost:8080/user/login => authentikasi login user
router.post('/login', user.getDataUserLogin);

// GET localhost:8080/user/resetPassword => reset password
router.post('/resetPassword', user.getDataResetPassword);

// GET localhost:8080/user/2 => Ambil data semua user berdasarkan uuid = 2
router.get('/:uuid', user.getDataUserByUUID);

// POST localhost:8080/user/add => Tambah data user ke database
router.post('/add', user.addDataUser);

// POST localhost:8080/user/2 => Edit data user
router.post('/edit/:uuid', user.editDataUser);

// POST localhost:8080/user/delete => Delete data user
router.post('/delete/:uuid', user.deleteDataUser);

module.exports = router;