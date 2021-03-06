import React, { Component } from 'react';
import propTypes from 'prop-types';
import styles from './styles.scss';

class ConversationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const conversations = this.props.conversations;
    const wrapperStyles = { backgroundColor: this.props.widgetStyles.primaryColor };
    const buttonStyles = { backgroundColor: this.props.widgetStyles.primaryColor };
    return (
      <div className={styles.container}>
        <div className={styles['title-wrapper']} style={wrapperStyles}>
          <img
            alt="close-button"
            src="http://flaticons.net/gd/makefg.php?i=icons/Mobile%20Application/Close.png&r=255&g=255&b=255"
            className={styles['close-button']}
            onClick={this.props.onChatClose}
          />
          <h3 className={styles.title}>Conversations</h3>
          <span className={styles['title-span']}>with Insight</span>
        </div>
        <ul className={styles['conversations-list']}>
          {conversations && conversations.map((conversation) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const lastMessageDate = lastMessage && new Date(lastMessage.createdAt);
            let passedTime = lastMessage && (`${((Date.now() - lastMessageDate.valueOf()) / 60000).toFixed()}m ago`);
            if (parseInt(passedTime, 10) > 60) {
              passedTime = `${Math.round(parseInt(passedTime, 10) / 60)}h ago`;
              if (parseInt(passedTime, 10) > 24) passedTime = `${Math.round(parseInt(passedTime, 10) / 24)}d ago`;
            }
            const avatar = lastMessage && (lastMessage.author.item.avatar === `${window._injectedData.insightHost}/uploads/avatars/avatar.png` ?
              `${window._injectedData.insightHost}/uploads/avatars/avatar.png` :
              `${window._injectedData.insightHost}/uploads/avatars/${lastMessage.author.item.avatar}`);
            return (
              lastMessage ?
                <li
                  className={styles['conversation-item']}
                  key={conversation._id}
                  onClick={() => this.props.onConversationClick(conversation._id)}
                >
                  <img className={styles['author-avatar']} src={avatar} alt="avatar" />
                  <div className={styles['author-name']}>
                    {lastMessage.author.item.username}
                    <span className={styles['message-time']}>{passedTime}</span>
                  </div>
                  <div className={styles['message-body']}>{typeof lastMessage.body === 'object' ?
                    `${lastMessage.body.fileName}.${lastMessage.body.fileType}` :
                    lastMessage.body}
                  </div>
                </li> :
                <li
                  className={`${styles['conversation-item']} ${styles['no-conversation-item']}`}
                  key={conversation._id}
                  onClick={() => this.props.onConversationClick(conversation._id)}
                >
                  <span>No messages in conversation</span>
                </li>
            );
          })}
        </ul>
        <button
          style={buttonStyles}
          className={styles['create-conversation-button']}
          onClick={this.props.onCreateConversationButtonClick}
        >
          <span>New Conversation</span>
        </button>
      </div>
    );
  }
}

ConversationsList.propTypes = {
  conversations: propTypes.arrayOf(propTypes.shape({
    _id: propTypes.string.isRequired,
    participants: propTypes.arrayOf(propTypes.shape({
      userType: propTypes.string,
      user: propTypes.any,
    })).isRequired,
    messages: propTypes.arrayOf(propTypes.any).isRequired,
    open: propTypes.bool,
    createdAt: propTypes.oneOfType([propTypes.number, propTypes.string]),
  })),
  onConversationClick: propTypes.func.isRequired,
  onCreateConversationButtonClick: propTypes.func.isRequired,
  onChatClose: propTypes.func,
  widgetStyles: propTypes.shape({
    backgroundImage: propTypes.string,
    primaryColor: propTypes.string,
    widgetPosition: propTypes.string,
  }),
};

export default ConversationsList;
