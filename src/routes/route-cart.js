const router = require('express').Router();
const { cart } = require('../controllers');

// GET localhost:8080/cart => Ambil data semua cart
router.get('/', cart.getDataCart);

// GET localhost:8080/cart/2 => Ambil data semua cart berdasarkan uuid = 2
router.get('/:uuid', cart.getDataCartByUUID);

// POST localhost:8080/cart/add => Tambah data cart ke database
router.post('/add', cart.addDataCart);

// POST localhost:8080/cart/2 => Edit data cart
router.post('/edit/:uuid', cart.editDataCart);

// POST localhost:8080/cart/delete => Delete data cart
router.post('/delete/:uuid', cart.deleteDataCart);

module.exports = router;