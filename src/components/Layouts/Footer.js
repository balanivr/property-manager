import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = {
    footer: {
        backgroundColor: '#333333',
        color: '#fff',
        position: 'fixed',
        bottom: 0
    },
    footerContent: {
        padding: '20px 30px'
    }
};

class Footer extends React.Component {
    state = {};

    render() {
        return (
            <Grid container style={styles.footer}>
                <Grid item style={styles.footerContent}>
                    <Typography variant="body1" color="inherit">
                        Copyright Information
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default Footer;