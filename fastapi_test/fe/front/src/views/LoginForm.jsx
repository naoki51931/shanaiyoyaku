import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Nginx が /auth/token を FastAPI にリバースプロキシしてる構成なので
// ベースURLのデフォルトは ""（ルート）でOK
const API_URL = "/api";
// ついでにデバッグログ仕込んでおくと安心
console.log("API_URL =", API_URL);

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 👈 追加: パスワード表示フラグ
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 🔹 トークン有効期限チェック (ログアウト処理)
    useEffect(() => {
        const checkTokenExpiry = () => {
            const exp = localStorage.getItem('token_exp');
            if (exp && Date.now() >= exp * 1000) {
                localStorage.removeItem('token');
                localStorage.removeItem('token_exp');
                navigate('/login'); // 有効期限切れ時にログアウト
            }
        };

        const interval = setInterval(checkTokenExpiry, 60000); // 🔄 1分ごとにチェック
        return () => clearInterval(interval); // ✅ クリーンアップ
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // `application/x-www-form-urlencoded` のデータ形式に変換
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            // FastAPI の `/token` エンドポイントにリクエスト
            const response = await axios.post(`${API_URL}/auth/token`, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true,  // 追加（必要なら）
            });

            const token = response.data.access_token;
            localStorage.setItem('token', token); // トークンを保存
            const tokenPayload = JSON.parse(atob(token.split('.')[1])); // デコード
            localStorage.setItem('token_exp', tokenPayload.exp);

            navigate('/'); // rootへ遷移
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'ログイン中にエラーが発生しました。';
            setError(errorMessage);
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
                        type={showPassword ? 'text' : 'password'}  // 👈 ここで表示/非表示を切り替え
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: '4px', marginBottom: '12px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            style={{ marginRight: '4px' }}
                        />
                        パスワードを表示
                    </label>
                </div>
                <button type="submit">ログイン</button>
            </form>
        </div>
    );
};

export default Login;

