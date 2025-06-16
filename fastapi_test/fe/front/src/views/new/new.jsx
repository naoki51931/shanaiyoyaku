import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";  // デフォルトインポートに戻す

// Copyright コンポーネントはそのまま
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const token = isLoggedIn ? localStorage.getItem('token') : null;
    const decodedToken = token ? jwtDecode(token) : null;
    const loginUserPosition = decodedToken?.position || 'C'; // ログインユーザーの役職を取得

    let positionValue = data.get('position');
    let isApprovalValue = data.get('is_approval');

    // 役職制限のロジック
    const positionHierarchy = ['C', 'B', 'A']; // 役職の順序（C < B < A）

    if (positionHierarchy.indexOf(positionValue) > positionHierarchy.indexOf(loginUserPosition)) {
      // ログインユーザーの役職より上位の役職に変更しようとする場合
      isApprovalValue = '1'; // 承認ユーザーを1に設定
      alert('選択した役職は変更できません。未承認ユーザーとして設定されました。');
    }

    // ログインしていない場合、is_approval を 1 に設定
    if (!isLoggedIn) {
      isApprovalValue = '1'; // 未ログインの場合は承認ユーザーを1に設定
    }

    console.log({
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: positionValue,
      is_approval: isApprovalValue,
    });

    if (data.get('user_name') === ""){
      alert("ユーザーネームを入力して下さい。")
      return
    }
    if (data.get('kanji_name') === ""){
      alert("名前(漢字)を入力して下さい。")
      return
    }
    if (data.get('kata_name') === ""){
      alert("名前(カタカナ)を入力して下さい。")
      return
    }
    if (data.get('password') === ""){
      alert("パスワードを入力して下さい。")
      return
    }
    if (data.get('position') === ""){
      alert("役職を入力して下さい。")
      return
    }
    if (data.get('is_approval') === ""){
      alert("承認ユーザーを入力して下さい。")
      return
    }

    const user = {
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: positionValue,
      is_approval: isApprovalValue,
    };

    axios.post('http://localhost:8000/user/new/', user, {
      headers: {
          'Content-Type': 'application/json'
      },
      withCredentials: true  // 追加（必要なら）
    })
        .then(function (res) {
            console.log(res)
        })
        .catch(function (error) {
            console.log("error", error);
            alert(`エラーが発生しました: ${error.response?.data?.detail || '不明なエラー'}`);
        });
  };

  const handlePositionChange = (event) => {
    // 役職の入力値を大文字のA, B, Cに正規化
    let positionValue = event.target.value;

    // 役職が全角や小文字の場合に変換
    positionValue = positionValue
      .replace(/[ａ-ｚＡ-Ｚ]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0xfee0)) // 全角→半角変換
      .toUpperCase(); // 小文字→大文字変換

    props.setPosition && props.setPosition(positionValue);
  };

  const handleApprovalChange = (event) => {
    let approvalValue = event.target.value;

    // 承認ユーザーの入力が全角の場合、半角に変換
    approvalValue = approvalValue.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => 
      String.fromCharCode(match.charCodeAt(0) - 0xfee0) // 全角→半角変換
    );

    props.setIs_approval && props.setIs_approval(approvalValue);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="user_name"
                  required
                  fullWidth
                  id="user_name"
                  label="ユーザーネーム"
                  autoFocus
                  value={props.user_name ?? ''}
                  onChange={(event) => props.setUser_name && props.setUser_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="kanji_name"
                  required
                  fullWidth
                  id="kanji_name"
                  label="名前(漢字)"
                  autoFocus
                  value={props.kanji_name ?? ''}
                  onChange={(event) => props.setKanji_name && props.setKanji_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="kata_name"
                  required
                  fullWidth
                  id="kata_name"
                  label="名前(カタカナ)"
                  autoFocus
                  value={props.kata_name ?? ''}
                  onChange={(event) => props.setKata_name && props.setKata_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={props.password ?? ''}
                  onChange={(event) => props.setPassword && props.setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  title="役職は「A」「B」「C」の三つです。"
                  id="position"
                  label="役職"
                  name="position"
                  autoComplete="position"
                  value={props.position ?? ''}
                  onChange={handlePositionChange} // 変更された役職を処理
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  title="承認ユーザーが2になることですべての機能が使用できます。デフォルトは1です。"
                  id="is_approval"
                  label="承認ユーザー"
                  name="is_approval"
                  autoComplete="is_approval"
                  value={props.is_approval ?? ''}
                  onChange={handleApprovalChange} // 承認ユーザーが全角入力される場合に変換
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
