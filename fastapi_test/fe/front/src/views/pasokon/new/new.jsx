import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
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
import Chip from '@mui/material/Chip';  // タグ用のChipコンポーネント

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
const BASE_URL = "http://localhost:8000";

export default function SignUp(props) {
  const [offices, setOffices] = useState([]);
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);
  const [tags, setTags] = useState([]); // タグのID（整数型）のリスト
  const [softName, setSoftName] = useState(''); // ソフト名の入力状態
  const [availableTags, setAvailableTags] = useState([]); // 既存のタグを管理

  useEffect(() => {
    axios.get(`${BASE_URL}/office/all/`)
      .then((res) => {
        setOffices(res.data);
      })
      .catch((error) => {
        console.error('オフィス情報の取得に失敗:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/seat/all/`)
      .then((res) => {
        setSeats(res.data);
      })
      .catch((error) => {
        console.error('シート情報の取得に失敗:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/tags/`)  // 既存タグを取得
      .then((res) => {
        setAvailableTags(res.data);
      })
      .catch((error) => {
        console.error('タグ情報の取得に失敗:', error);
      });
  }, []);

  useEffect(() => {
    if (props.office_id) {
      const filtered = seats.filter(seat => seat.office_id === props.office_id);
      setFilteredSeats(filtered);
    } else {
      setFilteredSeats([]);
    }
  }, [props.office_id, seats]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); // タブキーでフォーカスが移動しないようにする
      if (softName && !tags.includes(softName)) {
        // ソフト名で新しいタグを追加
        axios.post(`${BASE_URL}/tags/`, { tag_name: softName })
          .then((res) => {
            // 新しいタグIDを取得
            const newTagId = res.data.id;
            setTags([...tags, newTagId]); // 新しいタグのIDを追加
            setSoftName(''); // 入力フィールドをリセット
            // 新しいタグが追加された後、新しいタグリストを再取得
            axios.get(`${BASE_URL}/tags/`)
              .then((res) => setAvailableTags(res.data));
          })
          .catch((error) => {
            console.error('タグの追加に失敗:', error);
          });
      }
    }
  };

  const handleTagDelete = (index) => {
    const newTags = tags.filter((_, tagIndex) => tagIndex !== index);
    setTags(newTags);
  };

  const handleTagSelect = (event) => {
    const selectedTagId = event.target.value;
    if (selectedTagId && !tags.includes(selectedTagId)) {
      setTags([...tags, selectedTagId]); // 既存タグIDを追加
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const token = localStorage.getItem('token');
    if (typeof token !== 'string') {
      console.error("Invalid token:", token);
    }
    const decodedToken = jwtDecode(token);
    const loginUserIsApproval = decodedToken?.is_approval;

    const Approval_level = 2;
    if (loginUserIsApproval !== Approval_level) {
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return;
    }

    const pasokon = {
      pasokon_name: data.get('pasokon_name'),
      in_active: data.get('in_active'),
      soft_id: tags, // タグIDのリストをそのまま送信
      office_id: data.get('office_id'),
      seat_id: data.get('seat_id'),
    };

    axios.post(`${BASE_URL}/pasokon/new/`, pasokon, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true  // 追加（必要なら）
    })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log("error", error);
        alert(`エラーが発生しました: ${error.response?.data?.detail || '不明なエラー'}`);
      });
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
                  autoComplete="pasokon_name"
                  name="pasokon_name"
                  required
                  fullWidth
                  id="pasokon_name"
                  label="パソコン名"
                  autoFocus
                  value={props.pasokon_name ?? ''}
                  onChange={(event) => props.setPasokon_name && props.setPasokon_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="in-active-select-label">使用可不可</InputLabel>
                  <Select
                    labelId="in-active-select-label"
                    id="in_active"
                    name="in_active"
                    value={props.in_active === null || props.in_active === undefined ? 0 : props.in_active}
                    label="使用可不可"
                    onChange={(event) => props.setIn_active && props.setIn_active(parseInt(event.target.value, 10))}
                  >
                    <MenuItem value={0}>不可</MenuItem>
                    <MenuItem value={1}>予約中</MenuItem>
                    <MenuItem value={2}>使用可</MenuItem>
                    <MenuItem value={3}>破損</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="soft_name"
                  name="soft_name"
                  required
                  fullWidth
                  id="soft_name"
                  label="導入ソフト"
                  value={softName}
                  onChange={(event) => setSoftName(event.target.value)}
                  onKeyDown={handleKeyDown} // タグ追加の処理
                />
                <Box sx={{ mt: 2 }}>
                  {/* テキスト入力と選択されたタグ表示 */}
                  {tags.map((tagId, index) => (
                    <Chip
                      key={index}
                      label={tagId}  // タグIDを表示（タグ名ではなくID）
                      onDelete={() => handleTagDelete(index)}
                      sx={{ margin: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="tag-select-label">タグ選択</InputLabel>
                  <Select
                    labelId="tag-select-label"
                    value=""
                    onChange={handleTagSelect}  // 既存タグを選択
                  >
                    <MenuItem value="">タグを選択</MenuItem>
                    {availableTags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="office-select-label">事務所</InputLabel>
                  <Select
                    labelId="office-select-label"
                    id="office_id"
                    name="office_id"
                    value={props.office_id ?? ''}
                    label="事務所"
                    onChange={(event) => props.setOffice_id && props.setOffice_id(event.target.value)}
                  >
                    <MenuItem value="">オフィスを選択してください</MenuItem>
                    {offices.map((office) => (
                      <MenuItem key={office.id} value={office.id}>
                        {office.office_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="seat-select-label">座席</InputLabel>
                  <Select
                    labelId="seat-select-label"
                    id="seat_id"
                    name="seat_id"
                    value={props.seat_id ?? ''}
                    label="座席"
                    onChange={(event) => props.setSeat_id && props.setSeat_id(event.target.value)}
                  >
                    <MenuItem value="">座席を選択してください</MenuItem>
                    {filteredSeats.map((seat) => (
                      <MenuItem key={seat.id} value={seat.id}>
                        {seat.seat_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
