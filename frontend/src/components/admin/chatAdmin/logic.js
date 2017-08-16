import io from './../../../../../node_modules/socket.io-client/dist/socket.io';
import { fetchMessage } from './../../../actions/conversationsActions';

function startSocketConnection(dispatch) {
  const id = window._injectedData.userId._id;
  this.socket = io('http://localhost:3000');
  const userObj = {
    type: 'Admin',
    id,
  };
  this.socket.emit('userId', userObj);
  this.socket.on('adminData', (data) => {
    console.log(data);
    // dispatch(fetchUser(data));
  });
  this.socket.on('newMessage', (message) => {
    dispatch(fetchMessage(message));
  });
}

export {
  startSocketConnection,
};
