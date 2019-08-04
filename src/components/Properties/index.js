import React from 'react';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';

import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import PropertyViewingTable from './PropertyViewingTable';
import PropertyTable from './PropertyTable';
import PropertyDialog from './PropertyDialog';
import PropertyForm from './PropertyForm';
import PropertyView from './PropertyView';
import {withStyles} from "@material-ui/core";
import {USER_TYPES, STATUS_TYPES, ACTIVE_STATES} from "../../globals";
import get from "lodash/get";

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
    },
    content: {
        // minWidth: 780
    },

    paper: {
        margin: [[84, 18, 18, 18]],
    }
});

class Property extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            dialogOpen: false,
            dialogTitle: "Add property",
            dialogAction: "Save",
            formValue: null,
            formErrors: {},
            properties: [],
            records_type: '',
            owners: [],
            representatives: [],
            buildingData: [],
            communityData: []
        };


    }
    componentDidMount() {
        // this.props.actions.getAllProperties().then(properties => {
        //     console.log('Fetched properties');
        //     this.setState({
        //         properties
        //     });
        // }).catch(err => {
        //     console.error('Failed to fetch properties', err);
        // });

        // const { user, actions } = this.props;
        // const userType = get(user, 'type');
        // const userId = get(user, 'id');

        // if(userType === USER_TYPES.AGENT) {
        //     console.log('Fetching owners of agent');
        //     actions.getOwnersOfAgent(userId).then(
        //         owners => {
        //             this.setState({
        //                 owners
        //             });
        //         }
        //     ).catch(console.error);
        // } else {
        //     console.log('Fetching all owners');
        //     actions.getAllOwners().then(
        //         owners => {
        //             this.setState({
        //                 owners
        //             });
        //         }
        //     ).catch(console.error);
        // }
        this.getProperties();
        this.getBuildingAndCommunity();
        // this.getOwners();
    }
    getBuildingAndCommunity(){
        let status="";
        this.props.actions.getBuildingOrCommunity(status).then(buildingAndCommunity=>{
            let communityData = [];
            let buildingData = [];
            buildingAndCommunity.forEach(element => {
                if (element.type === "Building"){
                    buildingData.push(element.name);
                }else{
                    communityData.push(element.name);
                }
            });
            this.setState({
                buildingData,
                communityData
            });
        }).catch(err => console.log(err))
        
    }
    getProperties(records_type = false) {
        const { user } = this.props;
        const userType = get(user, 'type');
        const userId = get(user, 'id');

        if(userId == null || !Object.values(USER_TYPES).includes(userType)) {
            return;
        }

        if (!records_type)
            records_type = USER_TYPES.ADMIN === userType ? STATUS_TYPES.PENDING : STATUS_TYPES.DRAFT;
        
        // const fetchAction = USER_TYPES.ADMIN === userType ? this.props.actions.getAllProperties(records_type) : this.props.actions.getPropertiesOfAgent(userId, records_type);

        if (USER_TYPES.ADMIN === userType) {
            this.props.actions.getAllProperties(records_type).then(properties => {
                console.log(`Fetched properties of type ${records_type} for ${userType}`);
                this.setState({
                    records_type,
                    properties
                });
            }).catch(err => {
                console.error('Failed to fetch properties', err);
            });
        }
        else {
            this.props.actions.getPropertiesOfAgent(userId, records_type).then(properties => {
                console.log(`Fetched properties of type ${records_type} for ${userType}`);

                this.props.actions.getOwnersOfAgent(userId).then(owners => {
                    console.log(`Fetched owners for ${userType}`);

                    this.props.actions.getRepresentativesOfAgent(userId).then(representatives => {
                        console.log(`Fetched representatives for ${userType}`);
                        this.setState({
                            records_type,
                            properties,
                            owners,
                            representatives
                        })
                    }).catch(err => {
                        console.error('Failed to fetch owners', err);
                    });

                    // this.setState({
                    //     records_type,
                    //     properties,
                    //     owners
                    // });
                }).catch(err => {
                    console.error('Failed to fetch owners', err);
                });

                // this.setState({
                //     records_type,
                //     properties
                // });
            }).catch(err => {
                console.error('Failed to fetch properties', err);
            });
        }
    }

    getOwners(records_type = false) {
        const { user } = this.props;
        const userType = get(user, 'type');
        const userId = get(user, 'id');

        if(userId == null || !Object.values(USER_TYPES).includes(userType)) {
            return;
        }

        if (!records_type)
            records_type = USER_TYPES.ADMIN === userType ? STATUS_TYPES.PENDING : STATUS_TYPES.DRAFT;
        
        const fetchAction = USER_TYPES.ADMIN === userType ? this.props.actions.getAllOwners(/*records_type*/) : this.props.actions.getOwnersOfAgent(userId/*, records_type*/);

        fetchAction.then(owners => {
            console.log(`Fetched owners for ${userType}`);
            this.setState({
                records_type,
                owners
            });
        }).catch(err => {
            console.error('Failed to fetch owners', err);
        });
    }

    closeForm = ()  => {
        this.setState({
            dialogOpen: false,
            formValue: null,
        });
    };

    onFormSave = async(propertyData, owner, representative, status=false) => {
        const updateAttachments = [];
        const { attachments } = propertyData;
        for (const attachment of attachments) {
            if (attachment.isUpload) {
                await this.props.actions.uploadImage('/representative/', attachment.image).then(image => {
                    const newAttachment = {
                        name: attachment.name,
                        linkedTo: attachment.linkedTo,
                        expirydate: attachment.expirydate,
                        image: image
                    }
                    updateAttachments.push(newAttachment)
                    console.log("saved", image)
                }).catch(error => {
                    console.log("error");
                })
            } else {
                const newAttachment = {
                    name: attachment.name,
                    linkedTo: attachment.linkedTo,
                    expirydate: attachment.expirydate,
                    image: attachment.image
                }
                updateAttachments.push(newAttachment);
            }
        }
        propertyData.attachments = updateAttachments;

        const { user } = this.props;
        status = status ? status : STATUS_TYPES.DRAFT;
        
        if(propertyData.id == null) {
            console.log('Creating property', propertyData);
            this.props.actions.createProperty(propertyData, owner, representative, user, status).then((createdProperty) => {
                this.setState({
                    dialogOpen: false,
                    formValue: null,
                    properties: this.state.properties.concat(createdProperty)
                })
            }).catch(error => console.error(error));
        } else {
            console.log('Updating property', propertyData);
            this.props.actions.updateProperty(propertyData, owner, representative, status).then(() => {
                this.setState({
                    dialogOpen: false,
                    formValue: null,
                    properties: this.state.properties.map(property => property.id === propertyData.id ? propertyData : property)
                });
            }).catch(error => console.error(error));
        }
    };

    openDetailsDialog = (property) => {
        const { user } = this.props;
        this.setState({
            dialogOpen: true,
            formValue: property,
            dialogTitle: user.type === USER_TYPES.ADMIN ? property.name : 'Edit Property'
        });
    };

    updateRecordsType = (event) => {
        const records_type = event.target.value;

        this.setState({ records_type });
        this.getProperties(records_type);
        // this.getOwners(records_type);
    }

    toggleStatus = (property, status) => {
        this.props.actions.updatePropertyStatus(property.id, status).then(
            () => {
                this.setState({
                    properties: this.state.properties.map(ppty => property.id !== ppty.id ? ppty : {
                        ...ppty,
                        status
                    })
                })
            }
        );
    };

    sendForApproval = (property) => {
        console.log('sending for approval');
        this.props.actions.updatePropertyProperties(property.id, {status: STATUS_TYPES.PENDING}).then(
            () => {
                this.setState({ dialogOpen: false });
                this.getProperties(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
                // this.getOwners(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
            }
        )
    }

    approveProperty = (property) => {
        console.log('approved property');
        this.props.actions.updatePropertyProperties(property.id, {
            status: STATUS_TYPES.APPROVED,
            active: ACTIVE_STATES.ACTIVE,
        }).then(
            () => {
                this.setState({ dialogOpen: false });
                this.getProperties(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
                // this.getOwners(this.state.records_type ? this.state.records_type : STATUS_TYPES.APPROVED);
            }
        )
    }

    rejectProperty = (property, note) => {
        console.log('sent property for correction');
        this.props.actions.updatePropertyProperties(property.id, {
                status: STATUS_TYPES.NEEDS_CORRECTION,
                note
            }).then(() => {
                this.setState({ dialogOpen: false });
                this.getProperties(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
                // this.getOwners(this.state.records_type ? this.state.records_type : STATUS_TYPES.NEEDS_CORRECTION);
            });
    }
    searchRepresentative = async (event) => {
        const value = event.target.value.trim();
        const splitValue = value.split(" ");
        const propertyArray = [];
        this.state.properties.map(property => {
            let found = false;
            if (splitValue[0] === "") {
                property.searchFound = false;
                propertyArray.push(property);
            } else {
                splitValue.forEach(eachValue => {
                    if ((property.owner.name && property.owner.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (property.usage && property.usage.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (property.type && property.type.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (property.representative && property.representative.name.toLowerCase().search(eachValue.toLowerCase()) !== -1)) {
                        found = true;
                    }
                });
                if (found) {
                    property.searchFound = true
                    propertyArray.push(property);
                } else {
                    property.searchFound = false;
                    propertyArray.push(property);
                }
            }
        });
        this.setState({
            properties: propertyArray
        });
    }

    render() {
        const { classes, actions, user } = this.props;
        const { properties, formValue, owners, representatives, buildingData, communityData } = this.state;
        const { records_type } = this.state;
        console.log(formValue);

        return (
            <div>
                <PropertyDialog
                    title={ this.state.dialogTitle } 
                    actionText = { this.state.dialogAction } 
                    open={ this.state.dialogOpen } 
                    close={ this.closeForm }
                    exit={this.closeForm}
                >
                    {
                        user.type == USER_TYPES.ADMIN && formValue ?
                            <PropertyView property={formValue} approveAction={this.approveProperty} rejectAction={this.rejectProperty}/> :
                            <PropertyForm
                            property={formValue} 
                            onSubmit={this.onFormSave} 
                            owners={owners} 
                            representatives={representatives} 
                            actions={actions} 
                            showNote={records_type === STATUS_TYPES.NEEDS_CORRECTION}
                            buildingData={buildingData}
                            communityData={communityData}
                            />
                    }
                    
                </PropertyDialog>
                <main style={{marginTop: 64, marginBottom: 'calc(64px + 4.5em)'}} className={classes.content}>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={12}>
                                {
                                    user && user.type === USER_TYPES.ADMIN ?
                                        <PropertyViewingTable
                                            properties={properties}
                                            selected_record_type={records_type}
                                            update_record_type={this.updateRecordsType}
                                            onRowView={this.openDetailsDialog}
                                            // onPropertyStatusToggle={this.toggleStatus}
                                            approveAction={this.approveProperty} 
                                            onPropertySendForApproval={this.sendForApproval}
                                            searchRepresentative={this.searchRepresentative} /> :
                                        <PropertyTable
                                            user={this.props.user}
                                            properties={properties}
                                            selected_record_type={records_type}
                                            update_record_type={this.updateRecordsType}
                                            onRowEdit={this.openDetailsDialog}
                                            // onPropertyStatusToggle={this.toggleStatus}
                                            onPropertySendForApproval={this.sendForApproval}
                                            searchRepresentative={this.searchRepresentative} />
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                    {
                        user && user.type === USER_TYPES.AGENT && (
                            <AbsoluteFAB
                            icon={<AddIcon />} 
                            action={() => { this.setState({ dialogOpen: true, dialogTitle: 'Add Property' }) }}
                            />
                        )
                    }
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Property);
