import React from "react"
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import MyThemeProvider from 'material-ui/styles/MuiThemeProvider';

const SingleConversation = (props) => {
  console.log(props.conversation)
  let messages = props.conversation.messages
  return (
    <div>
      <MyThemeProvider>
        <List>
          <Subheader>Today</Subheader>
          <ListItem
            leftAvatar={<Avatar src="images/ok-128.jpg" />}
            primaryText={props.conversation._id}
            secondaryText={
              <p>

              </p>
            }
            secondaryTextLines={2}
          />
          <Divider inset={true} />
        </List>
      </MyThemeProvider>
    </div>
  )
}

export default SingleConversation