import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import logo from '../assets/matlala-icon.png';
import '../App.css';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import LogoutButton from './LogoutButton.js';
import { useAuth0 } from "@auth0/auth0-react";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(-5),

  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(15),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(15),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

}));

const Header = () => {
  const {isAuthenticated, isLoading, error } = useAuth0();
  const classes = useStyles();

  return (
    <div className={classes.root}>
    {isAuthenticated && (
      <div>
      <nav className="navbar navbar-inverse">
        <div className="container">
          <div className="navbar-header">
              <img src={logo} className="logo" alt="" />
          </div>
            <LogoutButton />
        </div>
      </nav>
      </div>



    )}
    {!error && isLoading && <div className="loading"><p>Loading...</p></div>}
    </div>
  );
}

export default Header;
