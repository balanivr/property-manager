import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import FilterListIcon from '@material-ui/icons/FilterList';
import {CITIES, COUNTRIES, STATUS_TYPES, ACTIVE_STATES, USER_TYPES} from '../../globals';
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const columns = [
    // { id: 'name', numeric: false, hideOnMobile: false, disablePadding: true, label: 'Name' },
    { id: 'owner', numeric: false, hideOnMobile: true, disablePadding: false, label: 'Owner' },
    { id: 'usage', numeric: false, hideOnMobile: true, disablePadding: false, label: 'Property Usage' },
    { id: 'propertyType', numeric: false, hideOnMobile: true, disablePadding: false, label: 'Property Type' },
    { id: 'managed_by', numeric: false, hideOnMobile: true, disablePadding: false, label: 'Managed by' },
    // { id: 'active', numeric: false, hideOnMobile: true, disablePadding: false, label: 'Status' },
    // { id: 'edit', numeric: true, hideOnMobile: true, disablePadding: false, label: '' },
    { id: 'submit', numeric: true, hideOnMobile: false, conditionalHide: true, disablePadding: false, label: 'Submit to Admin' }
];

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, selected_record_type } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {columns.map(
                        row => (
                            <Hidden key={row.id} xsDown={row.hideOnMobile} xsUp={selected_record_type === STATUS_TYPES.APPROVED && row.conditionalHide}>
                                <TableCell
                                    key={row.id}
                                    align={row.numeric ? 'center': 'left'}
                                    padding={row.disablePadding ? 'none' : 'default'}
                                    sortDirection={orderBy === row.id ? order : false}
                                >
                                    <Tooltip
                                        title="Sort"
                                        placement={'bottom-end'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={orderBy === row.id}
                                            direction={order}
                                            onClick={this.createSortHandler(row.id)}
                                        >
                                            {row.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                            </Hidden>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    selected_record_type: PropTypes.string.isRequired
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            } : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    fixDropdown: {
        minWidth: '150px'
    }
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes, selected_record_type } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : 
                <TextField
                    select
                    // label={'Current Records'}
                    onChange={e => props.updateRecordType(e)}
                    margin="normal"
                    required
                    className={classes.fixDropdown}
                    value={selected_record_type}
                >
                    {
                        props.record_types.map(record =>
                            <MenuItem key={record.option} value={record.type}>{record.option}</MenuItem>
                        )
                    }
                </TextField>}
            </div>
            <div className={classes.spacer} >
                {numSelected > 0 ? null :
                    <TextField
                        label="Search"
                        margin="normal"
                        style={{
                            width: "46%",
                            marginRight: "-285px"
                        }}
                        onChange={props.searchRepresentative}
                        InputProps={{
                            type: 'text'
                        }}
                    />
                }
            </div>
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                        <Tooltip title="Filter list">
                            <IconButton aria-label="Filter list" onClick={props.showFilters}>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    selected_record_type: PropTypes.string.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});

class PropertyTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'name',
        selected: [],
        page: 0,
        rowsPerPage: 50,
        filterKeys: [],

        record_types: [
            {
                type: STATUS_TYPES.DRAFT,
                option: 'In Progress'
            },
            {
                type: STATUS_TYPES.NEEDS_CORRECTION,
                option: 'Needs Correction'
            },
            {
                type: STATUS_TYPES.APPROVED,
                option: 'Approved'
            },
        ],
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState({ selected: this.props.properties.map(n => n.id) });
            return;
        }
        this.setState({ selected: [] });
    };

    handleSelect = (event, id) => {
        event.stopPropagation();

        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    editRow = (property) => () => {
        console.log('Open edit');
        this.props.onRowEdit && this.props.onRowEdit(property);
    };

    // handleStatusChange = (property) => (e) => {
    //     e.stopPropagation();

    //     const updateStatus = e.target.checked ? ACTIVE_STATES.ACTIVE : ACTIVE_STATES.INACTIVE;
    //     this.props.onPropertyStatusToggle && this.props.onPropertyStatusToggle(property, updateStatus);
    // };

    handleSendForApproval = (event, property) => {
        event.stopPropagation();

        this.props.onPropertySendForApproval && this.props.onPropertySendForApproval(property);
    };

    render() {
        const { classes, user } = this.props;
        const properties = this.props.properties || [];
        const { selected, order, orderBy, page, rowsPerPage } = this.state;
        const { record_types } = this.state;
        const { selected_record_type } = this.props;

        return (
            <React.Fragment>
                <EnhancedTableToolbar 
                    numSelected={selected.length} 
                    record_types={record_types} 
                    selected_record_type={selected_record_type}
                    updateRecordType={this.props.update_record_type}
                    searchRepresentative={this.props.searchRepresentative}
                    />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="properties">
                      <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            selected_record_type={selected_record_type} 
                            rowCount={properties.length}
                        />
                        <TableBody>
                            {stableSort(properties, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(property => {
                                    const { details } = property;
                                    const isSelected = this.isSelected(property.id);
                                    let propertyStatus = property.status && property.status === ACTIVE_STATES.ACTIVE;
                                    // let propertyName = [];
                                    // address.buildingName && propertyName.push(address.buildingName);
                                    // address.communityName && propertyName.push(address.communityName);

                                    const managedBy = property.representative ? property.representative.name : property.owner.name;

                                    console.log(property);

                                    return (
                                        <TableRow
                                            hover
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={property.id}
                                            selected={isSelected}
                                            onClick={selected_record_type === STATUS_TYPES.APPROVED ? null : this.editRow(property)}
                                            style={{
                                                cursor: 'pointer',
                                                background: property.searchFound ? '#b4f673' : ''
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onClick={event => this.handleSelect(event, property.id)}
                                                />
                                            </TableCell>
                                            {/* <Hidden xsDown={false}>
                                                <TableCell component="th" padding="none">
                                                    { property.owner.name }
                                                </TableCell>
                                            </Hidden> */}
                                            <Hidden xsDown={false}>
                                                <TableCell component="th" padding="none">
                                                    {property.owner.name}
                                                </TableCell>
                                            </Hidden>
                                            <Hidden xsDown={true}>
                                                <TableCell component="th" padding="none">
                                                    {property.usage}
                                                </TableCell>
                                            </Hidden>
                                            <Hidden xsDown={true}>
                                                <TableCell component="th" padding="none">
                                                    {property.type}
                                                </TableCell>
                                            </Hidden>
                                            <Hidden xsDown={true}>
                                                <TableCell component="th" padding="none">
                                                    {managedBy ? managedBy : ''}
                                                </TableCell>
                                            </Hidden>
                                            {/* <Hidden xsDown={true}>
                                                <TableCell component="th" padding="none">
                                                    <Switch defaultChecked={propertyStatus} onChange={this.handleStatusChange(property)}/>
                                                </TableCell>
                                            </Hidden> */}
                                            <Hidden xsDown={false} xsUp={selected_record_type === STATUS_TYPES.APPROVED}>
                                                <TableCell component="th" padding="none" align={"center"}>
                                                    <IconButton onClick={e => this.handleSendForApproval(e, property)} color="secondary">
                                                        <DoneIcon />
                                                    </IconButton>
                                                </TableCell>
                                                {/* <TableCell component="th" padding="none" >
                                                    <IconButton onClick={this.editRow(property)}>
                                                        {
                                                            user && user.type === USER_TYPES.ADMIN ?
                                                            <ViewIcon />
                                                            :
                                                            <DoneIcon />
                                                        }
                                                    </IconButton>
                                                </TableCell> */}
                                            </Hidden>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(PropertyTable);