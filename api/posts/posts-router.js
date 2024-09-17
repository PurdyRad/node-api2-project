// implement your posts router here
const express = require('express');
const route = express.Router();

const Post = require('./posts-model');

//GET
route.get('/', (req,res) => {
    Post.find(req)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.error('Geterr', err)
        res.status(500).json({message:"The posts information could not be retrieved" })
    });
});

//GET ID
route.get('/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(posts => {
        if(posts){
        res.status(200).json(posts)
    } else {
        res.status(404).json({message: "The post with the specified ID does not exist"})
    }
    })
    .catch(err => {
        console.error('Geterr', err)
        res.status(500).json({message:"The posts information could not be retrieved" })
    });
});

//POST
route.post('/', (req,res) => {
    console.log('req.body:', req.body)
    const newPost = req.body;
    if(!newPost.title || !newPost.contents){
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        Post.insert(newPost)   
        .then(post => {
            const id = post.id;
            return Post.findById(id)
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            console.error('Posterr', err)
            res.status(500).json({message:"There was an error while saving the post to the database." })
        });
}});

//PUT
route.put('/:id', (req,res) => {
    const id = req.params.id;
    const updatedPost = req.body;
    if(!updatedPost.title || !updatedPost.contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.findById(id)   
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                })
            } else {
               return Post.update(id, updatedPost)
            }
        })
        .then(data => {
            if (data) {
                return Post.findById(id)
            }
        })
        .then(post => {
            if(post){
                res.json(post)
            }
        })
        .catch(err => {
            console.error('Posterr', err)
            res.status(500).json({message:"There was an error while saving the post to the database." })
        });
}});

//DELETE
route.delete('/:id', async (req,res) => {
   try{
    const post = await Post.findById(req.params.id)
    if(!post){
        res.status(404).json({message: 'The post with the specified ID does not exist.'})
    }
    else {
        await Post.remove(req.params.id)
        res.json(post)
    }
   } catch(err) {
    console.error('Geterr', err)
    res.status(500).json({message:"The posts could not be deleted" })
    }
});

//GET COMMENT
route.get('/:id/comments', async (req,res) => {
    try{
    const id = req.params.id;
    const post = await Post.findById(id)
    if(!post){
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else{
        const comments = await Post.findPostComments(id)
        res.json(comments)
    }}
    catch(err) {
        console.error('Geterr', err)
        res.status(500).json({message:"The comments information could not be retrieved" })
    }
}
);

module.exports = route;