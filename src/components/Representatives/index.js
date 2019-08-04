import React from 'react';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';

import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import RepresentativesViewingTable from './RepresentativesViewingTable';
import RepresentativesTable from './RepresentativesTable';
import RepresentativesDialog from './RepresentativesDialog';
import RepresentativesForm from './RepresentativesForm';
import RepresentativesView from './RepresentativesView';
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

class Representatives extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            dialogOpen: false,
            dialogTitle: "Add Representative",
            dialogAction: "Save",
            formValue: null,
            formErrors: {},
            records_type: '',
            representatives: [],
            owners: []
        };
    }

    componentDidMount() {
        const { user, actions } = this.props;
        const userType = get(user, 'type');
        const userId = get(user, 'id');

        // if(userId == null || !Object.values(USER_TYPES).includes(userType)) {
        //     return;
        // }

        // const fetchAction = USER_TYPES.ADMIN === userType ? this.props.actions.getAllRepresentatives() : this.props.actions.getRepresentativesOfAgent(userId);

        // fetchAction.then(representatives => {
        //     console.log('Fetched representatives for', userType);
        //     this.setState({
        //         representatives
        //     });
        // }).catch(err => {
        //     console.error('Failed to fetch representatives', err);
        // });
        this.getRepresentatives();

        if(userType === USER_TYPES.AGENT) {
            console.log('Fetching owners of agent');
            actions.getOwnersOfAgent(userId).then(
                owners => {
                    this.setState({
                        owners
                    });
                }
            ).catch(console.error);
        }
        // else {
        //     console.log('Fetching all owners');
        //     actions.getAllOwners().then(
        //         owners => {
        //             this.setState({
        //                 owners
        //             });
        //         }
        //     ).catch(console.error);
        // }
    }

    getRepresentatives(records_type = false) {
        const { user, actions } = this.props;
        const userType = get(user, 'type');
        const userId = get(user, 'id');

        if(userId == null || !Object.values(USER_TYPES).includes(userType)) {
            return;
        }

        if (!records_type)
            records_type = USER_TYPES.ADMIN === userType ? STATUS_TYPES.PENDING : STATUS_TYPES.DRAFT;

        const fetchAction = USER_TYPES.ADMIN === userType ? actions.getAllRepresentatives(records_type) : actions.getRepresentativesOfAgent(userId, records_type);

        fetchAction.then(representatives => {
            console.log(`Fetched representatives of type ${records_type} for ${userType}`);
            this.setState({
                records_type,
                representatives
            });
        }).catch(err => {
            console.error('Failed to fetch representatives', err);
        });
    }

    closeForm = ()  => {
        this.setState({
            dialogOpen: false,
            formValue: null,
        });
    };

    onFormSave = async(representativeData, owner, status=false) => {
        const updateAttachments = [];
        const { attachments } = representativeData;
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
        representativeData.attachments = updateAttachments;

        representativeData.owner = owner;
        if(representativeData.id == null) {
            console.log('Creating representative', representativeData);
            this.props.actions.createRepresentative(representativeData, this.props.user, status).then((createdRepresentative) => {
                this.setState({
                    dialogOpen: false,
                    formValue: null,
                    representatives: this.state.representatives.concat(createdRepresentative)
                })
            }).catch(error => console.error(error));
        } else {
            console.log('Updating representative', representativeData);
            this.props.actions.updateRepresentative(representativeData, status).then(() => {
                this.setState({
                    dialogOpen: false,
                    formValue: null,
                    representatives: this.state.representatives.map(representative => representative.id === representativeData.id ? representativeData : representative)
                });
            }).catch(error => console.error(error));
        }
    };

    openDetailsDialog = (representative) => {
        const { user } = this.props;
        this.setState({
            dialogOpen: true,
            formValue: representative,
            dialogTitle: user.type === USER_TYPES.ADMIN ? `${representative.prefix}. ${representative.name}` : 'Edit Representative'
        });
    };

    updateRecordsType = (event) => {
        const records_type = event.target.value;

        this.setState({ records_type });
        this.getRepresentatives(records_type);
    }

    toggleStatus = (representative, status) => {
        this.props.actions.updateRepresentativeStatus(representative.id, status).then(
            () => {
                this.setState({
                    representatives: this.state.representatives.map(rep => representative.id !== rep.id ? rep : {
                        ...rep,
                        status
                    })
                })
            }
        ).catch(console.error);
    };

    sendForApproval = (representative) => {
        console.log('sending for approval');
        this.props.actions.updateRepresentativeProperties(representative.id, {status: STATUS_TYPES.PENDING}).then(
            () => {
                this.setState({ dialogOpen: false });
                this.getRepresentatives(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
            }
        )
    }

    approveRepresentative = (representative) => {
        console.log('approved representative');
        this.props.actions.updateRepresentativeProperties(representative.id, {
            status: STATUS_TYPES.APPROVED,
            active: ACTIVE_STATES.ACTIVE,
        }).then(
            () => {
                this.setState({ dialogOpen: false });
                this.getRepresentatives(this.state.records_type ? this.state.records_type : STATUS_TYPES.APPROVED);
            }
        )
    }

    rejectRepresentative = (representative, note) => {
        console.log('sent representative for correction');
        this.props.actions.updateRepresentativeProperties(representative.id, {
                status: STATUS_TYPES.NEEDS_CORRECTION,
                note
            }).then(() => {
                this.setState({ dialogOpen: false });
                this.getRepresentatives(this.state.records_type ? this.state.records_type : STATUS_TYPES.NEEDS_CORRECTION);
            });
    }
    searchRepresentative = async(event) => {
        const value = event.target.value.trim();
        const splitValue = value.split(" ");
        const representativeArray = [];
        this.state.representatives.map(representative => {
            let found = false;
            if (splitValue[0] === ""){
                representative.searchFound = false;
                representativeArray.push(representative);
            }else{
                splitValue.forEach(eachValue => {
                    if ((representative.name && representative.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (representative.agent && representative.agent.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (representative.status && representative.status.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (representative.prefix && representative.prefix.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (representative.owner && representative.owner.name.toLowerCase().search(eachValue.toLowerCase()) !== -1)) {
                        found = true;
                    }
                });
                if(found){
                    representative.searchFound = true
                    representativeArray.push(representative);
                }else{
                    representative.searchFound = false;
                    representativeArray.push(representative);
                }
            }
        });
        this.setState({
            representatives: representativeArray
        });
    }

    render() {
        const { classes, user } = this.props;
        const { representatives, formValue, owners } = this.state;
        const { records_type } = this.state;

        return (
            <div>
                <RepresentativesDialog
                    title={ this.state.dialogTitle } 
                    actionText = { this.state.dialogAction } 
                    open={ this.state.dialogOpen } 
                    close={ this.closeForm }
                    exit={this.closeForm}
                >
                    {
                        user.type === USER_TYPES.ADMIN ?
                            <RepresentativesView representative={formValue} owners={owners} approveAction={this.approveRepresentative} rejectAction={this.rejectRepresentative} />
                            :
                            <RepresentativesForm representative={formValue} onSubmit={this.onFormSave} user={user} owners={owners} showNote={records_type === STATUS_TYPES.NEEDS_CORRECTION} />
                    }
                </RepresentativesDialog>
                <main style={{marginTop: 64, marginBottom: 'calc(64px + 4.5em)'}} className={classes.content}>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={12}>
                                {
                                    user && user.type === USER_TYPES.ADMIN ?
                                        <RepresentativesViewingTable
                                            representatives={representatives}
                                            selected_record_type={records_type}
                                            update_record_type={this.updateRecordsType}
                                            onRowView={this.openDetailsDialog}
                                            // onRepresentativeStatusToggle={this.toggleStatus}
                                            approveAction={this.approveRepresentative} 
                                            onRepresentativeSendForApproval={this.sendForApproval} 
                                            searchRepresentative={this.searchRepresentative}
                                            /> :
                                        <RepresentativesTable
                                            representatives={representatives}
                                            selected_record_type={records_type}
                                            update_record_type={this.updateRecordsType}
                                            onRowEdit={this.openDetailsDialog}
                                            onRepresentativeStatusToggle={this.toggleStatus}
                                            onRepresentativeSendForApproval={this.sendForApproval}
                                            searchRepresentative={this.searchRepresentative} />
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                    {
                        user && user.type === USER_TYPES.AGENT && (
                            <AbsoluteFAB
                                icon={<AddIcon />}
                                action={() => { this.setState({ dialogOpen: true, dialogTitle: 'Add Representative' }) }}
                            />
                        )
                    }
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Representatives);
