import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import cloneDeep from 'lodash/cloneDeep';
import { REGIONS, USERTYPES } from '../../globals';
import isString from 'lodash/isString';
import { InputAdornment, IconButton, MenuItem, FormControlLabel, FormHelperText } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    fullwidth_TextField: {
        width: 'calc(100% - 20px)', 
        margin: '15px 10px',
    },
    grow: {
        flexGrow: 1
    }
});
const emailRegex = RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
);
const AgentForm = class extends React.Component {
    constructor(props) {
        super(props);
        const { agent } = this.props;
        this.state = {
            agent: {
                id: !!(agent && agent.id) ? agent.id : null,
                password: !!(agent && agent.id == null && agent.password) ? agent.password : null,
                region: !!(agent && agent.region) ? agent.region : REGIONS.uae.value,
                name: !!(agent && agent.name) ? agent.name : '',
                email: !!(agent && agent.email) ? agent.email : '',
                userType: !!(agent && agent.userType) ? agent.userType : [],
                status: !!(agent && agent.status) ? agent.status : '',
            },
            errors: {},
            showPassword: false
        };

        this.formRef = React.createRef();
    }

    updateFormState = (key, value) => {
        console.log('Agent form updateFormState', key, value);
        if(Object.keys(this.state.agent).includes(key)) {
            this.setState(state => {
                state = cloneDeep(state);
                state.agent[key] = value;
                return state;
            }, () => {
                this.props.onChange && this.props.onChange(this.state.agent);
            });
        }
    };
    setUserType = (value) => {
        let {agent} = {...this.state};
        let userType = agent.userType;
        var index = userType.indexOf(value);
        if(index === -1){
            userType.push(value);
        }else{
            userType.splice(index,1);
        }
        agent.userType = userType;
        this.setState({
            agent
        }, () => {
                this.props.onChange && this.props.onChange(this.state.agent);
        });
    };


    onFormSubmit = (event) => {
        event.preventDefault();
        const errors = {};
        const { agent } = this.state;

        // Validations
        let validationFailed = false;

        if(agent.id == null && !(isString(agent.password) && agent.password.length >= 6)) {
            validationFailed = true;
            errors['password'] = {};
        }
        if (!emailRegex.test(agent.email)){
            validationFailed = true;
            errors['email'] = {};
        }
        if (agent.userType.length === 0) {
            validationFailed = true;
            errors['userType'] = {};
        }

        if(validationFailed) {
            this.setState({
                errors
            });
        } else {
            this.props.onSubmit && this.props.onSubmit(this.state.agent);
        }
    };
    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };


    render() {
        const { classes } = this.props;
        const { agent, errors } = this.state;

        return (
            <form className={ classes.container } autoComplete="off" ref={this.formRef} onSubmit={this.onFormSubmit}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <TextField
                            label="Agent Name"
                            defaultValue={ agent.name }
                            onBlur={ e => this.updateFormState('name', e.target.value)}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            error={Object.keys(errors).includes('name')}
                            InputProps={{
                                type: 'text'
                            }}
                        />
                    </Grid>
                    {
                        agent.id == null && (
                            <Grid item xs={12}>
                                <TextField
                                    label="New Password"
                                    defaultValue={ agent.password }
                                    onBlur={ e => this.updateFormState('password', e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    error={Object.keys(errors).includes('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={this.handleClickShowPassword}
                                                >
                                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        )
                    }
                    <Grid item xs={12}>
                        <TextField
                            label="E-Mail Address"
                            defaultValue={agent.email}
                            onBlur={e => this.updateFormState('email', e.target.value)}
                            error={Object.keys(errors).includes('email')}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            required
                            InputProps={{
                                type: 'email'
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {
                            USERTYPES.map(user =>
                                <React.Fragment>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={agent.userType.indexOf(user) === -1 ? false : true}
                                                onChange={e => this.setUserType(e.target.value)}
                                                value={user}
                                                color="primary"
                                            />
                                        }
                                        disabled={agent.id}
                                        label={user}
                                        key={user}
                                    />
                                </React.Fragment>
                            )
                        }
                        {Object.keys(errors).includes('userType') && <FormHelperText style={{color:'red'}}>Select user type</FormHelperText>
                        }
                    </Grid>
                    <Grid item xs={12} style={{
                        textAlign: 'right'
                    }}>
                        <Button type={'submit'} variant={'text'} color="secondary">
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );

    }
};

export default withStyles(styles)(AgentForm);