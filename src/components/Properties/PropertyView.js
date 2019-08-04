import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { CITIES, PROPERTY_TYPES, COUNTRIES, STATUS_TYPES } from '../../globals';

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
    },
    titleCase: {
        textTransform: 'capitalize',
    }
});

const PropertyView = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fabMenuAnchor: null,
            note: '',
        };
        this.formRef = React.createRef();
    }

    approveProperty = event => {
        let valid = true;

        if (valid)
            this.props.approveAction(this.props.property);
    };

    rejectProperty = event => {
        const { note } = this.state;

        if (!isEmpty(note))
            this.props.rejectAction(this.props.property, note);
        else
            document.getElementById('property-note').focus();
    };

    /*renderFeatureChips = ({ featureType, featureItems }) => {
        const { property } = this.props;
        const selectedFeatures = property[featureType];
        return (
            <React.Fragment>
                {
                    featureItems.map(feature => (
                        selectedFeatures.includes(feature) && 
                            <Grid item key={feature}>
                                <Chip
                                    label={feature}
                                    // color={selectedFeatures.includes(feature) ? 'primary': 'default'}
                                    color='primary'
                                />
                            </Grid>
                    ))
                }
            </React.Fragment>
        );
    };

    renderFeatureGroup = () => {
        const { property } = this.props;
        const { usage, type } = property;

        const featureGroup = PROPERTY_TYPES[usage].types[type].features;
        const FeatureChips = this.renderFeatureChips;

        return (
            <React.Fragment>
                {
                    Object.keys(featureGroup).map(featureGroupItemKey => (
                        <Grid item xs={12} key={featureGroupItemKey} style={{ marginTop: 15 }}>
                            <Typography variant={'body2'} gutterBottom>
                                {featureGroup[featureGroupItemKey].type}
                            </Typography>
                            <Grid container spacing={8}>
                                <FeatureChips featureType={featureGroupItemKey} featureItems={featureGroup[featureGroupItemKey].items}/>
                            </Grid>
                        </Grid>
                    ))
                }
            </React.Fragment>
        );
    };*/

    render() {
        const { classes } = this.props;
        const { note } = this.state;
        const { property } = this.props;
        const { owner, representative, details } = property;

        console.log(property);

        return (
            <form autoComplete="off" ref={this.formRef} onSubmit={this.onFormSubmit}>
                <AbsoluteFAB icon={<DoneIcon />} type={'submit'}/>
                <Grid container spacing={16} direction={'column'}>
                    <Grid item xs={12}>
                        <Paper elevation={2} className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={11}>
                                    <Typography variant={'h6'}>
                                        General Details
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={8}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant={'caption'}>
                                        {'Owner'}
                                    </Typography>
                                    <Typography variant={'headline'} className={classes.titleCase}>
                                        {owner && owner.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant={'caption'}>
                                        {'Representative'}
                                    </Typography>
                                    <Typography variant={'headline'} className={classes.titleCase}>
                                        {representative && representative.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant={'caption'}>
                                        {'Usage'}
                                    </Typography>
                                    <Typography variant={'headline'} className={classes.titleCase}>
                                        {property.usage}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant={'caption'}>
                                        {'Property Type'}
                                    </Typography>
                                    <Typography variant={'headline'} className={classes.titleCase}>
                                        {property.type}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={11}>
                                    <Typography variant={'h6'}>
                                        Property details
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={8}>
                                <Grid item xs={12} sm={12}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell variant='head'>Type</TableCell> */}
                                                {
                                                    property.type === "villa" ? null : (
                                                        <TableCell variant='head'>Building Name</TableCell>
                                                    )
                                                }
                                                
                                                <TableCell variant='head'>Community</TableCell>
                                                {
                                                    property.type === "villa" ? null : (
                                                        <TableCell variant='head'>Floor</TableCell>
                                                    )
                                                }
                                                {
                                                    property.type === "apartment" ? null : (
                                                        <TableCell variant='head'>Storeys</TableCell>
                                                    )
                                                }
                                                <TableCell variant='head'>Bedrooms</TableCell>
                                                <TableCell variant='head'>Bathrooms</TableCell>
                                                <TableCell variant='head'>Unit Id</TableCell>
                                                <TableCell variant='head'>Area</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow hover>
                                                {/* <TableCell variant='body'>{address.addressType}</TableCell> */}
                                                {
                                                    property.type === "villa" ? null : (
                                                        <TableCell variant='body'>{details.buildingName}</TableCell>
                                                    )
                                                }

                                                <TableCell variant='body'>{details.communityName}</TableCell>
                                                {
                                                    property.type === "villa" ? null : (
                                                        <TableCell variant='body'>{details.floor}</TableCell>
                                                    )
                                                }
                                                {
                                                    property.type === "apartment" ? null : (
                                                        <TableCell variant='body'>{details.storeys}</TableCell>
                                                    )
                                                }
                                                <TableCell variant='body'>{details.bedrooms}</TableCell>
                                                <TableCell variant='body'>{details.bathroom}</TableCell>
                                                <TableCell variant='body'>{details.unitId}</TableCell>
                                                <TableCell variant='body'>{details.area}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {
                        property.geocode && (
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
                                                {property.geocode.latitude}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={5} sm={5}>
                                            <Typography variant={'caption'}>
                                                {'Longitude'}
                                            </Typography>
                                            <Typography variant={'headline'}>
                                                {property.geocode.longitude}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )
                    }

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                {/* Feature group */}
                                <Grid item xs={11}>
                                    <Typography variant={'h6'}>
                                        { "Amenities & Features" }
                                    </Typography>
                                </Grid>
                            </Grid>
                            {/* <Grid container spacing={8}>
                            {
                                this.renderFeatureGroup()
                            }
                            </Grid> */}
                            <Grid container spacing={8}>
                                {
                                    property.amenities.map(amenities => (
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
                                        Attachments
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <AttachmentTable attachments={property.attachments} />
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
                                        id="property-note"
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
                                        onClick={this.approveProperty}
                                    >
                                        Approve
                                    </Button>
                                </Grid>
                                <Grid item xs={8} sm={6}>
                                    <Button 
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.rejectProperty}
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

export default withStyles(styles)(PropertyView);