const router = require('express').Router();
const { order } = require('../controllers');

// GET localhost:8080/order => Ambil data semua order
router.get('/', order.getDataOrder);

// GET localhost:8080/order => Ambil data semua order
router.get('/Filtered', order.getDataOrderFiltered);

// GET localhost:8080/order/2 => Ambil data semua order berdasarkan uuid = 2
router.get('/user/:uuid', order.getDataOrderByUserUUID);

// GET localhost:8080/order/2 => Ambil data semua order berdasarkan uuid = 2
router.get('/:uuid', order.getDataOrderByUUID);

// POST localhost:8080/order/add => Tambah data order ke database
router.post('/add', order.addDataOrder);

// POST localhost:8080/order/2 => Edit data order
router.post('/edit/:uuid', order.editDataOrder);

// POST localhost:8080/order/delete => Delete data order
router.post('/delete/:uuid', order.deleteDataOrder);

module.exports = router;