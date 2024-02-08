import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import config from './../config';
import { withStyles } from '@material-ui/core/styles';

const { drawerWidth } = config;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },

    toolbar: theme.mixins.toolbar,

    // selectedMenuItem: {
    //     backgroundColor: theme.palette.primary.main,
    //     '& $primary, & $icon': {
    //         color: theme.palette.common.white,
    //     },
    // },
    // primary: {},
    // icon: {},

    selected: {
        backgroundColor: '#f1f1f1'
    }
});

class TaskLists extends Component {
    state = {
        pressedList: undefined,
        menuAnchorElement: undefined,
        selectedIndex: 0,
    }

    componentDidMount() {
        document.addEventListener("keydown", event => this.handleKeyDown(event));
    }

    render() {
        const { classes } = this.props;

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left">
                <div className={classes.toolbar} />
                <Divider />
                <List component="nav">
                    <ListItem button onClick={() => this.handleListClick('all')}>
                        <ListItemIcon>
                            <Icon>list</Icon>
                        </ListItemIcon>
                        <ListItemText primary="All Tasks" />
                    </ListItem>

                    <ListItem button onClick={() => this.handleListClick('completed')}>
                        <ListItemIcon>
                            <Icon>check_circle</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Completed Tasks" />
                    </ListItem>

                    <ListItem button onClick={() => this.handleListClick('incomplete')}>
                        <ListItemIcon>
                            <Icon>check_circle_outline</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Incomplete Tasks" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {this.props.lists.map((list, index) =>
                        <ListItem button className={classNames({
                            [classes.selectedMenuItem]: list.id === this.props.selectedListId,
                            [classes.selected]: this.props.isSelected && this.state.selectedIndex === index
                        })} onClick={() => this.handleListClick(list)} key={list.id} onMouseOver={() => this.select(index)}>
                            <ListItemIcon className={classes.icon}>
                                <Icon>chevron_right</Icon>
                            </ListItemIcon>

                            <ListItemText inset primary={list.title} />

                            <ListItemSecondaryAction>
                                <IconButton onClick={event => this.handleMoreClick(list, event.currentTarget)}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={() => window.open('https://www.github.com/bluzi/awesome-google-tasks')}>
                        <ListItemIcon>
                            <Icon>code</Icon>
                        </ListItemIcon>
                        <ListItemText primary="View Source on GitHub" />
                    </ListItem>
                    <ListItem button onClick={() => window.open('https://mail.google.com/tasks/canvas')}>
                        <ListItemIcon>
                            <Icon>http</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Original Site" />
                    </ListItem>
                    <ListItem button onClick={this.props.onAboutClick}>
                        <ListItemIcon>
                            <Icon>info</Icon>
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                </List>
                <Menu
                    anchorEl={this.state.menuAnchorElement}
                    open={Boolean(this.state.menuAnchorElement)}
                    onClose={this.handleMenuClose.bind(this)}>

                    <MenuItem onClick={() => this.handleMenuClose(this.props.onSelectedListChanged(this.state.pressedList))}>Open</MenuItem>
                    <MenuItem onClick={this.handleRename.bind(this)}>Rename</MenuItem>
                    <MenuItem onClick={() => this.handleMenuClose(this.props.onDeleteList(this.state.pressedList))}>Delete</MenuItem>
                </Menu>
            </Drawer>
        );
    }

    handleListClick(list) {
        if (this.props.onSelectedListChanged) {
            this.props.onSelectedListChanged(list);
        }
    }

    handleRename(list) {
        this.handleMenuClose();
        this.props.onRenameList(this.state.pressedList);
    }

    handleMoreClick(list, element) {
        this.setState({ pressedList: list, menuAnchorElement: element });
    }

    handleMenuClose() {
        this.setState({ pressedList: undefined, menuAnchorElement: undefined });
    }

    handleKeyDown(event) {
        if (!this.props.isSelected) return;

        const upArrow = 38;
        const downArrow = 40;
        const enter = 13;
        const edit = 69;
        const del = 68;
        const newKey = 78;

        if (event.keyCode === upArrow) {
            const selectedIndex = (this.state.selectedIndex - 1 < 0) ? this.props.lists.length - 1 : (this.state.selectedIndex - 1);
            this.setState({ selectedIndex });
        } else if (event.keyCode === downArrow) {
            const selectedIndex = (this.state.selectedIndex + 1 > this.props.lists.length - 1) ? 0 : (this.state.selectedIndex + 1);
            this.setState({ selectedIndex });
        } else if (this.props.lists[this.state.selectedIndex]) {
            const selectedList = this.props.lists[this.state.selectedIndex];

            if (event.keyCode === enter) {
                this.props.onSelectedListChanged(selectedList);
            } else if (event.ctrlKey && event.keyCode === edit) {
                this.props.onRenameList(selectedList);
            } else if (event.ctrlKey && event.keyCode === del) {
                this.props.onDeleteList(selectedList);
            } else if (event.ctrlKey && event.keyCode === newKey) {
                this.props.onNewList();
            }
        }
    }

    select(index) {
        this.props.onSelect();
        this.setState({ selectedIndex: index });
    }
}

export default withStyles(styles)(TaskLists);