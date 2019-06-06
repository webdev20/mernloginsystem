import React, { Component } from "react";
import auths from "./../../auth/user-auth";
import { Link } from "react-router-dom";

class Verify extends Component {
  constructor({ match }) {
    super();
    this.state = {
      emailToken: "",
      useParam: false,
      message: "",
      error: false,
      loading: false
    };
    this.match = match;
  }
  componentWillReceiveProps = props => {
    if (props.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: props.match.params.emailtoken, useParam: true, loading: true });
    }
  };
  componentDidMount = () => {
    if (this.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: this.match.params.emailtoken, useParam: true, loading: true });
    }
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  requestNewCode = e => {
    e.preventDefault();
    // Check if token valid - if not, show submit form to enter email address
    // if email not recorded, ask user to register.
    // Get user's email with the supplied token
    // Create new email token using different salt
    // Update the database record
    // Send to the user's email
    // Hide link
    console.log("Test");
  };

  verifyEmail = () => {
    const data = { emailToken: this.state.emailToken };
    auths.verify(data).then(response => {
      if (response.error && !response.norecord) {
        this.setState({ message: response.error, error: true, loading: false });
      } else if (response.success) {
        this.setState({ message: response.success, error: false, loading: false });
      } else if (response.norecord) {
        this.setState({ message: response.error, error: true, loading: false });
      }
    });
    console.log(this.state.message);
  };

  handleSubmit = e => {
    if (!this.state.useParam) e.preventDefault();
    this.setState({ loading: true });
    this.verifyEmail();
  };

  render() {
    const { emailToken, useParam, message, loading, error, norecord } = { ...this.state };
    emailToken != "" && useParam && message == "" && this.verifyEmail();

    return (
      <div>
        {loading && "progress indicator"}
        {message != "" && message}
        {!useParam && (
          <form onSubmit={this.handleSubmit} noValidate>
            <label htmlFor="emailToken">Email Token</label>
            <br />
            <input type="text" name="emailToken" id="emailToken" onChange={this.handleChange} />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        )}
        {message.includes("expired!") && (
          <div>
            <Link to="" onClick={this.requestNewCode}>
              Request new verification code
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default Verify;
