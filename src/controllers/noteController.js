const noteModel = require("../models/note");
const crypto = require("crypto");

const secretKey = 'abcdefghijklmnop'; // 16 bytes for AES-128

function decryptString(encryptedText, secretKey) {
    const key = Buffer.from(secretKey, 'utf8');
    const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptString(plainText, secretKey) {
    const key = Buffer.from(secretKey, 'utf8');
    const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

const createNote = async (req, res) =>{
    
    const {title, description} = req.body;

    const newNote = new noteModel({
        title: title,
        description : description,
        userId : req.userId
    });

    try {
        
        await newNote.save();
        res.status(201).json(newNote);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
    
}

const updateNote = async (req, res) =>{
    const id = req.params.id;
    const {title, description} = req.body;

    const newNote = {
        title : title,
        description: description,
        userId : req.userId
    }

    try {
        await noteModel.findByIdAndUpdate(id, newNote, {new : true});
        res.status(200).json(newNote);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

const deleteNote = async (req, res) =>{

    const id = req.params.id;
    try {
        
        const note = await noteModel.findByIdAndRemove(id);
        res.status(202).json(note);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const getNotes = async (req, res) =>{
    try {
        
        const notes = await noteModel.find({userId : req.userId});
        res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const createDecryptedNote = async (req, res) => {
    const { androidId, data } = req.body;
    if (!androidId || !data) {
        return res.status(400).json({ message: 'androidId and data are required' });
    }
    try {
        const decryptedDescription = decryptString(data, secretKey);
        const newNote = new noteModel({
            title: androidId,
            description: decryptedDescription,
            userId: '000000000000000000000000',
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Decryption or save error:', error);
        console.error('androidId:', androidId);
        console.error('data:', data);
        res.status(500).json({ message: 'Failed to decrypt or save note', error: error.message });
    }
};

const encryptNoteData = (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ message: 'data is required' });
    }
    try {
        const encrypted = encryptString(data, secretKey);
        res.status(200).json({ encrypted });
    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({ message: 'Failed to encrypt data', error: error.message });
    }
};

module.exports = {
    createNote,
    updateNote,
    deleteNote,
    getNotes,
    createDecryptedNote,
    encryptNoteData
}