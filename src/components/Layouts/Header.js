import React from 'react'
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PublicIcon from '@material-ui/icons/Public';
import PersonIcon from '@material-ui/icons/Person';
import FilterListIcon from '@material-ui/icons/FilterList';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import LocationCity from '@material-ui/icons/LocationCity';
import { USER_TYPES, REGIONS } from '../../globals';
import AlertDialog from './LogoutDialog';

// REFER FOR MENU ITEMS (HIGHLIGHT AND POPULATING)
// https://stackoverflow.com/questions/50801093/material-ui-drawer-selection-how-to-route

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    }
};

class Header extends React.Component {
    state = {
        anchorEl: null,
        menu_open: false,
        logoutDialog: false,
        title: "Are you sure you want to log out?"
    };

    handleChange = event => {
        this.setState({ auth: event.target.checked });
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    toggleDrawer = (open) => () => {
        this.setState({
            menu_open: open,
        });
    };
    onLogout = () => {
        this.setState({ logoutDialog: true });
    }
    logMeOut = () => {
        this.props.onLogout();
    }

    handleCloseLogoutDialog = () => {
        this.setState({ logoutDialog: false });
    };

    render() {
        const { classes, user } = this.props;

        const { page_title } = this.props;

        const { anchorEl } = this.state;

        const open = Boolean(anchorEl);

        const sideList = (
            <div className={classes.list}>
                <List>
                    {
                        user && user.type === USER_TYPES.ADMIN && (
                            <ListItem component={Link} to={this.props.baseUrl + "/users"} button key='Manage Users' selected={page_title === "Agents"}>
                                <ListItemIcon>
                                    <PersonPinCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary='Manage Users' />
                            </ListItem>
                        )
                    }
                    <ListItem component={Link} to={this.props.baseUrl + "/owners"} button key='Owners' selected={page_title === 'Owners'}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary='Owners' />
                    </ListItem>
                    <ListItem component={Link} to={this.props.baseUrl + "/representatives"} button key='Representatives' selected={page_title === 'Properties'}>
                        <ListItemIcon>
                            <SupervisorAccountIcon />
                        </ListItemIcon>
                        <ListItemText primary='Representatives' />
                    </ListItem>
                    <ListItem component={Link} to={this.props.baseUrl + "/building-community"} button key='Building/Community' selected={page_title === 'Manage Building/Community'}>
                        <ListItemIcon>
                            <LocationCity />
                        </ListItemIcon>
                        <ListItemText primary='Building/Community' />
                    </ListItem>
                    <ListItem component={Link} to={this.props.baseUrl + "/properties"} button key='Properties' selected={page_title === 'Properties'}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary='Properties' />
                    </ListItem>
                </List>
                {/* {
                    !!user && (
                        <React.Fragment>
                            <Divider />
                            <List>
                                <ListItem button key='Logout' onClick={onLogout}>
                                    <ListItemIcon>
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText primary='Logout' />
                                </ListItem>
                            </List>
                        </React.Fragment>
                    )
                } */}
            </div>
        );

        return (
            <div className={classes.root}>
                <AlertDialog
                    open={this.state.logoutDialog}
                    handleClose={this.handleCloseLogoutDialog}
                    title={this.state.title}
                    logMeOut={this.logMeOut}
                >
                </AlertDialog>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow} style={{
                            textAlign: 'left'
                        }}>
                            {page_title}
                        </Typography>
                        {!!user && (
                            <div>
                                {/* <Tooltip title="Filter">
                                    <IconButton
                                        onClick={null}
                                        color="inherit"
                                    >
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip> */}
                                <Tooltip title="Select a Region">
                                    <IconButton
                                        aria-owns={open ? 'region-appbar' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleMenu}
                                        color="inherit"
                                    >
                                        <PublicIcon />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id="region-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    {
                                        Object.keys(REGIONS).map((region) => {
                                            return (
                                                <MenuItem 
                                                    key={region} 
                                                    onClick={this.handleClose}
                                                >
                                                    {REGIONS[region].displayName}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Menu>
                                <Tooltip title={user.name}>
                                    <IconButton
                                        aria-owns={open ? 'menu-appbar' : undefined}
                                        aria-haspopup="true"
                                        // onClick={this.handleMenu}
                                        color="inherit"
                                        onClick={this.onLogout}
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                </Tooltip>
                                {/* <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                                </Menu> */}
                            </div>
                        )}
                    </Toolbar>
                </AppBar>

                <Drawer open={this.state.menu_open} onClose={this.toggleDrawer(false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer(false)}
                        onKeyDown={this.toggleDrawer(false)}
                    >
                        <img src="/Logo.png" style={{maxWidth: 100, margin: 25, marginLeft: '50%', transform: 'translateX(-55%)'}} />
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}

// Header.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(Header);
