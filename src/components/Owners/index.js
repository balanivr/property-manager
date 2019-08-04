import React from 'react';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';

import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import OwnerViewingTable from './OwnerViewingTable';
import OwnerTable from './OwnerTable';
import OwnerDialog from './OwnerDialog';
import OwnerForm from './OwnerForm';
import OwnerView from './OwnerView';
import {withStyles} from "@material-ui/core";
import { USER_TYPES, STATUS_TYPES, ACTIVE_STATES } from '../../globals';
import get from 'lodash/get';

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

class Owners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            dialogOpen: false,
            dialogTitle: "Add owner",
            dialogAction: "Save",
            formValue: null,
            formErrors: {},
            records_type: '',
            owners: [],
        };
    }
    componentDidMount() {
        // const { user } = this.props;
        // const userType = get(user, 'type');
        // const userId = get(user, 'id');

        // if(userId == null || !Object.values(USER_TYPES).includes(userType)) {
        //     return;
        // }

        // const records_type = USER_TYPES.ADMIN === userType ? 'pending' : 'draft';
        // const fetchAction = USER_TYPES.ADMIN === userType ? this.props.actions.getAllOwners(records_type) : this.props.actions.getOwnersOfAgent(userId, records_type);

        // fetchAction.then(owners => {
        //     console.log(`Fetched owners of type ${records_type} for ${userType}`);
        //     this.setState({
        //         records_type,
        //         owners
        //     });
        // }).catch(err => {
        //     console.error('Failed to fetch owners', err);
        // });
        this.getOwners();
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
        
        const fetchAction = USER_TYPES.ADMIN === userType ? this.props.actions.getAllOwners(records_type) : this.props.actions.getOwnersOfAgent(userId, records_type);

        fetchAction.then(owners => {
            console.log(`Fetched owners of type ${records_type} for ${userType}`);
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

    onFormSave = async(ownerData, status=false) => {
        const updateAttachments = [];
        const { attachments } = ownerData;
        for (const attachment of attachments) {
            if (attachment.isUpload)
            {
                await this.props.actions.uploadImage('/owners/',attachment.image).then(image => {
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
            }else{
                const newAttachment = {
                    name: attachment.name,
                    linkedTo: attachment.linkedTo,
                    expirydate: attachment.expirydate,
                    image: attachment.image
                }
                updateAttachments.push(newAttachment)
            }
        }
        ownerData.attachments = updateAttachments;
        if(ownerData.id == null) {
            console.log('Creating owner', ownerData);
            this.props.actions.createOwner(ownerData, this.props.user, status).then((createdOwner) => {
                this.setState({
                    dialogOpen: false,
                    formValue: null,
                    owners: this.state.owners.concat(createdOwner)
                })
            }).catch(error => console.error(error));
        } else {
            console.log('Updating owner', ownerData);
            this.props.actions.updateOwner(ownerData, this.props.user, status).then(() => {
                this.setState({
                    dialogOpen: false,
                    formValue: null,
                    owners: this.state.owners.map(owner => owner.id === ownerData.id ? ownerData : owner)
                });
            }).catch(error => console.error(error));
        }
    };

    openDetailsDialog = (owner) => {
        const { user } = this.props;
        console.log(owner)
        this.setState({
            dialogOpen: true,
            formValue: owner,
            dialogTitle: user.type === USER_TYPES.ADMIN ? `${owner.prefix}. ${owner.name}` : 'Edit Owner'
        });
    };

    updateRecordsType = (event) => {
        const records_type = event.target.value;

        this.setState({ records_type });
        this.getOwners(records_type);
    }

    toggleStatus = (owner, status) => {
        console.log('toggling status');
        this.props.actions.updateOwnerStatus(owner.id, status).then(
            () => {
                this.setState({
                    owners: this.state.owners.map(ow => owner.id !== ow.id ? ow : {
                        ...ow,
                        status
                    })
                })
            }
        )
    };

    sendForApproval = (owner) => {
        console.log('sending for approval');
        this.props.actions.updateOwnerProperties(owner.id, {status: STATUS_TYPES.PENDING}).then(
            // () => {
            //     this.setState({
            //         owners: this.state.owners.map(ow => owner.id !== ow.id ? ow : {
            //             ...ow,
            //             status: STATUS_TYPES.PENDING
            //         })
            //     })
            // }
            () => {
                this.setState({ dialogOpen: false });
                this.getOwners(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
            }
        )
    }

    approveOwner = (owner) => {
        console.log('approved owner');
        this.props.actions.updateOwnerProperties(owner.id, {
            status: STATUS_TYPES.APPROVED,
            active: ACTIVE_STATES.ACTIVE,
        }).then(
            // () => {
            //     this.setState({
            //         owners: this.state.owners.map(ow => owner.id !== ow.id ? ow : {
            //             ...ow,
            //             status: STATUS_TYPES.APPROVED
            //         })
            //     })
            // }
            () => {
                this.setState({ dialogOpen: false });
                this.getOwners(this.state.records_type ? this.state.records_type : STATUS_TYPES.APPROVED);
            }
        )
    }

    rejectOwner = (owner, note) => {
        console.log('sent owner for correction');
        this.props.actions.updateOwnerProperties(owner.id, {
                status: STATUS_TYPES.NEEDS_CORRECTION,
                note
            }).then(() => {
                this.setState({ dialogOpen: false });
                this.getOwners(this.state.records_type ? this.state.records_type : STATUS_TYPES.NEEDS_CORRECTION);
            });
    }
    searchOwner = (event) => {
        const value = event.target.value.trim();
        const splitValue = value.split(" ");
        const ownersArray = [];
        this.state.owners.map(owner => {
            let found = false;
            if (splitValue[0] === "") {
                owner.searchFound = false;
                ownersArray.push(owner);
            } else {
                splitValue.forEach(eachValue => {
                    if ((owner.name && owner.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (owner.agent && owner.agent.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (owner.prefix && owner.prefix.toLowerCase().search(eachValue.toLowerCase()) !== -1)) {
                        found = true;
                    }
                });
                if (found) {
                    owner.searchFound = true;
                    ownersArray.push(owner);
                } else {
                    owner.searchFound = false;
                    ownersArray.push(owner);
                }
            }
        });
        this.setState({
            owners: ownersArray
        });
    }

    render() {
        const { classes, user } = this.props;
        const { owners, formValue } = this.state;
        const { records_type } = this.state;

        return (
            <div>
                <OwnerDialog
                    title={ this.state.dialogTitle } 
                    actionText = { this.state.dialogAction } 
                    open={ this.state.dialogOpen } 
                    close={ this.closeForm }
                    exit={this.closeForm}
                >
                    {
                        user.type === USER_TYPES.ADMIN ?
                            <OwnerView owner={formValue} approveAction={this.approveOwner} rejectAction={this.rejectOwner}/>
                            :
                            <OwnerForm owner={formValue} onSubmit={this.onFormSave} showNote={records_type === STATUS_TYPES.NEEDS_CORRECTION} />
                    }
                </OwnerDialog>
                <main style={{marginTop: 64, marginBottom: 'calc(64px + 4.5em)'}} className={classes.content}>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={12}>
                                {
                                    user && user.type === USER_TYPES.ADMIN ?
                                        <OwnerViewingTable
                                            owners={owners}
                                            selected_record_type={records_type}
                                            update_record_type={this.updateRecordsType}
                                            onRowView={this.openDetailsDialog}
                                            // onOwnerStatusToggle={this.toggleStatus}
                                            approveAction={this.approveOwner} 
                                            onOwnerSendForApproval={this.sendForApproval}
                                            searchOwner={this.searchOwner} /> :
                                        <OwnerTable
                                            owners={owners}
                                            selected_record_type={records_type}
                                            update_record_type={this.updateRecordsType}
                                            onRowEdit={this.openDetailsDialog}
                                            onOwnerStatusToggle={this.toggleStatus}
                                            onOwnerSendForApproval={this.sendForApproval}
                                            searchOwner={this.searchOwner} />
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                    {
                        user && user.type === USER_TYPES.AGENT && (
                            <AbsoluteFAB
                                icon={<AddIcon />}
                                action={() => { this.setState({ dialogOpen: true, dialogTitle: 'Add Owner' }) }}
                            />
                        )
                    }
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Owners);
