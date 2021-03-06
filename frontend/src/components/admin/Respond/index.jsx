import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import ConversationList from './ConversationList';
import { getAllConversations, setConversation, removeConversations, updateConversations } from '../../../actions/conversationsActions';
import * as StatisticActions from '../../../actions/statisticActions';
import Chat from './../chatAdmin/ChatAdmin';
import UserInfo from './../UserInfo/UserInfo';
import styles from './styles.scss';
import ConversationFilter from './ConversationFilter/ConversationFilter';

class Respond extends React.Component {
  constructor() {
    super();
    this.filterHeight = 50;
    this.conversationToChat = this.conversationToChat.bind(this);
    this.getIdForStatistic = this.getIdForStatistic.bind(this);
    this.getConversationGroupsCount = this.getConversationGroupsCount.bind(this);
  }

  componentWillMount() {
    this.props.getConversationsByFilters(this.props.conversationFilters);
    this.getConversationGroupsCount();
  }

  componentWillUnmount() {
    this.props.removeConversations();
  }

  getConversationGroupsCount() {
    fetch('/api/conversations/count', {
      method: 'GET',
      credentials: 'include',
    }).then(response => response.json()).then((response) => {
      this.props.updateConversationGroupsCount(response);
    });
  }

  getIdForStatistic(conversation) {
    const userObj = conversation.participants.find((user) => {
      return user.userType === 'User';
    });
    this.props.getStatisticById(userObj.user._id);
  }

  conversationToChat(id) {
    return this.props.conversations.find((e) => {
      return e._id === id;
    });
  }

  render() {
    const filters = (
      <ConversationFilter
        filters={this.props.conversationFilters}
        setConversationFilters={this.props.setConversationFilters}
        getConversationsByFilters={this.props.getConversationsByFilters}
        removeConversations={this.props.removeConversations}
        conversationGroupsCount={this.props.conversationGroupsCount}
      />
    );
    if (this.props.conversations === null) {
      return (
        <div>
          {filters}
          <h3 style={{ margin: '10px' }}>Loading...</h3>
        </div>
      );
    } else if (!this.props.conversations.length) {
      return (
        <div>
          {filters}
          <h3 style={{ margin: '10px' }}>Conversations list is empty now</h3>
        </div>
      );
    }

    const idToRender = this.props.conversationToRenderId || null;
    const convToChat = idToRender ? this.conversationToChat(idToRender) : null;
    return (
      <div>
        {filters}
        {!idToRender ?
          <div
            className={styles['big-conversation-list']}
            style={{
              height: `calc(100vh - ${this.props.headerHeight}px - ${this.filterHeight}px - 8px)`,
              overflowY: 'scroll',
              width: '100%',
            }}
          >
            <ConversationList
              setStatistic={this.getIdForStatistic}
              conversations={this.props.conversations}
              setConversation={this.props.setConversation}
              chosenTheme={this.props.chosenTheme}
            />
          </div> :
          <div
            className={styles['small-conversation-list']}
            style={{
              height: `calc(100vh - ${this.props.headerHeight}px - ${this.filterHeight}px - 8px)`,
              display: 'flex',
              flexWrap: 'nowrap',
              width: '100%',
            }}
          >
            <button
              onClick={this.props.removeConversations}
              className={styles['return-to-conversations-button']}
            >
              Return to conversations list
            </button>
            <div
              className={styles.conversations}
              style={{
                overflowY: 'scroll',
              }}
            >
              <ConversationList
                setStatistic={this.getIdForStatistic}
                conversations={this.props.conversations}
                setConversation={this.props.setConversation}
                nowActive={this.props.conversationToRenderId}
                removeConversations={this.props.removeConversations}
                chosenTheme={this.props.chosenTheme}
              />
            </div>
            <div
              className={styles['chat-wrapper']}
            >
              <Chat
                conversationToRender={convToChat}
                dispatch={this.props.dispatch}
                chosenTheme={this.props.chosenTheme}
                headerHeight={this.props.headerHeight}
                socketConnection={this.props.socketConnection}
                updateUnreadMessages={this.props.updateUnreadMessages}
                setMessagesReceived={this.props.setMessagesReceived}
                removeConversations={this.props.removeConversations}
                conversationGroupsCount={this.props.conversationGroupsCount}
                updateConversationGroupsCount={this.props.updateConversationGroupsCount}
              />
            </div>
            <div
              className={styles['info-wrapper']}
            >
              <UserInfo statistic={this.props.statisticById} />
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    conversations: state.conversationsInfo.conversations,
    conversationToRenderId: state.conversationsInfo.conversationToRenderId,
    statisticById: state.statistics.statisticById,
    conversationFilters: state.conversationsInfo.conversationFilters,
    conversationsNumber: state.conversationsInfo.conversationsNumber,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllConversations: () => {
      dispatch(getAllConversations());
    },
    setConversation: (id) => {
      dispatch(setConversation(id));
    },
    removeConversations: () => {
      dispatch(removeConversations());
    },
    getStatisticById: (id) => {
      dispatch(StatisticActions.getStatisticById(id));
    },
    updateConversations: (newConversations) => {
      dispatch(updateConversations(newConversations));
    },
    setConversationFilters: (newFilters) => {
      dispatch({ type: 'SET_CONVERSATION_FILTERS', payload: newFilters });
    },
    setMessagesReceived: (conversationId) => {
      dispatch({ type: 'SET_MESSAGES_RECEIVED', payload: conversationId });
    },
  };
};

Respond.propTypes = {
  getStatisticById: propTypes.func.isRequired,
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
  conversationToRenderId: propTypes.string,
  setConversation: propTypes.func.isRequired,
  removeConversations: propTypes.func.isRequired,
  dispatch: propTypes.func,
  statisticById: propTypes.shape({
    userId: propTypes.any,
    currentUrl: propTypes.string,
    viewedUrls: propTypes.arrayOf(propTypes.string),
    browserLanguage: propTypes.string,
    geoLocation: propTypes.string,
    online: propTypes.bool,
    coordinates: propTypes.string,
    userIpAddress: propTypes.string,
    country: propTypes.string,
    city: propTypes.string,
    screenWidth: propTypes.number,
    screenHeight: propTypes.number,
    userAgent: propTypes.string,
    timeZone: propTypes.string,
    signedUpDate: propTypes.any,
    sessionsCounts: propTypes.number,
  }),
  headerHeight: propTypes.number,
  chosenTheme: propTypes.shape({}),
  socketConnection: propTypes.shape({}),
  setConversationFilters: propTypes.func,
  getConversationsByFilters: propTypes.func,
  conversationFilters: propTypes.shape({}),
  updateUnreadMessages: propTypes.func,
  setMessagesReceived: propTypes.func,
  conversationGroupsCount: propTypes.shape({}),
  updateConversationGroupsCount: propTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Respond);
