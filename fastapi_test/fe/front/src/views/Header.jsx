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
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// トークンをリフレッシュする関数
const getAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh_token/`, {
      refresh_token: refreshToken, // リフレッシュトークンを送信
    });
    const { access_token } = response.data; // 新しいアクセストークンを受け取る
    localStorage.setItem('token', access_token); // ローカルストレージに保存
    return access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw new Error('Failed to refresh token');
  }
};

// リクエストを送る関数（トークンが切れていたらリフレッシュして再試行）
const makeRequest = async (endpoint, method = 'GET', data = null) => {
  let token = localStorage.getItem('token'); // 現在のアクセストークンを取得

  if (!token) {
    console.error('No token found, unable to make request');
    return;
  }

  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`, // トークンをAuthorizationヘッダーに追加
        'Content-Type': 'application/json',
      },
      data: data, // POSTデータなどがある場合
    });

    return response.data; // 正常にレスポンスを返す
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // トークンが無効または期限切れの場合（401エラー）
      console.log('Token expired or invalid, refreshing token...');
      try {
        token = await getAccessToken(); // 新しいトークンを取得
        // 新しいトークンでリクエストを再試行
        const retryResponse = await axios({
          url: `${API_URL}${endpoint}`,
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: data,
        });

        return retryResponse.data; // 新しいトークンでのレスポンスを返す
      } catch (refreshError) {
        console.error('Error while refreshing token:', refreshError);
        throw new Error('Authentication failed');
      }
    } else {
      console.error('Request failed:', error);
      throw new Error('Request failed');
    }
  }
};

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
                pr: 3,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Seat_reservation
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
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  ログイン
                </Button>
                <Button 
                  component={Link} 
                  to="/"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  ユーザー一覧
                </Button>
                <Button
                  component={Link}
                  to="/new"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  ユーザー追加
                </Button>
                <Button 
                  component={Link} 
                  to="/seat_regist"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  座席一覧
                </Button>
                <Button 
                  component={Link} 
                  to="/seat_regist/new"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  座席追加
                </Button>
                <Button 
                  component={Link} 
                  to="/office"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  事業所一覧
                </Button>
                <Button 
                  component={Link} 
                  to="/office/new"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  事業所追加
                </Button>
                <Button 
                  component={Link} 
                  to="/pasokon"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  パソコン一覧
                </Button>
                <Button 
                  component={Link} 
                  to="/pasokon/new"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  パソコン追加
                </Button>
                <Button 
                  component={Link} 
                  to="/seat_reservation"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  座席予約一覧
                </Button>
                <Button 
                  component={Link} 
                  to="/seat_reservation/new"
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  座席予約追加
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
              Seat_reservation
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button 
                component={Link} 
                to="/login"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                ログイン
              </Button>
              <Button 
                component={Link} 
                to="/"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                ユーザー一覧
              </Button>
              <Button 
                component={Link} 
                to="/new"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                ユーザー追加
              </Button>
              <Button 
                component={Link} 
                to="/seat_regist"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                座席一覧
              </Button>
              <Button 
                component={Link} 
                to="/seat_regist/new"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                座席追加
              </Button>
              <Button 
                component={Link} 
                to="/office"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                事業所一覧
              </Button>
              <Button 
                component={Link} 
                to="/office/new"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                事業所追加
              </Button>
              <Button 
                component={Link} 
                to="/pasokon"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                パソコン一覧
              </Button>
              <Button 
                component={Link} 
                to="/pasokon/new"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                パソコン追加
              </Button>
              <Button 
                component={Link} 
                to="/seat_reservation"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                座席予約一覧
              </Button>
              <Button 
                component={Link} 
                to="/seat_reservation/new"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                座席予約追加
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
