import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import isEmpty from 'lodash/isEmpty';
import { STATUS_TYPES } from '../../globals';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';

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
    },
    paper: {
        display: 'block',
        height: 'auto',
        padding: 18,
        maxWidth: 1000,
    }
});

const OwnerView = class extends React.Component {
    constructor(props) {
        super(props);
        const { owner } = this.props;
        this.state = {
            owner: {
                id: !!(owner && owner.id) ? owner.id : null,
                prefix: !!(owner && owner.prefix) ? owner.prefix : '',
                name: !!(owner && owner.name) ? owner.name : '',
                emails: !!(owner && owner.emails) ? owner.emails : [],
                nationality: !!(owner && owner.nationality) ? owner.nationality : '',
                phoneNumbers: !!(owner && owner.phoneNumbers) ? owner.phoneNumbers : [],
                addresses: !!(owner && owner.addresses) ? owner.addresses : [{}],
                status: !!(owner && owner.status) ? owner.status : STATUS_TYPES.PENDING,
                attachments: !!(owner && owner.attachments) ? owner.attachments : []
            },
            errors: {},
            note: '',
        };
    }

    approveOwner = event => {
        let valid = true;
        if (valid)
            this.props.approveAction(this.state.owner);
    };

    rejectOwner = event => {
        const { owner, note } = this.state;

        if (!isEmpty(note))
            this.props.rejectAction(owner, note);
        else
            document.getElementById('owner-note').focus();
    };

    render() {
        const { classes } = this.props;
        const { owner, errors, note } = this.state;

        return (
            <form autoComplete="off" ref={this.formRef} onSubmit={this.approveOwner}>
                <Tooltip title="Approve">
                    {/* <AbsoluteFAB icon={<DoneIcon />} type={'submit'}/> */}
                    <AbsoluteFAB icon={<DoneIcon />} action={this.approveOwner} />
                </Tooltip>
                <Grid container spacing={16} direction={'column'}>
                    <Grid item xs={12}>
                        <Paper elevation={2} className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Basic Information
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Typography variant={'caption'}>
                                        {'Prefix'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {owner.prefix}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8} sm={10}>
                                    <Typography variant={'caption'}>
                                        {'Full Name'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {owner.name}
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'E-Mail Address'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {owner.email}
                                    </Typography>
                                </Grid> */}
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Nationality'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {owner.nationality}
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Phone Number'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {owner.phoneNumber}
                                    </Typography>
                                </Grid> */}
                            </Grid>
                        </Paper>
                    </Grid>
                    {
                        owner.emails.length > 0 && (
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant={"h6"}>Contact Information</Typography>
                                        </Grid>
                                        <Grid container spacing={8}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant={"headline"}>{"Email Type"}</Typography>
                                                {owner.emails.map(email => {
                                                    return (
                                                        <Typography variant={"caption"}>
                                                            {email.emailtype}
                                                        </Typography>
                                                    );
                                                })}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant={"headline"}>{"Email"}</Typography>
                                                {owner.emails.map(email => {
                                                    return (
                                                        <Typography variant={"caption"}>
                                                            {email.email}
                                                        </Typography>
                                                    );
                                                })}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant={"headline"}>
                                                    {"Phone Type"}
                                                </Typography>
                                                {owner.phoneNumbers.map(number => {
                                                    return (
                                                        <Typography variant={"caption"}>
                                                            {number.phonetype}
                                                        </Typography>
                                                    );
                                                })}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant={"headline"}>
                                                    {"Phone Numbers"}
                                                </Typography>
                                                {owner.phoneNumbers.map(number => {
                                                    return (
                                                        <Typography variant={"caption"}>
                                                            {number.number}
                                                        </Typography>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )
                    }
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Address details
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <AddressTable addresses={owner.addresses} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Attachments
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <AttachmentTable attachments={owner.attachments} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Actions
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="owner-note"
                                        required
                                        multiline
                                        label="Note"
                                        margin="normal"
                                        variant="outlined"
                                        value={note}
                                        onChange={e => this.setState({note: e.target.value})}
                                        placeholder="Leave a remark before sending for correction"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Button 
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.approveOwner}
                                    >
                                        Approve
                                    </Button>
                                </Grid>
                                <Grid item xs={8} sm={6}>
                                    <Button 
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.rejectOwner}
                                    >
                                        Send for Correction
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        );
    }
};

const AddressTable = withStyles(styles)(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { addresses } = this.props;

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell variant='head'>Type</TableCell>
                        <TableCell variant='head'>Address</TableCell>
                        <TableCell variant='head'>P. O. Box</TableCell>
                        <TableCell variant='head'>City</TableCell>
                        <TableCell variant='head'>Country</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {addresses.map((address, index) => (
                        <TableRow key={index} hover>
                            <TableCell variant='body'>{address.addressType}</TableCell>
                            <TableCell variant='body'>{address.fullAddress}</TableCell>
                            <TableCell variant='body'>{address.poBox}</TableCell>
                            <TableCell variant='body'>{address.city}</TableCell>
                            <TableCell variant='body'>{address.country}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
});
const AttachmentTable = withStyles(styles)(class extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { attachments } = this.props;

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell variant='head'>Name</TableCell>
                        <TableCell variant='head'>Type</TableCell>
                        <TableCell variant='head'>Expiry Date</TableCell>
                        <TableCell variant='head'>Preview</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attachments.map((attachment, index) => (
                        <TableRow key={index} hover>
                            <TableCell variant='body'>{attachment.name}</TableCell>
                            <TableCell variant='body'>{attachment.linkedTo}</TableCell>
                            <TableCell variant='body'>{attachment.expirydate}</TableCell>
                            <TableCell variant='body'>
                                <a href={attachment.image} target="__blank" >
                                <RemoveRedEye />
                            </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
});

export default withStyles(styles)(OwnerView);