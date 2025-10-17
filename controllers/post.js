const mongoose = require("mongoose");
const Post = require("../models/Post");
const { errorHandler } = require('../auth');

module.exports.addPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    author_information: req.body.author_information
  });

  newPost.save()
    .then(post => {
      res.status(201).send({
        message: 'Post Added Successfully',
        post: JSON.parse(JSON.stringify(post, [
          '_id',
          'title',
          'content',
          'author_information',
          'creationAdded'
        ]))
      });
    })

    .catch(error => errorHandler(error, req, res));
};

module.exports.updatePost = (req, res) => {

    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        author_information: req.body.author_information
    };

    Post.findByIdAndUpdate(req.params.postId, updatedPost, { new: true, runValidators: true })
    .then(post => {

        if (post) {

            res.status(200).send({
                message: "Post Updated Successfully",
                updatedPost: JSON.parse(JSON.stringify(post, [
                    '_id',
                    'title',
                    'content',
                    'author_information',
                    'creationAdded'
                ]))
            });

        } else {
            res.status(404).send({ message: "Post not found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      if (post.author_information !== userId && !isAdmin) {
        return res.status(403).send({ message: "Unauthorized to delete this post" });
      }

      return Post.findByIdAndDelete(postId);
    })
    .then(deleted => {
      if (deleted) {
        return res.status(200).send({ message: "Post deleted successfully" });
      }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllPosts = (req, res) => {
  Post.find({})
    .then(posts => {
      if (posts.length > 0) {
        const cleanPosts = posts.map(post => {
          const formattedComments = post.comments.map(comment =>
            JSON.parse(JSON.stringify(comment, ['_id', 'userId', 'comment']))
          );

          return JSON.parse(JSON.stringify({
            _id: post._id,
            title: post.title,
            content: post.content,
            author_information: post.author_information,
            creationAdded: post.creationAdded,
            comments: formattedComments
          }));
        });

        return res.status(200).send({ posts: cleanPosts });
      } else {
        return res.status(200).send({ message: 'No posts found.' });
      }
    })
    .catch(error => errorHandler(error, req, res));
};



module.exports.getMovieById = (req, res) => {

    Post.findById(req.params.postId)
    .then(post => {

        if (post) {

            return res.status(200).send(post);

        } else {
            return res.status(404).json({ message: 'Post not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.addPostComment = (req, res) => {
    
    const userId = req.user?.id;
    const postId = req.params.postId;
    const comment = req.body.comment;

    if (!comment || comment.trim() === "") {
        return res.status(400).send({ error: "Comment is required." });
    }

    Post.findById(postId)
    .then(post => {
        if (!post) {
            return res.status(404).send({ error: "Post not found." });
        }

        post.comments.push({
            userId: userId,
            comment: comment
        });

        return post.save();
    })
    .then(updatedPost => {
        return res.status(200).send({
            message: "Comment Added Successfully.",
            Post: updatedPost
        });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getPostComment = (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {

      if (!post) {

        return res.status(404).send({ error: "Post not found." });

      }

      const formattedComments = post.comments.map(comment =>
        JSON.parse(JSON.stringify(comment, [
          '_id',
          'comment'
        ]))
      );

      return res.status(200).send({ comments: formattedComments });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      const commentIndex = post.comments.findIndex(
        comment => comment._id.toString() === commentId
      );

      if (commentIndex === -1) {
        return res.status(404).send({ message: "Comment not found" });
      }

      post.comments.splice(commentIndex, 1);

      return post.save();
    })
    .then(() => {
      return res.status(200).send({ message: "Comment Deleted Successfully" });
    })
    .catch(error => errorHandler(error, req, res));
};
