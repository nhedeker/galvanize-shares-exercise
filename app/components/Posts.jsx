import Post from 'components/Post.jsx';
import PostForm from 'components/PostForm.jsx';
import React from 'react';
import weakKey from 'weak-key';

// weak key helps when you are adding things ANYWHERE in a collection
// if did key alone it would only work with additions to END of collection

const Posts = React.createClass({
  render() {
    let { posts } = this.props;

    if (this.props.params.topic) {
      posts = posts.filter((post) => post.topic === this.props.params.topic);
    }

    posts = posts.sort((post1, post2) => post1.votes < post2.votes);

    return <main>
    {posts.map((post) => {
      if (this.props.editing === post) {
        return <PostForm
          key={weakKey(post)}
          post={post}
          stopEditingPost={this.props.stopEditingPost}
          updatePost={this.props.updatePost}
        />;
      }

      return <Post
        decrementVotes={this.props.decrementVotes}
        incrementVotes={this.props.incrementVotes}
        key={weakKey(post)}
        post={post}
      />;
    })}
    </main>;
  }
});

export default Posts;
