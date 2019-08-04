import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ErrorIcon from '@material-ui/icons/Error';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { CITIES, PROPERTY_TYPES, COUNTRIES, STATUS_TYPES, PROPERTYFEATURES } from '../../globals';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import LatLang from '../LatLang';

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

const PropertyForm = class extends React.Component {
    constructor(props) {
        super(props);
        const { property, owners, representatives } = this.props;
        this.state = {
            fabMenuAnchor: null,
            property: {
                id: !!(property && property.id) ? property.id : null,
                usage: !!(property && property.usage) ? property.usage : PROPERTY_TYPES.residential.value,
                type: !!(property && property.type) ? property.type : PROPERTY_TYPES.residential.types.apartment.value,

                details: !!(property && property.details) ? property.details : null,

                agent: !!(property && property.agent) ? property.agent : null,
                
                owner: !!(property && property.owner) ? property.owner : null,
                representative: !!(property && property.representative) ? property.representative : null,

                // features: !!(property && property.features) ? property.features : [],
                commercialSuitability: !!(property && property.commercialSuitability) ? property.commercialSuitability : [],
                buildingCommunityFeatures: !!(property && property.buildingCommunityFeatures) ? property.buildingCommunityFeatures : [],
                villaCommunityFeatures: !!(property && property.villaCommunityFeatures) ? property.villaCommunityFeatures : [],

                status: !!(property && property.status) ? property.status : STATUS_TYPES.PENDING,
                note: !!(property && property.note) ? property.note : 'This record has incorrect information',
                amenities: !!(property && property.amenities) ? property.amenities : [],
                attachments: !!(property && property.attachments) ? property.attachments : [],
                geocode: !!(property && property.geocode) ? property.geocode : { latitude: '', longitude: '' }
            },
            selected_owner: !!(property && property.owner) ? property.owner : null,
            selected_representative: !!(property && property.representative) ? property.representative : null,

            owners: owners || [],
            representatives: representatives || [],
            available_representatives: (property && property.owner && representatives) ? this.getRepresentativesByOwner(property.owner.id, representatives) : [],
            errors: {},

            expand_general_details: true, 
            expand_property_details: true, 
            expand_feature_details: true, 
            expand_attachment_details: true,
            attachment: { name: "", linkedTo: "", expirydate: "", image: [] },
            editAttachmentIndex: 0,
            isEditAttachment: false
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        // this.updateRepresentatives(false);
        const { selected_owner } = this.state;
        if (selected_owner)
            this.getRepresentativesByOwner(selected_owner.id);

    }

    handleFABClick = event => (this.setState({fabMenuAnchor: event.currentTarget}));
    handleFABMenuClose = event => (this.setState({fabMenuAnchor: null}));

    // updateRepresentatives = (clearRepresentative = true) => {
    //     const { actions } = this.props;
    //     const { property } = this.state;
    //     if(property.owner) {
    //         console.log('Fetching representatives');
    //         actions.getRepresentativesOfOwner(property.owner).then(
    //             representatives => {
    //                 clearRepresentative && this.updateFormState('representative', null);
    //                 this.setState({
    //                     representatives: representatives
    //                 })
    //             }
    //         ).catch(console.error);
    //     } else {
    //         this.updateFormState('representative', null);
    //         this.setState({
    //             representatives: []
    //         });
    //     }
    // };

    updateFormState = (key, value) => {
        if(Object.keys(this.state.property).includes(key)) {
            this.setState(state => {
                state = cloneDeep(state);
                state.property[key] = value;
                return state;
            });
        }

        // if(key === 'owner') {
        //     this.updateRepresentatives();
        // }
    };

    updateSelectedOwner = id => {
        let name = this.state.owners.find(o => o.id === id).name;

        this.setState({
            selected_owner: { id, name }
        });

        this.getRepresentativesByOwner(id);
    }

    getRepresentativesByOwner(ownerId, representatives) {
        representatives = representatives ? representatives : this.state.representatives;
        let available_representatives = representatives.filter(rep => rep.owner.id === ownerId);

        this.setState({
            available_representatives
        });
    }

    updateSelectedRepresentative = id => {
        let name = this.state.representatives.find(rep => rep.id === id).name;

        this.setState({
            selected_representative: { id, name }
        });
    }

    saveForm = event => {
        const { property, selected_owner, selected_representative } = this.state;

        this.handleFABMenuClose(event);

        if (property.details && !isEmpty(property.details.buildingName))
            this.props.onSubmit && this.props.onSubmit(property, selected_owner, selected_representative);
        else {
            // TODO: Show snackbar indicating that at least 'Property Name' is required to save
            document.getElementById("property-name").focus();
        }
            
    };

    onFormSubmit = (event) => {
        event.preventDefault();
        const errors = {};
        const { property, selected_owner, selected_representative } = this.state;

        this.handleFABMenuClose(event);

        // Validations
        let validationFailed = false;


        if(validationFailed) {
            this.setState({
                errors
            });
        } else {
            this.props.onSubmit && this.props.onSubmit(property, selected_owner, selected_representative, STATUS_TYPES.PENDING);
        }
    };

    setPropertyUsage = (e) => {
        const propertyUsage = PROPERTY_TYPES[e.target.value];
        if(!propertyUsage) {
            return;
        }
        const defaultType = PROPERTY_TYPES[propertyUsage.value].types[(Object.keys(propertyUsage.types)[0])];
        //previous here insted of state props was used
        const { property } = this.state;
        this.setState({
            property: {
                ...property,
                usage: propertyUsage.value,
                type: defaultType.value,
                features: [],
                commercialSuitability: [],
                buildingCommunityFeatures: [],
                villaCommunityFeatures: [],
                note: !!(property && property.note) ? property.note : 'This record has incorrect information'
            }
        });
    };
    setPropertyType = (e) => {
        const propertyType = PROPERTY_TYPES[this.state.property.usage].types[e.target.value];
        if (!propertyType) {
            return;
        }
        const defaultSubType = PROPERTY_TYPES[this.state.property.usage].types[e.target.value].categories[(Object.keys(propertyType.categories)[0])];
        //previous here insted of state props was used
        const property = {...this.state.property};
        const details = {...property.details}
        details.subType = defaultSubType.value;
        property.details = details;
        property.type = propertyType.value;
        property.note = !!(property && property.note) ? property.note : 'This record has incorrect information';
        this.setState({
            property
        });
    };

    toggleFeature = (featureType) => (feature) => () => {
        const { property } = this.state;
        let selectedFeatures = property[featureType].concat();
        if(selectedFeatures.includes(feature)) {
            // Remove feature
            selectedFeatures = selectedFeatures.filter(f => f !== feature);
        } else {
            // Add feature
            selectedFeatures = selectedFeatures.concat(feature);
        }

        this.setState({
            property: {
                ...property,
                [featureType]: selectedFeatures
            }
        });
    };

    toggleAmenities = amenities => {
        const { property } = this.state;
        let selectedAmenities = property.amenities;
        if (selectedAmenities.includes(amenities)) {
            // Remove feature
            selectedAmenities = selectedAmenities.filter(a => a !== amenities);
        } else {
            // Add feature
            selectedAmenities = selectedAmenities.concat(amenities);
        }

        this.setState({
            property: {
                ...property,
                amenities: selectedAmenities
            }
        });
    }

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
            alert("Select file is related personal info or details");
            return false
        }
        const property = { ...this.state.property };
        const attachments = property.attachments;
        if (this.state.isEditAttachment) {
            attachments[this.state.editAttachmentIndex] = this.state.attachment;

        } else {
            attachments.push(attachment);
        }
        property.attachments = attachments;
        this.setState({
            property,
            attachment: { name: "", linkedTo: "", expirydate: "", image: [] },
            isEditAttachment: false
        })
    };

    deleteAttachment = index => {
        const property = { ...this.state.property };
        const attachment = [...property.attachments];
        attachment.splice(index, 1);
        property.attachments = attachment;
        this.setState({
            property
        })
    }
    editAttachment = index => {
        const property = { ...this.state.property };
        const attachments = [...property.attachments];
        const attachment = attachments[index];
        this.setState({
            attachment,
            editAttachmentIndex: index,
            isEditAttachment: true
        });
    }
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
    updateGeocode = (coordinate) => {
        let { property } = { ...this.state };
        let { geocode } = { ...property }
        geocode.latitude = coordinate.latitude;
        geocode.longitude = coordinate.longitude;
        property.geocode = geocode;
        this.setState({
            property
        })
    }

   /* renderFeatureChips = ({ featureType, featureItems }) => {
        const { property } = this.state;
        const selectedFeatures = property[featureType];
        return (
            <React.Fragment>
                {
                    featureItems.map(feature => (
                        <Grid item key={feature}>
                            <Chip
                                label={feature}
                                onClick={this.toggleFeature(featureType)(feature)}
                                color={selectedFeatures.includes(feature) ? 'primary': 'default'}
                            />
                        </Grid>
                    ))
                }
            </React.Fragment>
        );
    };*/
    
    /*renderFeatureGroup = () => {
        const { property } = this.state;
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
        const { property, errors, owners, /*representatives,*/ available_representatives } = this.state;
        const { selected_owner, selected_representative } = this.state;
        const selectedAmenities = this.state.property.amenities;

        return (
            <form autoComplete="off" ref={this.formRef} onSubmit={this.onFormSubmit}>
                {/* <AbsoluteFAB icon={<SaveIcon />} type={'submit'}/> */}
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
                                            <ErrorIcon color="primary" style={{marginTop: 15}} />
                                        </center>
                                    </Grid>
                                    <Grid item xs={10} sm={10}>
                                        <Typography variant={'h6'}>
                                            Note from Admin
                                        </Typography>
                                        <Typography variant={'p'}>
                                            { property.note }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    }
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
                                    <TextField
                                        select
                                        label="Owner"
                                        // value={property.owner || ''}
                                        // onChange={e => this.updateFormState('owner', e.target.value)}
                                        onChange={e => this.updateSelectedOwner(e.target.value)}
                                        value={selected_owner ? selected_owner.id : ''}
                                        error={Object.keys(errors).includes('owner')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        InputProps={{
                                            type: 'text'
                                        }}
                                    >
                                        {
                                            owners && owners.map(owner => (
                                                <MenuItem key={owner.id} value={owner.id}>{owner.name}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Representative"
                                        // value={property.representative || ''}
                                        // onChange={e => this.updateFormState('representative', e.target.value)}
                                        onChange={e => this.updateSelectedRepresentative(e.target.value)}
                                        value={selected_representative ? selected_representative.id : ''}
                                        error={Object.keys(errors).includes('representative')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        disabled={available_representatives && available_representatives.length === 0}
                                        InputProps={{
                                            type: 'text'
                                        }}
                                    >
                                        {/* <MenuItem value={null}>None</MenuItem> */}
                                        {
                                            available_representatives && available_representatives.map(representative => (
                                                <MenuItem key={representative.id} value={representative.id}>{representative.name}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label={'Property Usage'}
                                        onChange={this.setPropertyUsage}
                                        error={Object.keys(errors).includes('type')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={property.usage}
                                    >
                                        {
                                            Object.keys(PROPERTY_TYPES).map(usage =>
                                                <MenuItem key={usage} value={PROPERTY_TYPES[usage].value}>{PROPERTY_TYPES[usage].displayName}</MenuItem>
                                            )
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label={'Property Type'}
                                        onChange={this.setPropertyType}
                                        // onChange={e => this.updateFormState('type', e.target.value)}
                                        error={Object.keys(errors).includes('type')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={property.type}
                                    >
                                        {
                                            Object.keys(PROPERTY_TYPES[property.usage].types).map(type =>
                                                <MenuItem key={type} value={type}>{PROPERTY_TYPES[property.usage].types[type].displayName}</MenuItem>
                                            )
                                        }
                                    </TextField>
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
                                    <PropertyDetails 
                                    property={this.state.property} 
                                    onChange={details => this.updateFormState('details', details)} 
                                    onRemove={null} errors={null}
                                    buildingData={this.props.buildingData} 
                                    communityData={this.props.communityData}
                                    />
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
                                    <LatLang updateGeocode={this.updateGeocode} geocode={property.geocode} />
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
                                        { "Amenities & Features" }
                                    </Typography>
                                </Grid>
                            </Grid>
                            {/* <Collapse in={this.state.expand_feature_details} timeout="auto" unmountOnExit>
                                <Grid container spacing={8}>
                                {
                                    this.renderFeatureGroup()
                                }
                                </Grid>
                            </Collapse> */}
                            <Grid container spacing={8}>
                                {
                                    PROPERTYFEATURES.map(amenities => (
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
                                        property.attachments.length > 0 ? (
                                            <AttachmentTable attachments={property.attachments} deleteAttachment={this.deleteAttachment} editAttachment={this.editAttachment} />
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
                                        <MenuItem key={'general details'} value={'general details'} >{'General Details'}</MenuItem>
                                        <MenuItem key={'property details'} value={'property details'} >{'Property Details'}</MenuItem>
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
                            <Grid item xs={4} sm={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.saveForm}
                                >
                                    Save for Later
                                </Button>
                            </Grid>
                            <Grid item xs={4} sm={2}>
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

const PropertyDetails = withStyles(styles)(class extends React.Component {
    constructor(props) {
        super(props);
        const { details } = props.property;

        this.state = {
            details: {
                subType: !!(details && details.subType) ? details.subType : '',
                buildingName: !!(details && details.buildingName) ? details.buildingName : '',
                communityName: !!(details && details.communityName) ? details.communityName : '',
                floor: !!(details && details.floor) ? details.floor : '',
                storeys: !!(details && details.storeys) ? details.storeys : '',
                unitId: !!(details && details.unitId) ? details.unitId : '',
                bedrooms: !!(details && details.bedrooms) ? details.bedrooms : '',
                bathroom: !!(details && details.bathroom) ? details.bathroom : '',
                area: !!(details && details.area) ? details.area : ''
            }
        };
    }

    updateFormState = fieldName => event => {
        const value = event.target.value;
        if(Object.keys(this.state.details).includes(fieldName)) {
            this.setState(state => {
                state = cloneDeep(state);
                state.details[fieldName] = value;
                return state;
            }, () => {
                this.props.onChange && this.props.onChange(this.state.details);
            });
        }
    };

    render() {
        const { property, classes, buildingData, communityData } = this.props;
        const errors = this.props.errors || {};

        return (
            <Grid container spacing={8}>
            {
                    property.usage === "residential" ? (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                required
                                label={'Sub Type'}
                                margin={'normal'}
                                variant={'outlined'}
                                fullWidth
                                onChange={this.updateFormState('subType')}
                                value={this.state.details.subType}
                            >
                                {
                                    Object.keys(PROPERTY_TYPES[property.usage].types[property.type].categories).map(category =>
                                        <MenuItem key={category} value={category}>{PROPERTY_TYPES[property.usage].types[property.type].categories[category].displayName}</MenuItem>
                                    )
                                }
                            </TextField>
                        </Grid>
                    ) : null
            }

            {
                    property.type && property.type === "villa" ? null : (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                required
                                label={'Building Name'}
                                margin={'normal'}
                                variant={'outlined'}
                                fullWidth
                                onChange={this.updateFormState('buildingName')}
                                value={this.state.details.buildingName}
                            >
                                {
                                    buildingData && buildingData.map(building =>
                                        <MenuItem key={building} value={building}>{building}</MenuItem>
                                    )
                                }
                            </TextField>
                        </Grid>
                        
                    )
            }
                <Grid item xs={12} sm={6}>
                    <TextField
                    select
                        label="Community Name"
                        margin="normal"
                        variant="outlined"
                        onChange={this.updateFormState('communityName') }
                        value={this.state.details.communityName}
                        fullWidth
                        >
                        {
                            communityData && communityData.map(community =>
                                <MenuItem key={community} value={community}>{community}</MenuItem>
                            )
                        }
                        </TextField>
                </Grid>
                {
                    property.type && property.type === "villa" ? null : (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Floor"
                                required
                                onBlur={this.updateFormState('floor')}
                                margin="normal"
                                variant="outlined"
                                placeholder="Floor"
                                defaultValue={this.state.details.floor}
                                fullWidth
                                error={Object.keys(errors).includes('floor')}
                                InputProps={{
                                    type: 'text'
                                }}
                            />
                        </Grid>
                    )
                }
                
                {
                    property.type && property.type === "apartment" ? null : (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Storeys"
                                required
                                onBlur={this.updateFormState('storeys')}
                                margin="normal"
                                variant="outlined"
                                placeholder="Storeys"
                                defaultValue={this.state.details.storeys}
                                fullWidth
                                error={Object.keys(errors).includes('storeys')}
                                InputProps={{
                                    type: 'text'
                                }}
                            />
                        </Grid>
                    )
                }
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Unit ID"
                        required
                        onBlur={ this.updateFormState('unitId') }
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter full details"
                        defaultValue={this.state.details.unitId}
                        fullWidth
                        error={Object.keys(errors).includes('unitId')}
                        InputProps={{
                            type: 'text'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        label="Bedrooms"
                        margin="normal"
                        variant="outlined"
                        onBlur={this.updateFormState('bedrooms')}
                        defaultValue={this.state.details.bedrooms}
                        fullWidth
                        error={Object.keys(errors).includes('bedrooms')}
                        InputProps={{
                            type: 'text'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        label="Bathroom"
                        margin="normal"
                        variant="outlined"
                        onBlur={this.updateFormState('bathroom')}
                        defaultValue={this.state.details.bathroom}
                        fullWidth
                        error={Object.keys(errors).includes('bathroom')}
                        InputProps={{
                            type: 'text'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        label="Area"
                        margin="normal"
                        variant="outlined"
                        onBlur={this.updateFormState('area')}
                        defaultValue={this.state.details.area}
                        fullWidth
                        error={Object.keys(errors).includes('area')}
                        InputProps={{
                            type: 'text'
                        }}
                    />
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

export default withStyles(styles)(PropertyForm);