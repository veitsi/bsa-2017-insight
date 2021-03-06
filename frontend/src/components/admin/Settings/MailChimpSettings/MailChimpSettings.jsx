import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles.scss';
import { getMailchimpSettings, updateMailchimpSettings } from '../../../../actions/mailchimpSettingsActions';

class MailChimpSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getMailchimpSettings();
  }

  render() {
    return (
      <div>
        <form
          className={styles['mailchimp-settings-form']}
          onSubmit={(e) => {
            e.preventDefault();
            const values = {
              email_type_option: true,
              from_email: document.getElementById('settings-from_email').value || undefined,
              from_name: document.getElementById('settings-from_name').value || undefined,
              language: document.getElementById('settings-language').value || undefined,
              subject: document.getElementById('settings-subject').value || undefined,
              permission_reminder: document.getElementById('settings-permission_reminder').value || undefined,
              country: document.getElementById('settings-country').value || undefined,
              zip: document.getElementById('settings-zip').value || undefined,
              state: document.getElementById('settings-state').value || undefined,
              city: document.getElementById('settings-city').value || undefined,
              address: document.getElementById('settings-address').value || undefined,
              company: document.getElementById('settings-company').value || undefined,
              apiKey: document.getElementById('settings-apiKey').value || undefined,
            };
            this.props.updateMailchimpSettings(values);
          }}
        >
          <h3>Info for MailChimp mailings</h3>
          <TextField
            style={{ width: 500 }}
            floatingLabelText="API key"
            id="settings-apiKey"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.apiKey : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="Company"
            id="settings-company"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.contact.company : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="Address"
            id="settings-address"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.contact.address : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="City"
            id="settings-city"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.contact.city : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="State"
            id="settings-state"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.contact.state : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="ZIP"
            id="settings-zip"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.contact.zip : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="Country"
            id="settings-country"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.contact.country : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="Permission reminder"
            id="settings-permission_reminder"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.permission_reminder : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="Language"
            id="settings-language"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.campaign_defaults.language : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="Subject"
            id="settings-subject"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.campaign_defaults.subject : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="From email"
            id="settings-from_email"
            type="email"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.campaign_defaults.from_email : ''}`}
          /><br />
          <TextField
            style={{ width: 500 }}
            floatingLabelText="From name"
            id="settings-from_name"
            hintText={`currently: ${this.props.mailChimpSettings ? this.props.mailChimpSettings.campaign_defaults.from_name : ''}`}
          /><br />
          <br />
          <br />
          <RaisedButton
            label="Update"
            primary
            type="submit"
          />
        </form>
      </div>
    );
  }
}

MailChimpSettings.propTypes = {
  getMailchimpSettings: PropTypes.func,
  updateMailchimpSettings: PropTypes.func,
  mailChimpSettings: PropTypes.shape({
    campaign_defaults: PropTypes.shape({
      from_email: PropTypes.string,
      subject: PropTypes.string,
      from_name: PropTypes.string,
      language: PropTypes.string,
    }),
    contact: PropTypes.shape({
      country: PropTypes.string,
      zip: PropTypes.string,
      state: PropTypes.string,
      city: PropTypes.string,
      address: PropTypes.string,
      company: PropTypes.string,
    }),
    apiKey: PropTypes.string,
    permission_reminder: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  return {
    mailChimpSettings: state.mailchimpSettings.mailchimpSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMailchimpSettings: () => dispatch(getMailchimpSettings()),
    updateMailchimpSettings: body => dispatch(updateMailchimpSettings(body)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MailChimpSettings);
