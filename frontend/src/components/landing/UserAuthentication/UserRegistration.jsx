import React from 'react';
import isLength from 'validator/lib/isLength';
import equals from 'validator/lib/equals';
import isAfter from 'validator/lib/isAfter';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red800 } from 'material-ui/styles/colors';
import AvatarPreview from '../AvatarPreview/AvatarPreview';
import styles from './styles.scss';

const muiTheme = getMuiTheme({
  palette: {
    textColor: red800,
  },
  appBar: {
    height: 50,
  },
});

class UserRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      formValues: {
        firstName: '',
        lastName: '',
        userName: '',
        password1: '',
        password2: '',
        birstday: '',
      },
    };

    this.sendForm = this.sendForm.bind(this);
    this.loadPreview = this.loadPreview.bind(this);
    this.updateImage = this.updateImage.bind(this);
  }

  formValuesSaver(field, filledField) {
    this.setState({
      formValues: Object.assign(this.state.formValues, {
        [field]: filledField.value.toString(),
      }),
    });
  }

  formValidator() {
    const errors = [];
    // First name's length > 2
    if (!isLength(this.state.formValues.firstName, { min: 2 })) {
      errors.push('First name should be longer than 2 symbols');
    }
    // Last name's length > 2
    if (!isLength(this.state.formValues.lastName, { min: 2 })) {
      errors.push('Last name should be longer than 2 symbols');
    }
    // Username's length > 3 && < 15
    if (!isLength(this.state.formValues.userName, { min: 3, max: 15 })) {
      errors.push('Username should be from 3 to 15 symbols long');
    }
    // Matching of password field values
    if (!equals(this.state.formValues.password2, this.state.formValues.password1)) {
      errors.push('Passwords don\'t match');
    }
    // Password's length > 6
    if (!isLength(this.state.formValues.password2, { min: 6, max: 30 })) {
      errors.push('Password should be from 6 to 30 symbols long');
    }
    // Passsword containing a letter and a digit
    if (!/[a-z]/i.test(this.state.formValues.password2)
        || !/\d/.test(this.state.formValues.password2)) {
      errors.push('Password should contain both letters and digits');
    }
    // Birstday is not in the future
    if (isAfter(this.state.formValues.birstday)) {
      errors.push('Are you sure that you were born in future?');
    }
    return errors;
  }

  sendForm(e) {
    e.preventDefault();
    e.persist();
    this.setState({ info: this.formValidator() }, () => {
      if (this.state.info.length) return;
      const formData = new FormData(e.target);
      formData.set('avatar', this.state.image);
      fetch(`${window._injectedData.insightHost}/api/user/registration/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }).then((response) => {
        if (response.redirected) return window.location.replace(response.url);
        return response.json();
      }).then((response) => {
        if (response) {
          this.setState({ info: [response.text] });
        }
      });
    });
  }

  loadPreview(e) {
    this.setState({ image: e.target.files[0] });
  }

  updateImage(newImage) {
    this.setState({ image: newImage });
  }

  render() {
    return (
      <div className={styles['login-form']}>
        <h3>User registration</h3>
        <hr />
        <form
          onSubmit={this.sendForm}
          encType="multipart/form-data"
        >
          <div className={styles['get-data']}>
            <span>Username</span>
            <input
              type="text"
              name="username"
              required
              onChange={e => this.formValuesSaver('userName', e.target)}
            />
          </div>
          <div className={styles['get-data']}>
            <span>First Name</span>
            <input
              type="text"
              name="firstName"
              required
              onChange={e => this.formValuesSaver('firstName', e.target)}
            />
          </div>
          <div className={styles['get-data']}>
            <span>Last Name</span>
            <input
              type="text"
              name="lastName"
              required
              onChange={e => this.formValuesSaver('lastName', e.target)}
            />
          </div>
          <div className={styles['get-data']}>
            <span>Date of birth</span>
            <input
              type="date"
              name="dateOfBirth"
              required
              onChange={e => this.formValuesSaver('birstday', e.target)}
              pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div className={styles['get-data']}>
            <span>Email</span>
            <input type="email" name="email" required />
          </div>
          <div className={styles['get-data']}>
            <span>Password</span>
            <input
              type="password"
              name="firstPassword"
              required
              onChange={e => this.formValuesSaver('password1', e.target)}
            />
          </div>
          <div className={styles['get-data']}>
            <span>Confirm password</span>
            <input
              type="password"
              name="secondPassword"
              required
              onChange={e => this.formValuesSaver('password2', e.target)}
            />
          </div>
          <div className={styles['get-data']}>
            <span>Company</span>
            <input type="text" name="company" required />
          </div>
          <div className={styles['get-data']}>
            <span>Avatar</span>
            <div><input type={'file'} name={'avatar'} onChange={this.loadPreview} /></div>
          </div>
          <br />
          <div className={styles['avatar-preview']}>
            <MuiThemeProvider muiTheme={muiTheme}>
              <AvatarPreview image={this.state.image} update={this.updateImage} />
            </MuiThemeProvider>
          </div>
          <br />
          <button type="submit">Sign Up</button>
        </form>
        <br />
        <div className={styles['error-message']}>
          {this.state.info.map((err) => {
            return (<span key={err}>{err}<br /></span>);
          })}
        </div>
      </div>
    );
  }
}

export default UserRegistration;
