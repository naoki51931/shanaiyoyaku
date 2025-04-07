import React, { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewForm from "./new/new";

export default function Form(props) {
    const [query, setQuery] = useState('');

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const searchUsers = () => {
        axios.post('http://localhost:8000/user/search/', { query })
            .then((res) => {
                console.log("検索結果:", res.data);
                
                if (res.data.length > 0) {
                    props.setDisplay(res.data);
                    props.setFlag(true);
                } else {
                    props.setFlag(false);
                }
            })
            .catch((error) => {
                console.error("検索エラー", error);
                props.setFlag(false);
            });
    };

    const funget = () => {
        axios.get('http://localhost:8000/user/all/')
            .then(function (res) {
                console.log(res.data.length)
                console.log(res)
                if(res.data.length > 0){
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                user_name: res.data[i].user_name,
                                kanji_name: res.data[i].kanji_name,
                                kata_name: res.data[i].kata_name,
                                password: res.data[i].password,
                                position: res.data[i].position,
                                is_superuser: res.data[i].is_superuser,
                                is_approval: res.data[i].is_approval,
                                created_at: res.data[i].created_at,
                                updated_at: res.data[i].updated_at,
                            }
                        ])
                    }
                        // props.setDisplay({
                        //     ...props.display,
                        //     id: v.id,
                        //     name: v.name,
                        //     password: v.password,
                        //     mailAdress: v.mailAdress,
                        // });
                    console.log(tmpUsers);
                    props.setDisplay(tmpUsers);
                    props.setFlag(true);   
                }
                else{
                    props.setFlag(false);
                }
            })
            .catch(function (error) {
                console.log("error", error);
            });
    }

    useEffect(() => {
        funget()
    }, [])
    
    return (
        <Grid container rowSpacing={1} position={'static'} marginTop={"15px"} marginLeft={"5px"}> 
            <form onSubmit={(e) => { e.preventDefault(); searchUsers(); }}>
                <Grid item>
                    <TextField
                        label="名前を入力 (漢字・カナ・ユーザー名)"
                        value={query}
                        onChange={handleQueryChange}
                    />
                </Grid>                
                <Grid item>
                    <Button variant="contained" onClick={searchUsers}>検索</Button>
                </Grid>
            </form>
        </Grid>
    )
}