import './App.css';
import React, { useState } from 'react'
import Header from './views/Header'
import Form from './views/Form'
import List from './views/List';

export default function App() {
  const [display, setDisplay] = useState([]);
  const [flag, setFlag] = useState(false);
  
  return (
    <>
      {/* ヘッダー */}
      <Header />
      {/* フォーム */}
      <Form display={display} setDisplay={setDisplay} setFlag={setFlag} />
      {/* テーブル(検索結果の表示) */}
      <List searchResult={display} displayFlag={flag} />
    </> 
  );
}