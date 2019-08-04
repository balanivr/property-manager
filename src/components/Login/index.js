import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import styles from './loginStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import ForgotPasswordDialog from './ForgotPasswordDialog';

const Login = ({ classes, logo, auth, baseUrl, onLogin, errorMessage, sendResetEmailLink}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [open, toggleModal] = useState();
    const [forgotEmail, setForgotEmail] = useState();
    /*const formData = {
        email: null,
        password: null,
    };*/

    const onChange = (event) => {
        if (event.target.name === "email"){
            setEmail(event.target.value)
        }else{
            setPassword(event.target.value)
        }
        // formData[event.target.name] = event.target.value;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        /*console.log(formData)
        const { email, password } = formData;*/
        onLogin(email, password);
    };
    const openForgotPasswordDialog = (event) => {
        event.preventDefault();
        toggleModal(true);
    }
    const handleCloseForgotPasswordDialog = () => {
        toggleModal(false);
    }
    const onChangeForgotPassword = (event) => {
        setForgotEmail(event.target.value);
    }
    const sendResetLink = () => {
        if(forgotEmail.trim() !== "")
        {
            sendResetEmailLink(forgotEmail);
            toggleModal(false);
        }else{
            alert("Enter your email");
        }
    }

    return (
      <main className={classes.main}>
            <ForgotPasswordDialog
                open={open}
                handleClose={handleCloseForgotPasswordDialog}
                handeClick={sendResetLink}
                onChangeForgotPassword={onChangeForgotPassword}
                email={forgotEmail}
            />
          <Grid container className={classes.pageWrapper}>
              <Grid item xs={12}>
                  <Paper className={classes.loginForm}>
                      {logo}
                      <Typography component='h1' variant='h5'>
                          Sign in
                      </Typography>
                      <form className={classes.form} onSubmit={onSubmit} method={'POST'}>
                          <FormControl margin='normal' required fullWidth>
                              <InputLabel htmlFor='email'>Email Address</InputLabel>
                              <Input id='email' name='email' autoComplete='email' autoFocus onChange={onChange}/>
                          </FormControl>
                          <FormControl margin='normal' required fullWidth>
                              <InputLabel htmlFor='password'>Password</InputLabel>
                              <Input name='password' type='password' id='password' autoComplete='current-password' onChange={onChange}/>
                          </FormControl>
                          {/* <FormControlLabel
                              control={<Checkbox value='remember' color='primary' />}
                              label='Remember me'
                          /> */}
                            <a  style={{ cursor: 'pointer'}} onClick={openForgotPasswordDialog}>Forgot Password</a>

                          <Button
                              type='submit'
                              fullWidth
                              variant='contained'
                              color='primary'
                              className={classes.submit}
                              style={{marginTop: '10px'}}
                          >
                              Sign in
                          </Button>
                          {
                                errorMessage && errorMessage !== "" ? (
                                    <small style={{color:'red'}}>{errorMessage}</small>
                                ): null
                          }
                      </form>
                  </Paper>
              </Grid>
          </Grid>
      </main>
    );
};
export default withStyles(styles)(Login);