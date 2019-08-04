import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import { geolocated } from "react-geolocated";

class LatLang extends Component {
    // updateGeocode = () => {
    //     this.props.updateGeocode
    //     console.log(this.props.coords.latitude);
    //     console.log(this.props.coords.longitude);
    // }
    render() {
        return !this.props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !this.props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : this.props.coords ? (
            <React.Fragment>
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin={'normal'}
                            variant={'outlined'}
                            fullWidth
                            value={this.props.geocode.latitude}
                            label={'Latitude'}
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            label="Longitude"
                            margin="normal"
                            variant="outlined"
                            value={this.props.geocode.longitude}
                            fullWidth
                            InputProps={{
                                type: 'text'
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                            <Button variant="outlined" onClick={() => this.props.updateGeocode(this.props.coords)} color="secondary" style={{ float: 'right' }}>
                        Get Co-Ordinates
                <AddIcon />
                    </Button>
                </Grid>
            </React.Fragment>
        ) : (
                        <div>Getting the location data&hellip; </div>
                    );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(LatLang)
// export default LatLang