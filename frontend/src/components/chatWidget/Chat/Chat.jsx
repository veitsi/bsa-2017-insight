import React, { Component } from 'react';
import propTypes from 'prop-types';
import styles from './styles.scss';
import io from './../../../../../node_modules/socket.io-client/dist/socket.io';
import ConversationsList from './../ConversationsList/ConversationsList';
import ChatBody from './../ChatBody/ChatBody';
import { findItemById, startSocketConnection } from './logic';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChatId: null,
      conversations: [],
    };
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.onConversationClick = this.onConversationClick.bind(this);
    this.onReturnButtonClick = this.onReturnButtonClick.bind(this);
    this.onCreateConversationButtonClick = this.onCreateConversationButtonClick.bind(this);
    this.onForceConversation = this.onForceConversation.bind(this);
  }

  componentDidMount() {
    this.socket = io('http://localhost:3000');
    const id = window._injectedData.anonymousId || window._injectedData.userId._id;
    this.socket.emit('getUserConversations', id);
    startSocketConnection.call(this, this.socket);
  }
  onForceConversation() {
    const userId = window._injectedData.anonymousId || window._injectedData.userId._id;
    const conversation = {
      participants: [{
        userType: 'User',
        user: userId,
      }],
      messages: [],
      open: true,
      createdAt: Date.now(),
    };
    this.socket.emit('createForceConversation', conversation, userId);
  }
  onCreateConversationButtonClick() {
    const userId = window._injectedData.anonymousId || window._injectedData.userId._id;
    const conversation = {
      participants: [{
        userType: 'User',
        user: userId,
      }],
      messages: [],
      open: true,
      createdAt: Date.now(),
    };
    this.socket.emit('createNewConversation', conversation, userId);
  }

  onConversationClick(id) {
    this.socket.emit('switchRoom', id);
    this.setState({ activeChatId: id });
  }

  onReturnButtonClick() {
    const id = window._injectedData.anonymousId || window._injectedData.userId._id;
    this.props.forceWillBeFalse();
    this.socket.emit('getUserConversations', id);
    this.setState({ activeChatId: null });
  }

  onMessageSubmit(event) {
    const userId = window._injectedData.anonymousId || window._injectedData.userId._id;
    event.preventDefault();
    const eventCopy = event;
    const message = event.target.messageInput.value;
    if (message === '') return;
    const messageObj = {
      conversationId: this.state.activeChatId,
      body: message,
      createdAt: Date.now(),
      author: {
        item: userId,
        userType: 'User',
      },
      isReceived: false,
    };
    this.socket.emit('newMessage', messageObj);
    eventCopy.target.messageInput.value = '';
  }

  render() {
    const conversations = this.state.conversations;
    const conversationToRender = conversations.length > 0 ? findItemById(this.state.activeChatId, conversations) : null;
    const messages = conversationToRender ? conversationToRender.item.messages : null;
    return (
      <div className={styles.chat}>
        <img
          alt="close-button"
          src="https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-part-2/512/erase_delete_remove_wipe_out-512.png"
          className={styles['close-button']}
          onClick={this.props.onChatClose}
          role="button"
          tabIndex="0"
        />
        {!this.state.activeChatId && <ConversationsList
          conversations={conversations}
          onConversationClick={this.onConversationClick}
          onCreateConversationButtonClick={this.onCreateConversationButtonClick}
        />}
        {this.state.activeChatId &&
        <ChatBody
          messages={messages}
          onMessageSubmit={this.onMessageSubmit}
          onReturnButtonClick={this.onReturnButtonClick}
        />}
      </div>
    );
  }
}

Chat.propTypes = {
  onChatClose: propTypes.func.isRequired,
  force: propTypes.bool,
  forceWillBeFalse: propTypes.func,
};

export default Chat;
