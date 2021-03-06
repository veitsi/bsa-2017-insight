import React from 'react';
import propTypes from 'prop-types';
import styles from './styles.scss';

export default class Wallpapers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
    };
    this.changeBackground = this.changeBackground.bind(this);
  }

  componentDidMount() {
    if (!this.state.active) return;
    const arr = this.state.active && this.state.active.split('/');
    const name = arr[arr.length - 1];
    document.getElementById(name).style.border = '2px solid #000';
  }

  changeBackground(e) {
    const arr = this.state.active && this.state.active.split('/');
    const name = arr[arr.length - 1];
    if (e.target.id === this.state.active) return;
    document.getElementById(name).style.border = '1px solid #c9d7df';
    e.target.style.border = '2px solid #000';
    this.setState({ active: e.target.id });
    this.props.set('backgroundImage', `resources/wallpapers/${e.target.id}`);
  }

  render() {
    return (
      <div className={'wallpapers'}>
        <h5 className={styles['wallpapers-title']}>Choose background image</h5>
        <div
          role="presentation"
          className={'wallpaper'}
          id={'w1'}
          onClick={this.changeBackground}
          style={{ backgroundColor: '#fff' }}
        />
        <div
          role="presentation"
          className={'wallpaper'}
          id={'w2'}
          onClick={this.changeBackground}
          style={{ backgroundImage: 'url(resources/wallpapers/w2.png)' }}
        />
        <div
          role="presentation"
          className={'wallpaper'}
          id={'w3'}
          onClick={this.changeBackground}
          style={{ backgroundImage: 'url(resources/wallpapers/w3.png)' }}
        />
        <div
          role="presentation"
          className={'wallpaper'}
          id={'w4'}
          onClick={this.changeBackground}
          style={{ backgroundImage: 'url(resources/wallpapers/w4.png)' }}
        />
        <div
          role="presentation"
          className={'wallpaper'}
          id={'w5'}
          onClick={this.changeBackground}
          style={{ backgroundImage: 'url(resources/wallpapers/w5.png)' }}
        />
      </div>
    );
  }
}

Wallpapers.propTypes = {
  active: propTypes.string,
  set: propTypes.func,
};
