import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // `application/x-www-form-urlencoded` のデータ形式に変換
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            // FastAPI の `/token` エンドポイントにリクエスト
            const response = await axios.post('http://localhost:8000/auth/token', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const token = response.data.access_token;
            localStorage.setItem('token', token); // トークンを保存
            navigate('/dashboard'); // ダッシュボードへ遷移
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('認証に失敗しました。ユーザー名またはパスワードが間違っています。');
            } else {
                setError('ログイン中にエラーが発生しました。後でもう一度お試しください。');
            }
        }
    };

    return (
        <div>
            <h2>ログイン</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>ユーザー名:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>パスワード:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">ログイン</button>
            </form>
        </div>
    );
};

export default Login;
