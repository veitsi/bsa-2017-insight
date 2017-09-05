import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { SketchPicker } from 'react-color';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ChatLayout from './ChatLayout';
import Wallpapers from './Wallpapers';
import ForceMessage from './ForceMessage';
import styles from './styles.scss';

class WidgetSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'appearance',
      settings: this.getSettings(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.setSettings = this.setSettings.bind(this);
    this.save = this.save.bind(this);
  }

  setSettings(option, value) {
    const newSettings = { ...this.state.settings, [option]: value };
    this.setState({ settings: newSettings });
  }

  getSettings() {
    fetch('/api/widgets/localhost3000', { credentials: 'include', method: 'GET' })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.setState({
          settings: response.options,
        });
      });
  }
  save() {
    this.setState({ info: 'Saving...' });
    const dataToSend = {
      website: 'localhost3000',
      options: this.state.settings,
    };
    fetch('/api/widgets/localhost3000', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(dataToSend),
      credentials: 'include',
    }).then((response) => {
      return response.json();
    }).then((response) => {
      if (response) {
        this.setState({ info: response.text });
      }
    });
  }
  handleChange(value) {
    this.setState({
      activeTab: value,
    });
  }

  render() {
    if (!this.state.settings) return <h3 style={{ textAlign: 'center' }}>Loading...</h3>;

    return (
      <div className={styles['settings-content-wrapper']}>
        <div className={styles['navigation-tabs-wrapper']}>
          <div>
            <RaisedButton
              label="Save"
              primary
              onClick={this.save}
              style={{ margin: '15px' }}
            /> {this.state.info}
          </div>
          <Tabs
            value={this.state.activeTab}
            onChange={this.handleChange}
          >
            <Tab label="Customize appearance" value="appearance">
              <div>
                <h3 className={styles['customize-title']}>Customize appearance</h3>
                <p className={styles['customize-text']}>Customize your Messenger’s color to suit your app or site, then choose a background wallpaper.</p>
                <div className={styles['settings-wrapper']}>
                  <div className={styles['chat-settings']}>
                    <SketchPicker color={this.state.settings.primaryColor} onChange={color => this.setSettings('primaryColor', color.hex)} />
                    <Wallpapers set={this.setSettings} active={this.state.settings.backgroundImage} />
                    <h5>Widget position:</h5>
                    <SelectField
                      value={this.state.settings.widgetPosition}
                      onChange={(event, index, value) => this.setSettings('widgetPosition', value)}
                    >
                      <MenuItem value={'right'} primaryText="right" />
                      <MenuItem value={'left'} primaryText="left" />
                    </SelectField>
                  </div>
                  <ChatLayout settings={this.state.settings} />
                </div>
              </div>
            </Tab>
            <Tab label="Force message" value="localize">
              <div className={styles['force-content-wrapper']}>
                <ForceMessage set={this.setSettings} settings={this.state.settings} />
                <ChatLayout settings={this.state.settings} />
              </div>
            </Tab>
            <Tab label="Install the Messenger" value="install">
              <h2>Install the Messenger</h2>
              <p>You’ll need to add a bit of code or configure an integration to see the
              Insight Messenger appear on your website or app.</p>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default WidgetSettings;
