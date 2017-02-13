var crypto = require('crypto');
var 
cryptkey   = crypto.createHash('sha256').update('__tazai_wolf__key').digest(),
iv         = '1234567890000000';

function decode( secretdata) {
    var 
    decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
    decoded  = decipher.update(secretdata, 'base64', 'utf8');
    
    decoded += decipher.final( 'utf8' );
    return decoded;
}

function encode( cleardata) {
    var 
    encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
    encoded  = encipher.update(cleardata, 'utf8', 'base64');

    encoded += encipher.final( 'base64' );
    return encoded;
}

module.exports = {
    encode: encode,
    decode: decode
}