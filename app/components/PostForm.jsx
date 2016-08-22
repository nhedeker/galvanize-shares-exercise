import AssignmentReturned from
  'material-ui/svg-icons/action/assignment-returned';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import Joi from 'joi';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';

const schema = Joi.object({
  title: Joi.string().trim().max(255),
  topic: Joi.string().trim().max(50),
  url: Joi.string().trim().uri({ scheme: /^https?/ })
});

const PostForm = React.createClass({
  getInitialState() {
    return {
      post: this.props.post,
      errors: {}
    };
  },

  handleBlur(event) {
    const { name, value } = event.target;
    const nextErrors = Object.assign({}, this.state.errors);
    const result = Joi.validate({ [name]: value }, schema);

    // result.error is {} (or null if no error)
    // result.value is "converted" user input (ie from trim())

    if (result.error) {
      // invalid input
      for (const detail of result.error.details) {
        // detail.path is the title of the scheme (ie title, url, or topic)
        nextErrors[detail.path] = detail.message;
      }

      return this.setState({ errors: nextErrors });
    }

    // valid input
    delete nextErrors[name];

    this.setState({ errors: nextErrors });
  },

  handleChange(event) {
    const nextPost = Object.assign({}, this.state.post, {
      // [] object literal syntax - knows to evaluate to a key
      [event.target.name]: event.target.value
    });

    this.setState({ post: nextPost });
  },

  handleTouchTapCancel() {
    this.props.stopEditingPost(this.props.post);
  },

  handleTouchTapSave() {
    const result = Joi.validate(this.state.post, schema, {
      // making sure joi doesn't => abort at first error and ignores rest
      abortEarly: false,

      // if you have key value pairs not part of schema must allowUnknown
      // ie votes and user
      allowUnknown: true
    });

    if (result.error) {
      // invalid input
      const nextErrors = {};

      for (const detail of result.error.details) {
        // detail.path is the title of the scheme (ie title, url, or topic)
        nextErrors[detail.path] = detail.message;
      }

      return this.setState({ errors: nextErrors });
    }

    // result.value is same thing now as this.state.post but with nice trimming
    const nextPost = Object.assign({}, result.value, { votes: 1 });

    this.props.updatePost(this.props.post, nextPost);
  },

  render() {
    const styleRaisedButton = {
      marginRight: '10px',
      marginTop: '40px'
    };

    const styleTextField = {
      // fixes saving error
      display: 'block'
    };

    const { post, errors } = this.state;

    return <Paper className="paper">
      <h3>New Post</h3>

      <TextField
        errorText={errors.url}
        floatingLabelText="url"
        fullWidth={true}
        name="url"
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        style={styleTextField}
        value={post.url}
      />

      <TextField
        errorText={errors.title}
        floatingLabelText="title"
        fullWidth={true}
        name="title"
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        style={styleTextField}
        value={post.title}
      />

      <TextField
        errorText={errors.topic}
        floatingLabelText="topic"
        fullWidth={true}
        name="topic"
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        style={styleTextField}
        value={post.topic}
      />

      <RaisedButton
        icon={<Cancel />}
        label="Cancel"
        onTouchTap={this.handleTouchTapCancel}
        primary={true}
        style={styleRaisedButton}
      />

      <RaisedButton
        icon={<AssignmentReturned />}
        label="Save"
        onTouchTap={this.handleTouchTapSave}
        primary={true}
        style={styleRaisedButton}
      />
    </Paper>;
  }
});

export default PostForm;
