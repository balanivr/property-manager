import React, { Component } from 'react';
import { ListItemIcon, ListItemText, Divider, IconButton, MenuList, MenuItem, Drawer } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Routes from '../Routes';

export class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.activeRoute = this.activeRoute.bind(this);
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
    }

    // toggleDrawer = (open) => () => {
    //     this.setState({
    //         menu_open: open,
    //     });
    // };

    render() {
        state = {
            menu_open: false,

        }

        const { classes, theme } = this.props;
        return (
            <div>
                <Drawer
                    variant="temporary"
                    open={this.state.menu_open} 
                    onClose={this.props.toggleDrawer(false)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.props.toggleDrawer(false)}
                        onKeyDown={this.props.toggleDrawer(false)}
                    >
                        <MenuList>
                            {Routes.map((prop, key) => {
                                return (
                                    <Link to={prop.path} style={{ textDecoration: 'none' }} key={key}>
                                        <MenuItem selected={this.activeRoute(prop.path)}>
                                            <ListItemIcon>
                                                <prop.icon />
                                            </ListItemIcon>
                                            <ListItemText primary={prop.sidebarName} />
                                        </MenuItem>
                                    </Link>
                                );
                            })}
                        </MenuList>
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(Sidebar);