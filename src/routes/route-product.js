const router = require('express').Router();
const { product } = require('../controllers');

// GET localhost:8080/product => Ambil data semua product
router.get('/', product.getDataProduct);

// GET localhost:8080/product/2 => Ambil data semua product berdasarkan uuid = 2
router.get('/:uuid', product.getDataProductByUUID);

// POST localhost:8080/product/add => Tambah data product ke database
router.post('/add', product.addDataProduct);

// POST localhost:8080/product/2 => Edit data product
router.post('/edit/:uuid', product.editDataProduct);

// POST localhost:8080/product/delete => Delete data product
router.post('/delete/:uuid', product.deleteDataProduct);

module.exports = router;