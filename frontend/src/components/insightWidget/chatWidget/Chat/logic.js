import notifications from '../../../notifications/notifications';

function findItemById(id, arrOfObjects) {
  if (!id || !arrOfObjects) return null;
  const item = arrOfObjects.find((obj) => {
    return obj._id === id;
  });
  const index = arrOfObjects.findIndex((obj) => {
    return obj._id === id;
  });
  return {
    item,
    index,
  };
}

const isIntroduced = {
  add(variable) {
    this.invoke = () => {
      return variable;
    };
  },
  skip() {
    this.skipped = true;
  },
  skipped: false,
};

function getForceMessage(conversation, forceMessageBody) {
  const forceMessage = {
    _id: (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 24),
    body: forceMessageBody,
    createdAt: Date.now(),
    forceMessage: true,
  };
  if (conversation.length) {
    if (conversation.length === 0) return conversation;
    const oldConversations = [].concat(conversation);
    const { item: conversationItem, index } = findItemById(window._injectedData.forceConvId, oldConversations);
    conversationItem.messages = [...conversationItem.messages, forceMessage];
    oldConversations.splice(index, 1, conversationItem);
    return oldConversations;
  }
  const convCopy = Object.assign({}, conversation);
  convCopy.messages = [forceMessage, ...conversation.messages];
  return convCopy;
}

function returnNewState(messages, conversationId, conversations) {
  const { item: conversationItem, index } = findItemById(conversationId, conversations);
  const oldConversations = [...conversations];
  oldConversations.splice(index, 1);
  if (Array.isArray(messages)) {
    conversationItem.messages = [...messages];
  } else {
    conversationItem.messages = [...conversationItem.messages, messages];
  }
  return [...oldConversations, conversationItem];
}

function startSocketConnection(socket, forceMessageBody) {
  const id = window._injectedData.anonymousId || window._injectedData.userId._id;
  socket.on('user connected', () => {
    console.log('connected to the server successfully');
  });
  const userObj = {
    type: 'User',
    id,
  };
  socket.emit('userId', userObj);
  //  socket.emit('getUserConversations', id);
  socket.on('userData', (data) => {
    this.setState({ user: data });
  });
  socket.on('returnUserConversations', (conversations) => {
    if (this.props.force && !window._injectedData.forceConvId) {
      this.onForceConversation();
    }
    if (window._injectedData.forceConvId && this.props.force) {
      const convWithForceMessage = getForceMessage(conversations, forceMessageBody);
      this.socket.emit('switchRoom', window._injectedData.forceConvId);
      this.setState({ conversations: convWithForceMessage, activeChatId: window._injectedData.forceConvId });
    } else {
      this.setState({ conversations });
    }
  });
  socket.on('newMessage', (message) => {
    if (message.body && message.author.userType === 'Admin') {
      notifications.api('new message', message, () => window.focus());
    }

    this.setState((prevState) => {
      const conversations = returnNewState(message, message.conversationId, prevState.conversations);
      return {
        conversations,
      };
    });
  });
  socket.on('newConversationCreated', (conversation) => {
    const newConversations = [...this.state.conversations, conversation];
    this.setState({
      conversations: newConversations,
      activeChatId: conversation._id,
    });
  });
  socket.on('messagesReceived', (updatedMessages) => {
    this.setState((prevState) => {
      const conversations = returnNewState(updatedMessages, updatedMessages[0].conversationId, prevState.conversations);
      return {
        conversations,
      };
    });
  });
  socket.on('newMessageReceived', (message) => {
    this.setState((prevState) => {
      const { item: conversationItem,
        index: conversationIndex } = findItemById(message.conversationId, prevState.conversations);
      const { index: messageIndex } = findItemById(message._id, conversationItem.messages);
      const oldMessages = [...conversationItem.messages];
      oldMessages.splice(messageIndex, 1);
      const newMessages = [...oldMessages, message];
      const newConversation = { ...conversationItem, messages: newMessages };
      const oldConversations = [...prevState.conversations];
      oldConversations.splice(conversationIndex, 1);
      const newConversations = [...oldConversations, newConversation];
      return {
        conversations: newConversations,
      };
    });
  });
  socket.on('forceConversationCreated', (conversation) => {
    const convWithForceMessage = getForceMessage(conversation, forceMessageBody);
    const newConversations = [...this.state.conversations, convWithForceMessage];
    window._injectedData.forceConvId = conversation._id;
    this.setState({
      conversations: newConversations,
      activeChatId: conversation._id,
    });
  });
  this.socket.on('introduced', (data) => {
    isIntroduced.add(data.body.isIntroduced);
  });
}

export {
  findItemById,
  startSocketConnection,
  isIntroduced,
};
