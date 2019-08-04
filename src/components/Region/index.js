import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import Typography from '@material-ui/core/Typography';

// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Avatar from '@material-ui/core/Avatar';
// import AddIcon from '@material-ui/icons/Add';

const styles = {
    // avatar: {
    //     backgroundColor: blue[100],
    //     color: blue[600],
    // },
};

class Region extends React.Component {
    state = {
        open: true, 
        regions: ['UAE', 'Hong Kong'], 
        selectedRegion: false
    };

    handleClose = () => {
        this.setState({ open: false, selectedRegion: this.props.selectedValue });
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = value => {
        this.setState({ open: false, selectedRegion: value });
        this.props.onClose(value);
    };

    render() {
        const { classes, onClose, region, ...other } = this.props;

        return (
            <React.Fragment>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="region-select-title" {...other}>
                    <DialogTitle id="region-select-title">Select a Region</DialogTitle>
                    <div>
                        <List>
                            {this.state.regions.map(value => (
                                <ListItem button onClick={() => this.handleListItemClick(value)} key={value}>
                                    <ListItemText primary={value} />
                                </ListItem>
                            ))}
                            {/* <ListItem button onClick={() => this.handleListItemClick('addRegion')}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Add Region" />
                            </ListItem> */}
                        </List>
                    </div>
                </Dialog>
                <main style={{marginTop: 64, marginBottom: 'calc(64px + 4.5em)'}}>
                    <br /><br />
                    { this.state.selectedRegion ?
                        <Typography variant="display2">Click on the menu icon to get started</Typography> :
                        <br />
                    }
                </main>
            </React.Fragment>
        );
    }
}

Region.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(Region);