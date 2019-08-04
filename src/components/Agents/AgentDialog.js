import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

const styles = {
  doalogTitle: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  paper: {
    maxWidth: 1156,
    margin: [[0, 18, 0, 18]],
  },
};

class AgentDialog extends React.Component {
  state = {
    
  };

  render() {
    const { classes } = this.props;
    const { open, close, exit, title } = this.props;

    return (
      <Dialog
        maxWidth={'md'}
        open={ open } 
        onClose={ close }
        onExit={exit}
      >
        <DialogTitle disableTypography>
          <Typography variant={"h6"} color="inherit">
            {title}
            <IconButton color="inherit" onClick={ exit } aria-label="Close" style={{float: 'right'}}>
              <CloseIcon />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>
          {this.props.children}
        </DialogContent>
      </Dialog>
    );
  }
}

AgentDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AgentDialog);