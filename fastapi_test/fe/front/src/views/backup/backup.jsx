import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export default function BackupManager() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuperUser, setIsSuperUser] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const decoded = jwtDecode(token);
      const isAdmin = decoded.is_superuser === true;
      setIsSuperUser(isAdmin);
  
      if (isAdmin) {
        axios.get(`${BASE_URL}/backups`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setBackups(res.data))
          .catch(err => console.error('バックアップ取得エラー:', err));
      }
    } catch (err) {
      console.error('トークンデコードエラー', err);
    }
  }, []);
  

  const handleDownload = (filename) => {
    window.location.href = `${BASE_URL}/download/${filename}`;
  };

  const handleRestore = async (filename) => {
    setLoading(true);
    setMessage('リストア処理中...');
    try {
      const res = await fetch(`${BASE_URL}/restore/${filename}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('リストア成功: ' + filename);
      } else {
        setMessage('エラー: ' + (data.detail || '不明なエラー'));
      }
    } catch (err) {
      setMessage('接続エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          MySQL バックアップ管理
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            バックアップファイル一覧
          </Typography>
          <List>
            {backups.map((filename) => (
              <div key={filename}>
                <ListItem>
                  <ListItemText primary={filename} />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDownload(filename)}
                    >
                      ダウンロード
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRestore(filename)}
                      disabled={loading}
                    >
                      リストア
                    </Button>
                  </Stack>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
          {message && (
            <Typography color="primary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
