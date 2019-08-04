import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';

class ForgotPasswordDialog extends React.Component {

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Forgot Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        Enter your email if you have forgot your password
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            onChange={this.props.onChangeForgotPassword}
                            value={this.props.email}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Cancel
            </Button>
                        <Button onClick={this.props.handeClick} color="primary" autoFocus>
                            Send Link
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ForgotPasswordDialog;