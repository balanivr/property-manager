import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
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
import { STATUS_TYPES, ACTIVE_STATES } from '../../globals';

const columns = [
    { id: 'type', numeric: false, hideOnMobile: false, disablePadding: true, label: 'Type' },
    { id: 'name', numeric: false, hideOnMobile: false, disablePadding: true, label: 'Name' },
    { id: 'property_id', numeric: false, hideOnMobile: false, disablePadding: true, label: 'Property Id' },
    // { id: 'addresses', numeric: true, hideOnMobile: true, disablePadding: false, label: 'Address' },
    { id: 'amenities', numeric: false, hideOnMobile: false, conditionalHide: true, disablePadding: false, label: 'Amenities' },
    { id: 'submit', numeric: true, hideOnMobile: false, conditionalHide: true, disablePadding: false, label: 'Submit to Admin' },
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
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

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
                            <TableCell
                                key={row.id}
                                align={row.numeric ? 'center' : 'left'}
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
    // columns: PropTypes.object.isRequired,
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
    const { numSelected, classes } = props;

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
                        className={classes.fixDropdown}
                        required
                        value={props.selected_record_type}
                    >
                        {
                            props.record_types.map(record =>
                                <MenuItem key={record.option} value={record.type}>{record.option}</MenuItem>
                            )
                        }
                    </TextField>
                }
            </div>
            <div className={classes.spacer} style={{
                display: "flex",
                flexDirection: "row-reverse"
            }} >
                {numSelected > 0 ? null :
                    <TextField
                        label="Search"
                        margin="normal"
                        style={{
                            width: "46%",
                            marginRight: "90px"
                        }}
                        onChange={props.searchFromTable}
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

class BuildingCommunityViewingTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'name',
        selected: [],
        page: 0,
        rowsPerPage: 50,
        filterKeys: [],

        record_types: [
            {
                type: STATUS_TYPES.PENDING,
                option: 'Pending Review'
            },
            {
                type: STATUS_TYPES.APPROVED,
                option: 'Approved'
            },
            {
                type: STATUS_TYPES.DRAFT,
                option: 'In Progress'
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
            this.setState({ selected: this.props.owners.map(n => n.id) });
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

    viewRow = (community) => () => {
        console.log('Open view');
        this.props.onRowView && this.props.onRowView(community);
    };

    handleStatusChange = (buildComm) => (e) => {
        const updateStatus = e.target.checked ? ACTIVE_STATES.ACTIVE : ACTIVE_STATES.INACTIVE;
        this.props.onBuildingCommunityStatusToggle && this.props.onBuildingCommunityStatusToggle(buildComm, updateStatus);
    };

    handleApprove = (event, community) => {
        event.stopPropagation();
        this.props.approveAction(community);
    }

    render() {
        const { classes, theme } = this.props;
        const communityData = this.props.communityData || [];
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
                    searchFromTable={this.props.searchFromTable}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="owners">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={communityData.length}
                        />
                        <TableBody>
                            {stableSort(communityData, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(community => {
                                    const isSelected = this.isSelected(community.id);
                                    let communityStatus = community.status && community.status === ACTIVE_STATES.ACTIVE;

                                    return (
                                        <TableRow
                                            hover
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={community.id}
                                            selected={isSelected}
                                            onClick={this.viewRow(community)}
                                            style={{
                                                cursor: 'pointer',
                                                background: community.searchFound ? '#b4f673' : ''
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onClick={event => this.handleSelect(event, community.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" padding="none">
                                                {community.type}
                                            </TableCell>
                                            <TableCell component="th" padding="none">
                                                {community.name}
                                            </TableCell>
                                            <TableCell component="th" padding="none">
                                                {community.property_id}
                                            </TableCell>
                                            <TableCell component="th" padding="none">
                                                {`${community.address.city}/${community.address.country}`}
                                            </TableCell>
                                            {/* <TableCell component="th" padding="none">
                                                <Switch defaultChecked={communityStatus} onChange={this.handleStatusChange(community)} />
                                            </TableCell> */}
                                            <TableCell component="th" padding="none" align={"center"} >
                                                <Tooltip
                                                    title={"Approve " + community.name}
                                                    // placement={'bottom-end'}
                                                    enterDelay={300}
                                                >
                                                    <IconButton onClick={e => this.handleApprove(e, community)} color="secondary">
                                                        <DoneIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
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

export default withStyles(styles, { withTheme: true })(BuildingCommunityViewingTable);