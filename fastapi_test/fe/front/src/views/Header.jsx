import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 追加
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Modal from "react-modal";
import New from './new/new';

const pages = ['ユーザー追加'];
const settings = [];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [user_name, setUser_name] = React.useState('');
  const [kanji_name, setKanji_name] = React.useState('');
  const [kata_name, setKata_name] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [is_approval, setIs_approval] = React.useState('');
  const navigate = useNavigate(); // useNavigateを使用してリダイレクト

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token");  // トークンを削除
    navigate("/login");  // ログインページにリダイレクト
  };

  function openModal() {
    console.log("openModal called");  // ✅ モーダルが呼ばれているか確認
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      position: 'fixed',
      top: "20%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "50%",
      maxWidth: "50%",
    },
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              User
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page}
                    component={Link}
                    to="/new"
                    sx={{ my: 2, color: 'black', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  ログイン
                </Button>
              </Menu>
            </Box>

            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={openModal}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
              <Button 
                component={Link} 
                to="/login"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                ログイン
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* 他のメニュー項目があれば追加 */}
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">ログアウト</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="ユーザー追加フォーム"
      >
        <New 
          setIsOpen={setIsOpen}
          user_name={user_name}
          setUser_name={setUser_name}
          kanji_name={kanji_name}
          setKanji_name={setKanji_name}
          kata_name={kata_name}
          setKata_name={setKata_name}
          password={password}
          setPassword={setPassword}
          position={position}
          setPosition={setPosition}
          is_approval={is_approval}
          setIs_approval={setIs_approval} 
        />
      </Modal>
    </>
  );
}

export default ResponsiveAppBar;
