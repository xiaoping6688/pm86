
var crypto = require('crypto');
var Cipher = module.exports = {};

const CIPHER_ALGORITHM = 'aes256';

/**
 * Description
 * @method decipherMessage
 * @param {} msg
 * @return ret
 */

Cipher.decipherMessage = function (msg, key) {
    var ret = {};

    try {
        var decipher = crypto.createDecipher(CIPHER_ALGORITHM, key);
        var decipheredMessage = decipher.update(msg, 'hex', 'binary');
        decipheredMessage += decipher.final("binary");
        // console.log(typeof decipheredMessage);
        // preserve newlines, etc - use valid JSON
        decipheredMessage = decipheredMessage.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        decipheredMessage = decipheredMessage.replace(/[\u0000-\u0019]+/g, "");
        ret = JSON.parse(decipheredMessage);
    } catch (e) {
        console.log('------------------------------------');
        console.log(e);
        console.log('------------------------------------');
        return null;
    }

    return ret;
}

/**
 * Description
 * @method cipherMessage
 * @param {} data
 * @param {} key
 * @return
 */

Cipher.cipherMessage = function (data, key) {
    try {
        var cipher = crypto.createCipher(CIPHER_ALGORITHM, key);
        var cipheredData = cipher.update(data, "binary", "hex");
        cipheredData += cipher.final("hex");
        return cipheredData;
    } catch (e) {
        return null;
    }
}
