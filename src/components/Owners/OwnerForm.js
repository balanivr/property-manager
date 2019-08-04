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
import { CITIES, PREFIXES, ADDRESS_TYPES, COUNTRIES, STATUS_TYPES, EMAILTYPES, PHONETYPES } from '../../globals';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

const OwnerForm = class extends React.Component {
    constructor(props) {
        super(props);
        const { owner } = this.props;
        this.state = {
            fabMenuAnchor: null,
            owner: {
                id: !!(owner && owner.id) ? owner.id : null,
                prefix: !!(owner && owner.prefix) ? owner.prefix : '',
                name: !!(owner && owner.name) ? owner.name : '',
                emails: !!(owner && owner.emails) ? owner.emails : [{ emailtype: "", email: "" }],
                nationality: !!(owner && owner.nationality) ? owner.nationality : '',
                phoneNumbers: !!(owner && owner.phoneNumbers) ? owner.phoneNumbers : [{ phonetype: "", number: "" }],
                addresses: !!(owner && owner.addresses) ? owner.addresses : [],
                status: !!(owner && owner.status) ? owner.status : STATUS_TYPES.PENDING,
                note: !!(owner && owner.note) ? owner.note : 'This record has incorrect information',
                attachments: !!(owner && owner.attachments) ? owner.attachments : []
            },
            errors: {},
            attachment: { name: "", linkedTo: "", expirydate: "", image: [] },
            editAttachmentIndex: 0,
            isEditAttachment: false,
            address: {
                addressType: "",
                fullAddress: "",
                poBox: "",
                city: "",
                country: ""
            },
            editAddressIndex: 0,
            isEditAddress: false
        };

        this.formRef = React.createRef();
    }

    handleFABClick = event => (this.setState({ fabMenuAnchor: event.currentTarget }));
    handleFABMenuClose = event => (this.setState({ fabMenuAnchor: null }));

    updateFormState = (key, value) => {
        console.log('Owner form updateFormState', key, value);
        if (Object.keys(this.state.owner).includes(key)) {
            this.setState(state => {
                state = cloneDeep(state);
                state.owner[key] = value;
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

    updateAddress = index => address => {
        let addresses = cloneDeep(this.state.owner.addresses);
        addresses[index] = address;
        this.updateFormState('addresses', addresses);
    };

    addNewAddress = () => {
        const addresses = cloneDeep(this.state.owner.addresses);
        addresses.push({});
        this.updateFormState('addresses', addresses);
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
        const owner = { ...this.state.owner };
        const attachments = owner.attachments;
        if (this.state.isEditAttachment) {
            attachments[this.state.editAttachmentIndex] = this.state.attachment;

        } else {
            attachments.push(attachment);
        }
        owner.attachments = attachments;
        this.setState({
            owner,
            attachment: { name: "", linkedTo: "", expirydate: "", image: [] },
            isEditAttachment: false
        })
    };

    removeAddressIndex = (index) => (address) => {
        let addresses = cloneDeep(this.state.owner.addresses);
        addresses.splice(index, 1);
        if (addresses.length !== 0) {
            this.updateFormState('addresses', addresses);
        }
    };

    saveForm = event => {
        const { owner } = this.state;

        this.handleFABMenuClose(event);

        if (!isEmpty(owner.name))
            this.props.onSubmit && this.props.onSubmit(owner);
        else {
            // TODO: Show snackbar indicating that at least 'First Name' is required to save
            document.getElementById("owner-name").focus();
        }

    };

    onFormSubmit = (event, status) => {
        event.preventDefault();
        const errors = {};
        const { owner } = this.state;

        this.handleFABMenuClose(event);

        // Validations
        let validationFailed = false;
        if (isEmpty(owner.prefix)) {
            errors['prefix'] = {};
            validationFailed = true;
        }

        if (owner.addresses && owner.addresses.length > 0) {
            const addressErrors = [];
            owner.addresses.forEach(address => {
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
            });
            errors.addresses = addressErrors;
        }

        if (validationFailed) {
            this.setState({
                errors
            });
        } else {
            this.props.onSubmit && this.props.onSubmit(this.state.owner, STATUS_TYPES.PENDING);
        }
    };
    deleteAttachment = index => {
        const owner = { ...this.state.owner };
        const attachment = [...owner.attachments];
        attachment.splice(index, 1);
        owner.attachments = attachment;
        this.setState({
            owner
        })
    }
    editAttachment = index => {
        const owner = { ...this.state.owner };
        const attachments = [...owner.attachments];
        const attachment = attachments[index];
        this.setState({
            attachment,
            editAttachmentIndex: index,
            isEditAttachment: true
        });
    }

    addContactDetails = key => {
        const { owner } = { ...this.state };
        if (key === "email") {
            let emails = [...owner.emails, { emailtype: "", email: "" }];
            owner.emails = emails;
        } else {
            let phoneNumbers = [...owner.phoneNumbers, { phonetype: "", number: "" }];
            owner.phoneNumbers = phoneNumbers;
        }
        this.setState({
            owner
        });
    };
    removeContactDetails = (key, index) => {
        const { owner } = { ...this.state };
        if (key === "email") {
            let emails = [...owner.emails];
            if (emails.length === 1) {
                alert("Last element can't be deleted");
                return
            }
            emails.splice(index, 1);
            owner.emails = emails;
        } else {
            let phoneNumbers = [...owner.phoneNumbers];
            if (phoneNumbers.length === 1) {
                alert("Last element can't be deleted")
                return;
            }
            phoneNumbers.splice(index, 1);
            owner.phoneNumbers = phoneNumbers;
        }
        this.setState({
            owner
        });
    };
    handleContacts = (key, value, index) => {
        const { owner } = { ...this.state };
        console.log(owner);
        if (key === "email" || key === "emailtype") {
            let emails = [...owner.emails];
            let singleEmail = emails[index];
            singleEmail[key] = value;
            emails[index] = singleEmail;
            owner.emails = emails;
        } else {
            let phoneNumbers = [...owner.phoneNumbers];
            let singlePhone = phoneNumbers[index];
            singlePhone[key] = value;
            phoneNumbers[index] = singlePhone;
            owner.phoneNumbers = phoneNumbers;
        }
        this.setState({
            owner
        });
    };

    updateAddressState = (key, value) => {
        const { address } = this.state;
        address[key] = value;
        this.setState({
            address
        });
    };
    deleteAddress = index => {
        const owner = { ...this.state.owner };
        const address = [...owner.addresses];
        address.splice(index, 1);
        owner.addresses = address;
        this.setState({
            owner
        });
    };
    editAddress = index => {
        const owner = { ...this.state.owner };
        const addresses = [...owner.addresses];
        const address = addresses[index];
        this.setState({
            address,
            editAddressIndex: index,
            isEditAddress: true
        });
    };
    addNewAddresstoTable = () => {
        const { address } = this.state;
        if (address.addressType === "") {
            alert("Enter address type");
            return false;
        }
        if (address.fullAddress === "") {
            alert("Enter full Address");
            return false;
        }
        if (address.poBox === "") {
            alert("Enter P. O. Box/Pin Code");
            return false;
        }
        if (address.city === "") {
            alert("Enter City");
            return false;
        }
        if (address.country === "") {
            alert("Enter Country");
            return false;
        }
        const owner = { ...this.state.owner };
        const addresses = owner.addresses;
        if (this.state.isEditAddress) {
            console.log("update");
            addresses[this.state.editAddressIndex] = this.state.address;
        } else {
            addresses.push(address);
        }
        owner.addresses = addresses;
        this.setState({
            owner,
            address: {
                addressType: "",
                fullAddress: "",
                poBox: "",
                city: "",
                country: ""
            },
            isEditAddress: false
        });
    };

    render() {
        const { classes } = this.props;
        const { owner, errors } = this.state;

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
                                            {owner.note}
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
                                        Basic Information
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        onChange={e => this.updateFormState('prefix', e.target.value)}
                                        margin={'normal'}
                                        variant={'outlined'}
                                        value={owner.prefix}
                                        placeholder={'Select prefix'}
                                        label={'Prefix'}
                                        error={Object.keys(errors).includes('prefix')}
                                        InputProps={{
                                            type: 'text',
                                        }}
                                    >
                                        {
                                            PREFIXES.map(prefix =>
                                                <MenuItem key={prefix} value={prefix}>{prefix}</MenuItem>
                                            )
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item xs={8} sm={10}>
                                    <TextField
                                        id="owner-name"
                                        label="Full Name"
                                        defaultValue={owner.name}
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
                                {/* <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="E-Mail Address"
                                        defaultValue={owner.email}
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
                                </Grid> */}
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Nationality"
                                        defaultValue={owner.nationality}
                                        onBlur={e => this.updateFormState('nationality', e.target.value)}
                                        error={Object.keys(errors).includes('nationality')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        InputProps={{
                                            type: 'text'
                                        }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Phone Number"
                                        defaultValue={owner.phoneNumber}
                                        onBlur={e => this.updateFormState('phoneNumber', e.target.value)}
                                        error={Object.keys(errors).includes('nationality')}
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        InputProps={{
                                            type: 'number'
                                        }}
                                    />
                                </Grid> */}
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={2} className={classes.paper} >
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={"h6"}>Contact Information</Typography>
                                </Grid>
                                <Grid container xs={12} spacing={8} style={{ alignItems: "center" }}>
                                    {owner.emails.map((element, index) => {
                                        return (
                                            <React.Fragment>
                                                <Grid item xs={5}>
                                                    <TextField
                                                        select
                                                        label="E-mail Type"
                                                        value={element.emailtype}
                                                        onChange={e =>
                                                            this.handleContacts(
                                                                "emailtype",
                                                                e.target.value,
                                                                index
                                                            )
                                                        }
                                                        margin="normal"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    >
                                                        {EMAILTYPES.map(emailType => (
                                                            <MenuItem key={emailType} value={emailType}>
                                                                {emailType}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <TextField
                                                        label="E-Mail Address"
                                                        value={element.email}
                                                        onChange={e =>
                                                            this.handleContacts(
                                                                "email",
                                                                e.target.value,
                                                                index
                                                            )
                                                        }
                                                        error={Object.keys(errors).includes("email")}
                                                        margin="normal"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        InputProps={{
                                                            type: "email"
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <span
                                                        onClick={() => this.removeContactDetails("email", index)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <RemoveIcon />
                                                    </span>
                                                </Grid>
                                            </React.Fragment>
                                        );
                                    })}
                                    <Grid item xs={1}>
                                        <span
                                            onClick={() => this.addContactDetails("email")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AddIcon />
                                        </span>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} style={{ alignItems: "center" }}>
                                    {owner.phoneNumbers.map((element, index) => {
                                        return (
                                            <React.Fragment>
                                                <Grid item xs={5}>
                                                    <TextField
                                                        select
                                                        label="Phone Type"
                                                        value={element.phonetype}
                                                        onChange={e =>
                                                            this.handleContacts(
                                                                "phonetype",
                                                                e.target.value,
                                                                index
                                                            )
                                                        }
                                                        margin="normal"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                    >
                                                        {PHONETYPES.map(phoneType => (
                                                            <MenuItem key={phoneType} value={phoneType}>
                                                                {phoneType}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <TextField
                                                        label="Phone Number"
                                                        value={element.number}
                                                        onChange={e =>
                                                            this.handleContacts(
                                                                "number",
                                                                e.target.value,
                                                                index
                                                            )
                                                        }
                                                        margin="normal"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        InputProps={{
                                                            type: "number"
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <span
                                                        onClick={() =>
                                                            this.removeContactDetails("phoneNumber", index)
                                                        }
                                                        style={{
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <RemoveIcon />
                                                    </span>
                                                </Grid>
                                            </React.Fragment>
                                        );
                                    })}
                                    <Grid item xs={1}>
                                        <span
                                            onClick={() => this.addContactDetails("phoneNumber")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AddIcon />
                                        </span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <Typography variant={"h6"}>Address details</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    {owner.addresses.length > 0 ? (
                                        <AddressTable
                                            addresses={owner.addresses}
                                            deleteAddress={this.deleteAddress}
                                            editAddress={this.editAddress}
                                        />
                                    ) : null}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        select
                                        onChange={e =>
                                            this.updateAddressState("addressType", e.target.value)
                                        }
                                        margin={"normal"}
                                        variant={"outlined"}
                                        fullWidth
                                        value={this.state.address.addressType}
                                        label={"Address type"}
                                        error={Object.keys(errors).includes("addressType")}
                                    >
                                        {ADDRESS_TYPES.map(addressType => (
                                            <MenuItem key={addressType} value={addressType}>
                                                {addressType}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        label="Street Address"
                                        onChange={e =>
                                            this.updateAddressState("fullAddress", e.target.value)
                                        }
                                        margin="normal"
                                        variant="outlined"
                                        placeholder="Enter full address"
                                        value={this.state.address.fullAddress}
                                        fullWidth
                                        error={Object.keys(errors).includes("fullAddress")}
                                        InputProps={{
                                            type: "text"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="P. O. Box/Pin Code"
                                        margin="normal"
                                        variant="outlined"
                                        onChange={e =>
                                            this.updateAddressState("poBox", e.target.value)
                                        }
                                        value={this.state.address.poBox}
                                        fullWidth
                                        error={Object.keys(errors).includes("poBox")}
                                        InputProps={{
                                            type: "text"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label={"City"}
                                        margin={"normal"}
                                        variant={"outlined"}
                                        fullWidth
                                        onChange={e =>
                                            this.updateAddressState("city", e.target.value)
                                        }
                                        error={Object.keys(errors).includes("city")}
                                        value={this.state.address.city}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Country"
                                        margin="normal"
                                        variant="outlined"
                                        onChange={e =>
                                            this.updateAddressState("country", e.target.value)
                                        }
                                        error={Object.keys(errors).includes("country")}
                                        value={this.state.address.country}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        className={classes.button}
                                        style={{ float: "right" }}
                                        onClick={this.addNewAddresstoTable}
                                    >
                                        Save
                  </Button>
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
                                        owner.attachments.length > 0 ? (
                                            <AttachmentTable attachments={owner.attachments} deleteAttachment={this.deleteAttachment} editAttachment={this.editAttachment} />
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
                                    {/* <input
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        type="file"
                                        // value={this.state.attachment.image.length > 0 ? this.state.attachment.image[0].name : null}
                                        onChange={this.updateImageState}
                                    /> */}
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
                addressType: !!(address && address.addressType) ? address.addressType : '',
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
        console.log(this.state.address);
        const { classes } = this.props;
        const errors = this.props.errors || {};

        return (
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <Typography variant="h6" style={{ paddingRight: 10, paddingTop: 15, textAlign: 'right' }}>
                        <Button variant="outlined" color="secondary" className={classes.button} style={{ marginLeft: 10 }}
                            onClick={this.removeAction}
                        >
                            Remove
                            <RemoveIcon />
                        </Button>
                    </Typography>

                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        required
                        onChange={this.updateFormState('addressType')}
                        margin={'normal'}
                        variant={'outlined'}
                        fullWidth
                        value={this.state.address.addressType}
                        label={'Address type'}
                        error={Object.keys(errors).includes('addressType')}
                    >
                        {
                            ADDRESS_TYPES.map(addressType =>
                                <MenuItem key={addressType} value={addressType}>{addressType}</MenuItem>
                            )
                        }
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={8}>
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
                        required
                        label={'City'}
                        margin={'normal'}
                        variant={'outlined'}
                        fullWidth
                        onBlur={this.updateFormState('city')}
                        error={Object.keys(errors).includes('city')}
                        defaultValue={this.state.address.city}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        label="Country"
                        margin="normal"
                        variant="outlined"
                        onBlur={this.updateFormState('country')}
                        error={Object.keys(errors).includes('country')}
                        defaultValue={this.state.address.country}
                        fullWidth
                    >
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

const AddressTable = withStyles(styles)(
    class extends React.Component {
        constructor(props) {
            super(props);
        }
        editAddress = index => {
            this.props.editAddress(index);
        };
        deleteAddress = index => {
            this.props.deleteAddress(index);
        };
        render() {
            const { addresses } = this.props;

            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant="head">Address Type</TableCell>
                            <TableCell variant="head">Address</TableCell>
                            <TableCell variant="head">P. O. Box/Pin Code</TableCell>
                            <TableCell variant="head">City</TableCell>
                            <TableCell variant="head">Country</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {addresses.map((address, index) => (
                            <TableRow key={index} hover>
                                <TableCell variant="body">{address.addressType}</TableCell>
                                <TableCell variant="body">{address.fullAddress}</TableCell>
                                <TableCell variant="body">{address.poBox}</TableCell>
                                <TableCell variant="body">{address.city}</TableCell>
                                <TableCell variant="body">{address.country}</TableCell>
                                <TableCell variant="body">
                                    <EditIcon
                                        style={{ cursor: "pointer" }}
                                        onClick={e => this.editAddress(index)}
                                    />
                                    <DeleteIcon
                                        style={{ cursor: "pointer" }}
                                        onClick={e => this.deleteAddress(index)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            );
        }
    }
);

export default withStyles(styles)(OwnerForm);