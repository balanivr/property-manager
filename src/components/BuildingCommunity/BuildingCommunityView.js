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
import { STATUS_TYPES, BUILDINGORCOMMUNITY } from '../../globals';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { Link } from 'react-router-dom';
import BuildingCommunity from '.';
import { Chip } from '@material-ui/core';

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

const BuildingCommunityView = class extends React.Component {
    constructor(props) {
        super(props);
        const { buildingCommunity } = this.props;
        this.state = {
            fabMenuAnchor: null,
            buildingCommunity: {
                id: !!(buildingCommunity && buildingCommunity.id) ? buildingCommunity.id : null,
                name: !!(buildingCommunity && buildingCommunity.name) ? buildingCommunity.name : '',
                property_id: !!(buildingCommunity && buildingCommunity.property_id) ? buildingCommunity.property_id : '',
                community: !!(buildingCommunity && buildingCommunity.community) ? buildingCommunity.community : '',
                address: !!(buildingCommunity && buildingCommunity.address) ? buildingCommunity.address : {},
                status: !!(buildingCommunity && buildingCommunity.status) ? buildingCommunity.status : STATUS_TYPES.PENDING,
                note: !!(buildingCommunity && buildingCommunity.note) ? buildingCommunity.note : 'This record has incorrect information',
                attachments: !!(buildingCommunity && buildingCommunity.attachments) ? buildingCommunity.attachments : [],
                type: !!(buildingCommunity && buildingCommunity.type) ? buildingCommunity.type : BUILDINGORCOMMUNITY[0],
                usage: !!(buildingCommunity && buildingCommunity.usage) ? buildingCommunity.usage : [],
                amenities: !!(buildingCommunity && buildingCommunity.amenities) ? buildingCommunity.amenities : [],
                geocode: !!(buildingCommunity && buildingCommunity.geocode) ? buildingCommunity.geocode : []
            },
            errors: {},
            note: '',
        };
    }

    approveOwner = event => {
        let valid = true;

        if (valid)
            this.props.approveAction(this.state.buildingCommunity);
    };

    rejectOwner = event => {
        const { buildingCommunity, note } = this.state;

        if (!isEmpty(note))
            this.props.rejectAction(buildingCommunity, note);
        else
            document.getElementById('admin-note').focus();
    };

    render() {
        const { classes } = this.props;
        const { buildingCommunity, errors, note } = this.state;

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
                                        {buildingCommunity.type} Information
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Typography variant={'caption'}>
                                        {'Name'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8} sm={10}>
                                    <Typography variant={'caption'}>
                                        {'Property Id'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.property_id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Community'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.community}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Usage'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.usage}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Co-Ordinates
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} sm={5}>
                                            <Typography variant={'caption'}>
                                                {'Latitude'}
                                            </Typography>
                                            <Typography variant={'headline'}>
                                                {buildingCommunity.geocode.latitude}
                                            </Typography>
                                        </Grid>
                                {
                                    buildingCommunity.geocode && (<Grid item xs={5} sm={5}>
                                        <Typography variant={'caption'}>
                                            {'Longitude'}
                                        </Typography>
                                        <Typography variant={'headline'}>
                                            {buildingCommunity.geocode.longitude}
                                        </Typography>
                                    </Grid>)
                                }
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Address details
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Typography variant={'caption'}>
                                        {'Zone'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.zone}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8} sm={10}>
                                    <Typography variant={'caption'}>
                                        {'Sector'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.sector}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Plot No'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.plotNo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Full Address'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.fullAddress}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'P.O Box'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.poBox}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'City'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.city}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant={'caption'}>
                                        {'Country'}
                                    </Typography>
                                    <Typography variant={'headline'}>
                                        {buildingCommunity.address.country}
                                    </Typography>
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
                                    <AttachmentTable attachments={buildingCommunity.attachments} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                {/* Feature group */}
                                <Grid item xs={11}>
                                    <Typography variant={'h6'}>
                                        {"Amenities"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={8}>
                                {
                                    buildingCommunity.amenities.map(amenities => (
                                        <Grid item key={amenities}>
                                            <Chip
                                                label={amenities}
                                            />
                                        </Grid>
                                    ))
                                }
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
                                        id="admin-note"
                                        required
                                        multiline
                                        label="Note"
                                        margin="normal"
                                        variant="outlined"
                                        value={note}
                                        onChange={e => this.setState({ note: e.target.value })}
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

export default withStyles(styles)(BuildingCommunityView);