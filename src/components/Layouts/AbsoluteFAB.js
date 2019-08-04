import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit,
        position: 'fixed',
        bottom: '4.5em',
        right: '1.5em',
        zIndex: 10,
    }
});

function FloatingActionButton(props) {
    const { classes } = props;

    return (
        <div>
            <Fab 
                className={classes.fab} 
                style={Object.assign({}, props.noFooter ? { bottom: '1.5em' } : {}, props.style)} 
                onClick={(props.action ? props.action : null)} 
                color="secondary"
                variant={(props.extended) ? "extended" : "round"}
                type={props.type || 'button'}
            >
                {props.icon ? props.icon : <AddIcon />}
                {props.extended ? props.extended : ""}
            </Fab>
        </div>
    );
}

FloatingActionButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FloatingActionButton);