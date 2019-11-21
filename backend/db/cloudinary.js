const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'stanyke',
    api_key: '266692742632742',
    api_secret: '5BP0_SphrlL0cSsG8IjGgyvpj6w'
});

console.log("***** ***** Cloudinary Connected ***** *****");

module.exports = cloudinary;