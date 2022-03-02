const mongoose = require('mongoose')

const favoriteSongs = mongoose.model('favoriteSongs', {
    songName: String,
    artist: String,
    album: String,
    favoriteId: String

})

module.exports = favoriteSongs