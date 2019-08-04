import React, { Component } from 'react';
import { withStyles, Paper, Grid } from "@material-ui/core";
import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import AddIcon from '@material-ui/icons/Add';
import BuildingCommunityDialog from './BuildingCommunityDialog'
import { USER_TYPES, STATUS_TYPES, ACTIVE_STATES, BUILDINGORCOMMUNITY } from '../../globals';
import BuildingCommunityView from './BuildingCommunityView';
import BuildingCommunityForm from './BuildingCommunityForm';
import get from 'lodash/get';
import BuildingCommunityTable from './BuildingCommunityTable';
import BuildingCommunityViewingTable from './BuildingCommunityViewingTable';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
    },

    paper: {
        margin: [[84, 18, 18, 18]],
    }
});

class BuildingCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      dialogTitle: "",
      formValue: null,
      formErrors: {},
      dialogAction: "Save",
      records_type: "",
      communities: [],
      buildingCommunity: []
    };
  }

  componentDidMount(){
    this.getBuildingOrCommunity();
    this.getAllCommunity();
  }
  getBuildingOrCommunity(records_type = false) {
    const { user, actions } = this.props;
    const userType = get(user, 'type');
    const userId = get(user, 'id');

    if (userId == null || !Object.values(USER_TYPES).includes(userType)) {
      return;
    }

    if (!records_type)
      records_type = USER_TYPES.ADMIN === userType ? STATUS_TYPES.PENDING : STATUS_TYPES.DRAFT;

    const fetchAction = USER_TYPES.ADMIN === userType ? actions.getBuildingOrCommunity(records_type) : actions.getBuildingCommunityOfAgent(userId, records_type);

    fetchAction.then(building => {
      console.log(`Fetched Building of type ${records_type} for ${userType}`);
      this.setState({
        records_type,
        buildingCommunity: building
      });
    }).catch(err => {
      console.error('Failed to fetch buildings', err);
    });
  }

    getAllCommunity = () => {
      const { actions } = this.props;
      const fetchAction = actions.getAllCommunities();
      fetchAction.then(communities => {
        console.log("communities", communities);
        this.setState({
          communities
        });
      }).catch(err => {
        console.error('Failed to fetch representatives', err);
      });
    }

  onFormSave = async (businessOrCommunityData, status = false) => {
    const updateAttachments = [];
    const { attachments } = businessOrCommunityData;
    for (const attachment of attachments) {
      if (attachment.isUpload) {
        await this.props.actions.uploadImage("buildingCommunity", attachment.image).then(image => {
          const newAttachment = {
            name: attachment.name,
            linkedTo: attachment.linkedTo,
            expirydate: attachment.expirydate,
            image: image
          }
          updateAttachments.push(newAttachment);
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
    businessOrCommunityData.attachments = updateAttachments;


    if (businessOrCommunityData.id == null) {
      console.log('Creating businessOrCommunityData', businessOrCommunityData);
      this.props.actions.createbusinessOrCommunity(businessOrCommunityData, this.props.user, status).then((newRecored) => {
        this.setState({
          dialogOpen: false,
          formValue: null,
          buildingCommunity: this.state.buildingCommunity.concat(newRecored)
        })
      }).catch(error => console.error(error));
    } else {
      console.log('Updating BusinessOrCommunityData', businessOrCommunityData);
      this.props.actions.updatebusinessOrCommunity(businessOrCommunityData, this.props.user, status).then(() => {
        this.setState({
          dialogOpen: false,
          formValue: null,
          buildingCommunity: this.state.buildingCommunity.map(data => data.id === businessOrCommunityData.id ? businessOrCommunityData : data)
        });
      }).catch(error => console.error(error));
    }
  };

  updateRecordsType = (event) => {
    event.preventDefault();
    const records_type = event.target.value;

    this.setState({ records_type });
    this.getBuildingOrCommunity(records_type);
  }
  openDetailsDialog = (community) => {
    const { user } = this.props;
    console.log(community)
    this.setState({
      dialogOpen: true,
      formValue: community,
      dialogTitle: user.type === USER_TYPES.ADMIN ? `Community` : 'Edit Community'
    });
  };

  approveOwner = (community) => {
    console.log('approved building community');
    this.props.actions.updateBuildingCommunity(community.id, {
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
        this.getBuildingOrCommunity(this.state.records_type ? this.state.records_type : STATUS_TYPES.APPROVED);
      }
    )
  }
  
  sendForApproval = (community) => {
    console.log('sending for approval');
    this.props.actions.updateBuildingCommunity(community.id, { status: STATUS_TYPES.PENDING }).then(
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
        this.getBuildingOrCommunity(this.state.records_type ? this.state.records_type : STATUS_TYPES.PENDING);
      }
    )
  }
  searchFromTable = (event) => {
    const value = event.target.value.trim();
    const splitValue = value.split(" ");
    const buildingCommunityArray = [];
    this.state.buildingCommunity.map(community => {
      let found = false;
      if (splitValue[0] === "") {
        community.searchFound = false;
        buildingCommunityArray.push(community);
      } else {
        splitValue.forEach(eachValue => {
          if ((community.name && community.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (community.type && community.type.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (community.property_id && community.property_id.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (community.address && community.address.city.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (community.address && community.address.country.toLowerCase().search(eachValue.toLowerCase()) !== -1)) {
            found = true;
          }
        });
        if (found) {
          community.searchFound = true;
          buildingCommunityArray.push(community);
        } else {
          community.searchFound = false;
          buildingCommunityArray.push(community);
        }
      }
    });
    this.setState({
      buildingCommunity: buildingCommunityArray
    });
  }
  toggleStatus = (community, status) => {
    console.log('toggling status');
    this.props.actions.updateBuildingCommunityStatus(community.id, status).then(
      () => {
        this.setState({
          owners: this.state.buildingCommunity.map(comm => community.id !== comm.id ? comm : {
            ...comm,
            status
          })
        })
      }
    )
  };
  rejectOwner = (community, note) => {
    console.log('sent buildingCommunity for correction');
    this.props.actions.updateBuildingCommunity(community.id, {
      status: STATUS_TYPES.NEEDS_CORRECTION,
      note
    }).then(() => {
      this.setState({ dialogOpen: false });
      this.getBuildingOrCommunity(this.state.records_type ? this.state.records_type : STATUS_TYPES.NEEDS_CORRECTION);
    });
  }

  closeForm = () => {
    this.setState({
      dialogOpen: false,
      formValue: null,
    });
  };
  render() {
    const {classes, user} = this.props;
    const { formValue, records_type, buildingCommunity } = this.state;
    return (
      <div>
        <BuildingCommunityDialog
          title={this.state.dialogTitle}
          actionText={this.state.dialogAction}
          open={this.state.dialogOpen}
          close={this.closeForm}
          exit={this.closeForm}
        >
          {
            user.type === USER_TYPES.ADMIN ?
              <BuildingCommunityView buildingCommunity={formValue} approveAction={this.approveOwner} rejectAction={this.rejectOwner} />
              :
              <BuildingCommunityForm buildingCommunity={formValue} onSubmit={this.onFormSave} showNote={records_type === STATUS_TYPES.NEEDS_CORRECTION} communities={this.state.communities}/>
          }
        </BuildingCommunityDialog>
            <main style={{ marginTop: 64, marginBottom: 'calc(64px + 4.5em)' }} className={classes.content}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12}>
                {
                  user && user.type === USER_TYPES.ADMIN ?
                    <BuildingCommunityViewingTable
                      communityData={buildingCommunity}
                      selected_record_type={records_type}
                      update_record_type={this.updateRecordsType}
                      onRowView={this.openDetailsDialog}
                      approveAction={this.approveOwner}
                      onOwnerSendForApproval={this.sendForApproval}
                      searchFromTable={this.searchFromTable} /> :
                    <BuildingCommunityTable
                      communityData={buildingCommunity}
                      selected_record_type={records_type}
                      update_record_type={this.updateRecordsType}
                      onRowEdit={this.openDetailsDialog}
                      onBuildingCommunityStatusToggle={this.toggleStatus}
                      onOwnerSendForApproval={this.sendForApproval}
                      searchFromTable={this.searchFromTable} />
                }
              </Grid>
            </Grid>
          </Paper>

                {
            user && user.type === USER_TYPES.AGENT && (
              <AbsoluteFAB
                icon={<AddIcon />}
                action={() => { this.setState({ dialogOpen: true, dialogTitle: 'Add Building/Community' }) }}
              />
            )
          }
            </main>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(BuildingCommunity)
