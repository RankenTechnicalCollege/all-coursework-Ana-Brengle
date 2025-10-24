import express from 'express';
const router = express.Router();
import debug from 'debug';
import { addCommentSchema} from '../../validation/bugSchema.js';
import { getBugComments, getCommentsId, addCommentToBug  } from '../../database.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
import { ObjectId } from 'mongodb';
router.use(express.json())

const debugComment = debug('app:CommentRouter');

router.get('/:bugId/comments', async(req,res) => {
   try {
        const id = req.params.bugId;
        const bug = await getBugIds(id);
        
        if(!bug) {
            res.status(400).json({message: 'Bug not found'});
            return;
        }
        
        const comments = await getBugComments(id);
        debugComment(comments);
        if(!comments){
            res.status(400).json({message: 'Bug not found and no comments for this bug.'});
            return;
        }
        res.status(200).json(comments)

    } catch (error){
        console.error("Bug not found and no comments for this bug:", error);
        res.status(500).json({ message: 'Bug not found and no comments for this bug.' });
    }
});

router.get('/:bugId/comments/:commentId', async(req, res) => {
   try {
     const id = req.params.bugId;
     const bug = await getBugIds(id);

    if(!bug) {
        res.status(400).json({message: 'Bug not found'});
        return;
    }
    const commentId = req.params.commentId;
    const comments = await getCommentsId(id, commentId)

    debugComment(comments)

    if(!comments) {
        res.status(400).json({message: 'Bug not found and no comments for this bug.'});
        return;
    }
    res.status(200).json(comments)
   } catch (error){
      console.error("Bug not found and no comments for this bug:", error);
      res.status(500).json({ message: 'Bug not found and no comments for this bug.' });
   } 
});

router.post('/:bugId/comments', validate(addCommentSchema), validId('bugId'),async(req,res) => {
    try {
        const id = req.params.bugId;
        const bug = await getBugIds(id)

        if(!bug) {
             res.status(400).json({message: 'Bug not found'});
            return;
        }
        const newComment = req.body
        const bugAuthor = await getUserById(newComment.authorId)

        if(!bugAuthor) {
            res.status(400).json({message: 'Author not found'});
            return;
        }
        const commentId = new ObjectId();
        const orderedComment = {
            commentId: commentId,
            commentAuthor: {
                id: bugAuthor._id,
                name: bugAuthor.fullName
            },
            text: newComment.text,
            createdOn: new Date(),
         };
    
        
        const addComment = await addCommentToBug(id, orderedComment)
        debugComment(addComment)
         if(addComment.modifiedCount === 1){
            res.status(202).json({message: `Comment added successfully.`})
            return;
        }else {
            res.status(404).json({message: "Error adding a comment to bug."})
        }

    } catch (error){
        console.error("Bug not found and no comments for this bug:", error);
        res.status(500).json({ message: 'Bug not found and no comments for this bug.' });
    }
});
router.use(express.urlencoded({extended: false}));

export {router as commentRouter}
