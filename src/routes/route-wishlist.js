const router = require('express').Router();
const { wishlist } = require('../controllers');

// GET localhost:8080/wishlist => Ambil data semua wishlist
router.get('/', wishlist.getDataWishlist);

// GET localhost:8080/wishlist/2 => Ambil data semua wishlist berdasarkan uuid = 2
router.get('/:uuid', wishlist.getDataWishlistByUUID);

// POST localhost:8080/wishlist/add => Tambah data wishlist ke database
router.post('/add', wishlist.addDataWishlist);

// POST localhost:8080/wishlist/2 => Edit data wishlist
router.post('/edit/:uuid', wishlist.editDataWishlist);

// POST localhost:8080/wishlist/delete => Delete data wishlist
router.post('/delete/:uuid', wishlist.deleteDataWishlist);

module.exports = router;