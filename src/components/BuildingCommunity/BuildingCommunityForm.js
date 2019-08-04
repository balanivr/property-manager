import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveIcon from '@material-ui/icons/Remove';
import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { CITIES, ADDRESS_TYPES, COUNTRIES, STATUS_TYPES, BUILDINGORCOMMUNITY, PROPERTY_USAGE, BUILDINGCOMMUNITYFEATURES } from '../../globals';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import LatLang from '../LatLang';
// import Demo from '../LatLang/Demo';

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
    input: {
        display: 'none',
    },
    uploadButton: {
        width: "100%",
        marginTop: "15px",
        height: "54px",
        backgroundColor: "#fff",
        "& hover": {
            backgroundColor: "#fff"
        }
    }

});

const BuildingCommunityForm = class extends React.Component {
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
                geocode: !!(buildingCommunity && buildingCommunity.geocode) ? buildingCommunity.geocode : { latitude: '', longitude: ''}
            },
            errors: {},
            attachment: { name: "", linkedTo: "", expirydate: "", image: [] },
            editAttachmentIndex: 0,
            isEditAttachment: false
        };

        this.formRef = React.createRef();
    }

    handleFABClick = event => (this.setState({ fabMenuAnchor: event.currentTarget }));
    handleFABMenuClose = event => (this.setState({ fabMenuAnchor: null }));

    updateFormState = (key, value) => {
        console.log('buildingCommunity form updateFormState', key, value);
        if (Object.keys(this.state.buildingCommunity).includes(key)) {
            this.setState(state => {
                state = cloneDeep(state);
                state.buildingCommunity[key] = value;
                return state;
            });
        }
    };
    updateImageState = event => {
        const attachment = { ...this.state.attachment };
        attachment.image = event.target.files[0];
        attachment.isUpload = true;
        this.setState({
            attachment
        });
    }
    updateAttachmentState = (key, value) => {
        const { attachment } = this.state;
        attachment[key] = value;
        this.setState({
            attachment
        });
    }

    updateAddress = address => {
        // let address = cloneDeep(this.state.buildingCommunity.address);
        // address = addressKey;
        this.updateFormState('address', address);
    };
    
    addAttachment = () => {
        const { attachment } = this.state;
        if (attachment.image.length === 0) {
            alert("Browse file to upload first");
            return false
        }
        if (attachment.name === "") {
            alert("Enter the File Name");
            return false
        }
        if (attachment.linkedTo === "") {
            alert("Select file is related personal info or address");
            return false
        }
        const buildingCommunity = { ...this.state.buildingCommunity };
        const attachments = buildingCommunity.attachments;
        if (this.state.isEditAttachment) {
            attachments[this.state.editAttachmentIndex] = this.state.attachment;

        } else {
            attachments.push(attachment);
        }
        buildingCommunity.attachments = attachments;
        this.setState({
            buildingCommunity,
            attachment: { name: "", linkedTo: "", expirydate: "", image: [] },
            isEditAttachment: false
        })
    };

    removeAddressIndex = (index) => (address) => {
        let addresses = cloneDeep(this.state.buildingCommunity.addresses);
        addresses.splice(index, 1);
        if (addresses.length !== 0) {
            this.updateFormState('addresses', addresses);
        }
    };

    saveForm = event => {
        const { buildingCommunity } = this.state;

        this.handleFABMenuClose(event);
        // console.log(buildingCommunity);
        // return false

        if (!isEmpty(buildingCommunity.name))
            this.props.onSubmit && this.props.onSubmit(buildingCommunity);
        else {
            // TODO: Show snackbar indicating that at least 'First Name' is required to save
            document.getElementById("name").focus();
        }
    };

    onFormSubmit = (event, status) => {
        event.preventDefault();
        const errors = {};
        const { buildingCommunity } = this.state;
        this.handleFABMenuClose(event);

        // Validations
        let validationFailed = false;

        if (buildingCommunity.address) {
            const addressErrors = [];
            const addressError = {};
            if (isEmpty(buildingCommunity.address.zone)) {
                addressError['zone'] = {};
                validationFailed = true;
            }
            if (isEmpty(buildingCommunity.address.country)) {
                addressError['country'] = {};
                validationFailed = true;
            }
            if (isEmpty(buildingCommunity.address.city)) {
                addressError['city'] = {};
                validationFailed = true;
            }
            if (isEmpty(buildingCommunity.address.sector)) {
                addressError['sector'] = {};
                validationFailed = true;
            }
            addressErrors.push(addressError);
            /*buildingCommunity.addresses.forEach(address => {
                const addressError = {};
                if (isEmpty(address.addressType)) {
                    addressError['addressType'] = {};
                    validationFailed = true;
                }
                if (isEmpty(address.country)) {
                    addressError['country'] = {};
                    validationFailed = true;
                }
                if (isEmpty(address.city)) {
                    addressError['city'] = {};
                    validationFailed = true;
                }
                addressErrors.push(addressError);
            });*/
            errors.address = addressErrors;
        }

        if (validationFailed) {
            this.setState({
                errors
            });
        } else {
            this.props.onSubmit && this.props.onSubmit(this.state.buildingCommunity, STATUS_TYPES.PENDING);
        }
    };
    deleteAttachment = index => {
        const buildingCommunity = { ...this.state.buildingCommunity };
        const attachment = [...buildingCommunity.attachments];
        attachment.splice(index, 1);
        buildingCommunity.attachments = attachment;
        this.setState({
            buildingCommunity
        })
    }
    editAttachment = index => {
        const buildingCommunity = { ...this.state.buildingCommunity };
        const attachments = [...buildingCommunity.attachments];
        const attachment = attachments[index];
        this.setState({
            attachment,
            editAttachmentIndex: index,
            isEditAttachment: true
        });
    }
    toggleUsage = usage => {
        const { buildingCommunity } = this.state;
        let selectedUsage = buildingCommunity.usage;
        if (selectedUsage.includes(usage)) {
            // Remove feature
            selectedUsage = selectedUsage.filter(u => u !== usage);
        } else {
            // Add feature
            selectedUsage = selectedUsage.concat(usage);
        }

        this.setState({
            buildingCommunity: {
                ...buildingCommunity,
                usage: selectedUsage
            }
        });
    }
    toggleAmenities = amenities => {
        const { buildingCommunity } = this.state;
        let selectedAmenities = buildingCommunity.amenities;
        if (selectedAmenities.includes(amenities)) {
            // Remove feature
            selectedAmenities = selectedAmenities.filter(a => a !== amenities);
        } else {
            // Add feature
            selectedAmenities = selectedAmenities.concat(amenities);
        }

        this.setState({
            buildingCommunity: {
                ...buildingCommunity,
                amenities: selectedAmenities
            }
        });
    }
    updateGeocode = (coordinate) => {
        let {buildingCommunity} = {...this.state};
        let { geocode } = {...buildingCommunity}
        geocode.latitude = coordinate.latitude;
        geocode.longitude = coordinate.longitude;
        buildingCommunity.geocode = geocode;
        this.setState({
            buildingCommunity
        })
    }

    render() {
        const { classes } = this.props;
        const { buildingCommunity, errors } = this.state;
        const selectedAmenities = this.state.buildingCommunity.amenities;
        const selectedUsage = this.state.buildingCommunity.usage;
        const size = this.state.buildingCommunity.type === BUILDINGORCOMMUNITY[0] ? 6 : 12

        return (
            <form autoComplete="off" ref={this.formRef} onSubmit={this.onFormSubmit}>
                {/* <AbsoluteFAB icon={<MoreVertIcon />} type={'submit'}/> */}
                <AbsoluteFAB icon={<MoreVertIcon />} action={this.handleFABClick} />
                <Menu anchorEl={this.state.fabMenuAnchor} open={Boolean(this.state.fabMenuAnchor)} onClose={this.handleFABMenuClose}>
                    <MenuItem onClick={this.saveForm}>Save for Later</MenuItem>
                    <MenuItem onClick={this.onFormSubmit}>Submit to Admin</MenuItem>
                </Menu>

                <Grid container spacing={16} direction={'column'}>
                    {
                        this.props.showNote && <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container spacing={8}>
                                    <Grid item xs={2} sm={1}>
                                        <center>
                                            <ErrorIcon color="primary" style={{ marginTop: 15 }} />
                                        </center>
                                    </Grid>
                                    <Grid item xs={10} sm={10}>
                                        <Typography variant={'h6'}>
                                            Note from Admin
                                        </Typography>
                                        <Typography variant={'p'}>
                                            {buildingCommunity.note}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <Paper elevation={2} className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Select Type
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} disabled>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        onChange={e => this.updateFormState('type', e.target.value)}
                                        margin={'normal'}
                                        variant={'outlined'}
                                        value={buildingCommunity.type}
                                        placeholder={'Select Type'}
                                        label={'Select Type'}
                                        error={Object.keys(errors).includes('type')}
                                        InputProps={{
                                            type: 'text',
                                        }}
                                    >
                                        {
                                            BUILDINGORCOMMUNITY.map(type =>
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            )
                                        }
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={2} className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        {
                                            buildingCommunity.type === BUILDINGORCOMMUNITY[0] ? "Building Information" : "Community Information"
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="name"
                                        label="Name"
                                        defaultValue={buildingCommunity.name}
                                        onBlur={e => this.updateFormState('name', e.target.value)}
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Property ID"
                                        defaultValue={buildingCommunity.property_id}
                                        onBlur={e => this.updateFormState('property_id', e.target.value)}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            type: 'text'
                                        }}
                                    />
                                </Grid>
                                {
                                    this.state.buildingCommunity.type === BUILDINGORCOMMUNITY[0] ? (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                select
                                                fullWidth
                                                onChange={e => this.updateFormState('community', e.target.value)}
                                                margin={'normal'}
                                                variant={'outlined'}
                                                value={buildingCommunity.community}
                                                placeholder={'Community'}
                                                label={'Community'}
                                            >
                                                {
                                                    this.props.communities.map(community =>
                                                        <MenuItem key={community.name} value={community.name}>{community.name}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        {/* <TextField
                                            label="Community"
                                            defaultValue={buildingCommunity.community}
                                            onBlur={e => this.updateFormState('community', e.target.value)}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                type: 'text'
                                            }}
                                        /> */}
                                    </Grid>
                                    ) : null
                                }
                                
                                <Grid item xs={12} sm={size} style={{ marginTop: 15 }}>
                                    <Typography variant={'body2'} gutterBottom style={{ marginLeft: '7px'}}>
                                        {'Usage:'}
                                    </Typography>
                                    <Grid container spacing={8}>
                                        {
                                            PROPERTY_USAGE.map(usage => (
                                                <Grid item key={usage}>
                                                    <Chip
                                                        label={usage}
                                                        onClick={() => this.toggleUsage(usage)}
                                                        color={selectedUsage.includes(usage) ? 'primary' : 'default'}
                                                    />
                                                </Grid>
                                            ))
                                        }

                                    </Grid>
                                </Grid>
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
                                <Grid item xs={12} sm={12}>
                                <AddressForm address={buildingCommunity.address} onChange={this.updateAddress} errors={errors.addresses} />
                                    {/* {
                                        buildingCommunity.addresses.map((address, index) =>
                                            <AddressForm key={btoa(index + JSON.stringify(address))} address={address} onChange={this.updateAddress(index)} onRemove={this.removeAddressIndex(index)} errors={errors.addresses && errors.addresses[index]} />
                                        )
                                    } */}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                    Co-ordinates
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <LatLang updateGeocode={this.updateGeocode} geocode={buildingCommunity.geocode} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={'h6'}>
                                        Amenities
                                    </Typography>
                                </Grid>
                                <Grid container spacing={8}>
                                    {
                                        BUILDINGCOMMUNITYFEATURES.map(amenities => (
                                            <Grid item key={amenities}>
                                                <Chip
                                                    label={amenities}
                                                    onClick={() => this.toggleAmenities(amenities)}
                                                    color={selectedAmenities.includes(amenities) ? 'primary' : 'default'}
                                                />
                                            </Grid>
                                        ))
                                    }
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
                                    {
                                        buildingCommunity.attachments.length > 0 ? (
                                            <AttachmentTable attachments={buildingCommunity.attachments} deleteAttachment={this.deleteAttachment} editAttachment={this.editAttachment} />
                                        ) : null
                                    }
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Image Name"
                                        margin="normal"
                                        variant="outlined"
                                        value={this.state.attachment.name}
                                        onChange={e => this.updateAttachmentState('name', e.target.value)}
                                        placeholder="Image Name"
                                        fullWidth
                                        InputProps={{
                                            type: 'text'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className={classes.input}
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        onChange={this.updateImageState}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" component="span" className={classes.uploadButton}>
                                            Upload Attachment
                                         </Button>
                                    </label>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        required
                                        label={'Link To'}
                                        margin={'normal'}
                                        variant={'outlined'}
                                        fullWidth
                                        value={this.state.attachment.linkedTo}
                                        onChange={e => this.updateAttachmentState('linkedTo', e.target.value)}
                                    >
                                        <MenuItem key={'address'} value={'address'} >{'Address'}</MenuItem>
                                        <MenuItem key={'personalinfo'} value={'personalinfo'} >{'Personal Info'}</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Expiry Date"
                                        margin="normal"
                                        variant="outlined"
                                        value={this.state.attachment.expirydate}
                                        onChange={e => this.updateAttachmentState('expirydate', e.target.value)}
                                        placeholder="Image Name"
                                        fullWidth
                                        InputProps={{
                                            type: 'date'
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Button variant="outlined" color="secondary" className={classes.button} style={{ float: 'right' }}
                                        onClick={this.addAttachment}
                                    >
                                        Add Attachment
                                        <AddIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.saveForm}
                                >
                                    Save for Later
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                >
                                    Submit to Admin
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        );

    }
};

const AddressForm = withStyles(styles)(class extends React.Component {
    constructor(props) {
        super(props);
        const { address } = props;
        this.state = {
            address: {
                zone: !!(address && address.zone) ? address.zone : '',
                sector: !!(address && address.sector) ? address.sector : '',
                plotNo: !!(address && address.plotNo) ? address.plotNo : '',
                fullAddress: !!(address && address.fullAddress) ? address.fullAddress : '',
                city: !!(address && address.city) ? address.city : '',
                country: !!(address && address.country) ? address.country : '',
                poBox: !!(address && address.poBox) ? address.poBox : ''
            }
        };
    }

    updateFormState = fieldName => event => {
        const value = event.target.value;
        if (Object.keys(this.state.address).includes(fieldName)) {
            this.setState(state => {
                state = cloneDeep(state);
                state.address[fieldName] = value;
                return state;
            }, () => {
                this.props.onChange && this.props.onChange(this.state.address);
            });
        }
    };

    removeAction = () => {
        this.props.onRemove && this.props.onRemove(this.state.address);
    };

    render() {
        const { classes } = this.props;
        const errors = this.props.errors || {};

        return (
            <Grid container spacing={8}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        onChange={this.updateFormState('zone')}
                        margin={'normal'}
                        variant={'outlined'}
                        fullWidth
                        value={this.state.address.zone}
                        label={'Zone'}
                        error={Object.keys(errors).includes('zone')}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        onChange={this.updateFormState('sector')}
                        margin={'normal'}
                        variant={'outlined'}
                        fullWidth
                        value={this.state.address.sector}
                        label={'Sector'}
                        error={Object.keys(errors).includes('sectror')}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        onChange={this.updateFormState('plotNo')}
                        margin={'normal'}
                        variant={'outlined'}
                        fullWidth
                        value={this.state.address.plotNo}
                        label={'Plot No'}
                        error={Object.keys(errors).includes('plotNo')}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        label="Street Address"
                        required
                        onBlur={this.updateFormState('fullAddress')}
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter full address"
                        defaultValue={this.state.address.fullAddress}
                        fullWidth
                        error={Object.keys(errors).includes('fullAddress')}
                        InputProps={{
                            type: 'text'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        label="P. O. Box/Pin Code"
                        margin="normal"
                        variant="outlined"
                        onBlur={this.updateFormState('poBox')}
                        defaultValue={this.state.address.poBox}
                        fullWidth
                        error={Object.keys(errors).includes('poBox')}
                        InputProps={{
                            type: 'text'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        required
                        label={'City'}
                        margin={'normal'}
                        variant={'outlined'}
                        fullWidth
                        onChange={this.updateFormState('city')}
                        error={Object.keys(errors).includes('city')}
                        value={this.state.address.city}
                    >
                        {
                            Object.keys(CITIES).map(cityId =>
                                <MenuItem key={cityId} value={cityId} disabled={!CITIES[cityId].enabled}>{CITIES[cityId].displayName}</MenuItem>
                            )
                        }
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        required
                        label="Country"
                        margin="normal"
                        variant="outlined"
                        onChange={this.updateFormState('country')}
                        error={Object.keys(errors).includes('country')}
                        value={this.state.address.country}
                        fullWidth
                    >
                        {
                            Object.keys(COUNTRIES).map(countryId =>
                                <MenuItem key={countryId} value={countryId} disabled={!COUNTRIES[countryId].enabled}>{COUNTRIES[countryId].displayName}</MenuItem>
                            )
                        }
                    </TextField>
                </Grid>
            </Grid>
        );
    }
});

const AttachmentTable = withStyles(styles)(class extends React.Component {
    constructor(props) {
        super(props);
    }
    editAttachment = index => {
        this.props.editAttachment(index);
    }
    deleteAttachment = index => {
        this.props.deleteAttachment(index);
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
                        <TableCell variant='head'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attachments.map((attachment, index) => (
                        <TableRow key={index} hover>
                            <TableCell variant='body'>{attachment.name}</TableCell>
                            <TableCell variant='body'>{attachment.linkedTo}</TableCell>
                            <TableCell variant='body'>{attachment.expirydate}</TableCell>
                            <TableCell variant='body'>
                                <EditIcon style={{ cursor: "pointer" }} onClick={e => this.editAttachment(index)} />
                                <DeleteIcon style={{ cursor: "pointer" }} onClick={e => this.deleteAttachment(index)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
});

export default withStyles(styles)(BuildingCommunityForm);