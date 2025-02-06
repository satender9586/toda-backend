const Bin = require("../models/noteBinModal.js")
const Note = require("../models/notesModal.js");
const User = require("../models/userRegister.js");


//-----------------------------------Add Notes Function----------------------------------------- 
const addNote = async (req, res) => {
    const { user, noteTitle, description, noteColor, isPriority } = req.body;

    try {

        if (!user) {
            return res.status(400).json({ success: false, message: "User ID is missing!" });
        }
        if (!noteTitle) {
            return res.status(400).json({ success: false, message: "Note title is missing!" });
        }
        if (!description) {
            return res.status(400).json({ success: false, message: "Description is missing!" });
        }


        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(400).json({ success: false, message: `User does not exist: ${user}` });
        }


        const note = new Note({ user, noteTitle, description, noteColor, isPriority });
        await note.save();


        return res.status(201).json({ success: true, message: "Note created successfully", note: note });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};


//-----------------------------------GET All Notes Function----------------------------------------- 
const getAllNotes = async (req, res) => {
    const userId = req.params.id ;
    try {
        if (!userId) {
            return res.status(404).json({ success: false, message: "User id is missing!" })
        }

        const notes = await Note.find({ user: userId }).lean();

        if (!notes || notes.length === 0) {
            return res.status(404).json({ success: false, message: "No notes found for this user", notes });
        }

        res.status(200).json({ userId, notes });
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

//-----------------------------------GET Single Notes Function----------------------------------------- 
const getSingleNote = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            return res.status(404).json({ success: false, message: "id is missing!" });
        }

        const note = await Note.findOne({ _id: id })

        if (!note) {
            return res.status(404).json({ success: false, message: "note not found" });
        }


        const safeNote = JSON.parse(JSON.stringify(note));

        return res.status(200).json({ success: true, message: "note found successfully", note: safeNote });

    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

//-----------------------------------Delete Notes And Move To Bin Function----------------------------------------- 
const deleteNote = async (req, res) => {
    const id = req.params.id;

    try {
        if (!id) {
            return res.status(404).json({ success: false, message: "Id is missing!" });
        }

        const isNoteExists = await Note.findOneAndDelete({ _id: id });

        if (!isNoteExists) {
            return res.status(404).json({ success: false, message: "Note does not exist" });
        }

        const { _id, user, noteTitle, description, isPriority, noteColor, isArchive, createdAt, updatedAt } = isNoteExists;


        const notes = new Bin({
            originalNoteId: _id,
            user,
            noteTitle,
            description,
            isPriority,
            noteColor,
            isArchive,
            createdAt,
            updatedAt
        });

        await notes.save();

        if (!notes) {
            return res.status(400).json({ success: false, message: "Save this is wrong in delete api" })
        }

        return res.status(200).json({ notes });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

//-----------------------------------Delete Notes And Move To Bin Function----------------------------------------- 

const getBinItemsByUserId = async (req, res) => {
    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is missing!" });
        }
        const notes = await Bin.find({ user: id });


        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: "No bin items found for this user", notes });
        }


        return res.status(200).json({ success: true, notes });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//-----------------------------------Delete Permanet Bin Note Function----------------------------------------- 
const deleteBinItem = async (req, res) => {
    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({ success: false, message: "Bin Item ID is missing!" });
        }


        const deletedBinItem = await Bin.findByIdAndDelete({ _id: id });

        if (!deletedBinItem) {
            return res.status(404).json({ success: false, message: "Bin item not found" });
        }


        return res.status(200).json({ success: true, message: "Bin item deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//-----------------------------------Delete All Permanet Bin Note Function----------------------------------------- 

const deleteAllBinItemsForUser = async (req, res) => {
    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is missing!" });
        }


        const deletedItemsCount = await Bin.deleteMany({ user: id });

        if (deletedItemsCount.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No bin items found for this user" });
        }


        return res.status(200).json({ success: true, message: "All bin items deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//----------------------------------- Recover Note Function----------------------------------------- 

const noteRecover = async (req, res) => {
    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({ success: false, message: "Recover Bin Item ID is missing!" });
        }


        const isNoteExists = await Bin.findOneAndDelete({ _id: id });


        if (!isNoteExists) {
            return res.status(404).json({ success: false, message: "Note does not exist in the Bin" });
        }


        const { user, noteTitle, description, isPriority, noteColor, isArchive, createdAt, updatedAt } = isNoteExists;


        const notes = new Note({
            user,
            noteTitle,
            description,
            isPriority,
            noteColor,
            isArchive: false,
            createdAt,
            updatedAt,
        });


        await notes.save();


        return res.status(200).json({ success: true, message: "Note successfully recovered!", notes });
    } catch (error) {
        console.error(error);


        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

//----------------------------------- Recover All Notes Function----------------------------------------- 

const recoverAllBinItems = async (req, res) => {
    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is missing!" });
        }


        const notes = await Bin.find({ user: id });

        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: "No bin items found for this user" });
        }


        const recoveredNotes = [];
        for (const binItem of notes) {
            const { originalNoteId, user, noteTitle, description, isPriority, noteColor, isArchive, createdAt, updatedAt } = binItem;

            const recoveredNote = new Note({
                user,
                noteTitle,
                description,
                isPriority,
                noteColor,
                isArchive,
                createdAt,
                updatedAt,
            });


            await recoveredNote.save();


            await Bin.findByIdAndDelete(notes._id);

            recoveredNotes.push(recoveredNote);
        }

        return res.status(200).json({
            success: true,
            message: "All bin items successfully recovered and moved back to Notes",
            recoveredNotes,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


//-----------------------------------Update Notes Function----------------------------------------- 
const updateNote = async (req, res) => {
    const { _id, noteTitle, description, noteColor, isPriority, isArchive } = req.body;

    try {

        if (!_id) {
            return res.status(400).json({ success: false, message: "Note ID is missing" });
        }


        const finNote = await Note.findOne({ _id }).lean();

        if (!finNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        const updatedNote = await Note.findByIdAndUpdate(_id, { noteTitle, description, noteColor, isPriority, isArchive, updatedAt: Date.now() }, { new: true }).lean();


        return res.status(200).json({ success: true, updatedNote });

    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};

//-----------------------------------Update Notes Function----------------------------------------- 



module.exports = { addNote, getAllNotes, deleteNote, updateNote, getSingleNote, getBinItemsByUserId, deleteBinItem, deleteAllBinItemsForUser, noteRecover, recoverAllBinItems };

