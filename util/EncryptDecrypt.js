const crypto = require('crypto');
require("dotenv").config();
const ENCRYPT_KEY = process.env.ENCRYPT_KEY

module.exports.encrypt = async (data) => {
    const iv = crypto.randomBytes(16);          // Generate a random Initialization Vector (IV)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPT_KEY), iv);     // Create a Cipher object using AES-256-CBC, the private key, and the IV
    let encrypted = cipher.update(data);            // Encrypt the data (in parts if needed)
    encrypted = Buffer.concat([encrypted, cipher.final()]);     // Finalize encryption and combine the results into one Buffer
    return iv.toString('hex') + '-' + encrypted.toString('hex');    // Return the IV and the encrypted data as a single string
};

module.exports.decrypt = async (data) => {
    const textParts = data.split('-');          // Split the input string into the IV and the encrypted data
    const iv = Buffer.from(textParts.shift(), 'hex');       // Extract and convert the IV back to a Buffer
    const encryptedText = Buffer.from(textParts.join('-'), 'hex');      // Convert the remaining part (encrypted data) back to a Buffer
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPT_KEY), iv);       // Create a Decipher object using the same algorithm, key, and IV
    let decrypted = decipher.update(encryptedText);         // Decrypt the data (in parts if needed)
    decrypted = Buffer.concat([decrypted, decipher.final()]);       // Finalize decryption and combine the results into one Buffer
    return decrypted.toString();        // Convert the decrypted data to a string and return it
};