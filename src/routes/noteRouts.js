const express = require("express")
const router =  express.Router();
const {addNote,getAllNotes,deleteNote,updateNote,getSingleNote,getBinItemsByUserId,deleteBinItem, deleteAllBinItemsForUser,noteRecover,recoverAllBinItems} = require("../controller/notecontroller.js")

router.post("/add-note",addNote)
router.get("/get-all-notes/:id",getAllNotes)
router.get("/get-single-notes/:id",getSingleNote)
router.delete("/delete-note/:id",deleteNote)
router.get("/bin-notes/:id",getBinItemsByUserId)
router.delete("/pemanent-delete/:id",deleteBinItem)
router.delete("/pemanentall-delete/:id",deleteAllBinItemsForUser)
router.get("/note-recover/:id",noteRecover)
router.get("/allnote-recover/:id",recoverAllBinItems)
router.put("/update-note",updateNote)


module.exports = router;