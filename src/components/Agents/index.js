import React from 'react';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';

import AbsoluteFAB from '../Layouts/AbsoluteFAB';
import AgentTable from './AgentTable';
import AgentDialog from './AgentDialog';
import AgentForm from './AgentForm';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
    },
    content: {
        minWidth: 780
    },

    paper: {
        margin: [[84, 18, 18, 18]],
    }
});

class Agents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            dialogOpen: false,
            dialogTitle: "Add Agents",
            dialogAction: "Save",
            agentFormValue: null,
            agentFormErrors: {},
            agents: [],
        };
    }
    componentDidMount() {
        this.props.actions.getAgents().then(agents => {
            console.log('Fetched agents');
            // console.log(agents);
            this.setState({
                agents
            });
        }).catch(err => {
            console.error('Failed to fetch agents', err);
        })
    }

    onFormChange = (agent) => {
        this.setState({
            agentFormValue: agent
        });
    };

    closeForm = ()  => {
        this.setState({
            agentFormValue: null,
            dialogOpen: false,
        });
    };

    onFormSave = async(userData) => {
        console.log("create Update Agent");
        if(userData.id == null) {
            console.log('Creating agent', userData);
            this.props.actions.createUser(userData).then((createdAgent) => {
                this.setState({
                    dialogOpen: false,
                    agentFormValue: null,
                    // agents: this.state.agents.concat(createdAgent)
                })
            }).catch(error => console.error(error));
        } else {
            console.log('Updating agent', userData);
            await this.props.actions.updateUser(userData);
            this.setState({
                dialogOpen: false,
                agentFormValue: null,
                // agents: this.state.agents.map(agent => agent.id === userData.id ? userData : agent)
            });
        }
    };

    openEditAgentDialog = (agent) => {
        console.log(agent)
        this.setState({
            dialogOpen: true,
            agentFormValue: agent,
            dialogTitle: "Edit " + agent.name
        });
    };

    toggleAgentStatus = (agent, status) => {
        this.props.actions.updateAgentStatus(agent.id, status).then(
            () => {
                this.setState({
                    agents: this.state.agents.map(ag => agent.id !== ag.id ? ag : {
                        ...ag,
                        status
                    })
                })
            }
        )
    };
    onSearch = (value) => {
        const splitValue = value.trim().split(" ");
        const agentArray = [];
        this.state.agents.map(agent => {
            let found = false;
            if (splitValue[0] === "") {
                agent.searchFound = false;
                agentArray.push(agent);
            } else {
                splitValue.forEach(eachValue => {
                    if ((agent.email && agent.email.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (agent.name && agent.name.toLowerCase().search(eachValue.toLowerCase()) !== -1) || (agent.lastLoginTime && agent.lastLoginTime.toLowerCase().search(eachValue.toLowerCase()) !== -1)) {
                        found = true;
                    }
                });
                if (found) {
                    agent.searchFound = true;
                    agentArray.push(agent);
                } else {
                    agent.searchFound = false;
                    agentArray.push(agent);
                }
            }
        });
        this.setState({
            agents: agentArray
        });
    }

    render() {
        const { classes } = this.props;
        const { agents, agentFormValue } = this.state;

        return (
            <div>
                <AgentDialog
                    title={ this.state.dialogTitle } 
                    actionText = { this.state.dialogAction } 
                    open={ this.state.dialogOpen } 
                    close={ this.closeForm }
                    exit={this.closeForm}
                >
                    <AgentForm agent={agentFormValue} onChange={this.onFormChange} onSubmit={this.onFormSave}/>
                </AgentDialog>
                <main style={{marginTop: 64, marginBottom: 'calc(64px + 4.5em)'}} className={classes.content}>
                    <Paper className={classes.paper}>
                        <Grid container>
                            <Grid item xs={12}>
                                <AgentTable agents={agents} onRowEdit={this.openEditAgentDialog} onAgentStatusToggle={this.toggleAgentStatus} onSearch={this.onSearch}/>
                            </Grid>
                        </Grid>
                    </Paper>
                    <AbsoluteFAB 
                        icon={<AddIcon />} 
                        action={() => { this.setState({ dialogOpen: true, dialogTitle: 'Add Agent' }) }}
                    />
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Agents);
