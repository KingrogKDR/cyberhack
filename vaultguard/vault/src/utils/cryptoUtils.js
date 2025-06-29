import crypto from "crypto"

export const encryptFields = (data) => {
    const encrypted = {}
    const keys = {}

    for (const [field, value] of Object.entries(data)) {
        const key = crypto.randomBytes(32)
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
        let encryptedField = cipher.update(value.toString(), 'utf-8', 'hex')
        encryptedField += cipher.final('hex')

        encrypted[field] = { iv: iv.toString('hex'), value: encryptedField }
        keys[field] = key.toString('hex')
    }

    return { encrypted, keys }
}

export const decryptFields = (encrypted, keyHex, ivHex) => {
    const key = Buffer.from(keyHex, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
}
