import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 18,
  },
  grey: {
    backgroundColor: theme.palette.background.default
  }
});

class RepresentativesDialog extends React.Component {
  state = {
    
  };

  render() {
    const { classes } = this.props;
    const { open, close, exit, title } = this.props;

    return (
      <Dialog
        fullScreen 
        open={ open } 
        onClose={ close }
        scroll={'paper'}
        classes={{
          paperFullScreen: classes.grey
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              { title }
            </Typography>
            <IconButton color="inherit" onClick={ exit } aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
            {this.props.children}
        </DialogContent>
      </Dialog>
    );
  }
}

RepresentativesDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RepresentativesDialog);