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

    // const searchSeats = () => {
    //     axios.post('http://localhost:8000/seat_reservation/all/', { query })
    //         .then((res) => {
    //             console.log("検索結果:", res.data);
                
    //             if (res.data.length > 0) {
    //                 props.setDisplay(res.data);
    //                 props.setFlag(true);
    //             } else {
    //                 props.setFlag(false);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("検索エラー", error);
    //             props.setFlag(false);
    //         });
    // };

    const funget = () => {
        axios.get('http://localhost:8000/seat_reservation/all/')
            .then(function (res) {
                console.log(res.data.length)
                console.log(res)
                if(res.data.length > 0){
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                reserve_id: res.data[i].reserve_id,
                                todo_content: res.data[i].todo_content,
                                person_id: res.data[i].person_id,
                                person_name: res.data[i].person_name,
                                office_id: res.data[i].office_id,
                                office_name: res.data[i].office_name,
                                seat_id: res.data[i].seat_id,
                                seat_name: res.data[i].seat_name,
                                pasokon_id: res.data[i].pasokon_id,
                                pasokon_name: res.data[i].pasokon_name,
                                start_time: res.data[i].start_time,
                                finish_time: res.data[i].finish_time,
                                reserve_day: res.data[i].reserve_day,
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
    
    // return (
    //     <Grid container rowSpacing={1} position={'static'} marginTop={"15px"} marginLeft={"5px"}> 
    //         <form onSubmit={(e) => { e.preventDefault(); searchSeats(); }}>
    //             <Grid item>
    //                 <TextField
    //                     label="座席名を入力"
    //                     value={query}
    //                     onChange={handleQueryChange}
    //                 />
    //             </Grid>                
    //             <Grid item>
    //                 <Button variant="contained" onClick={searchSeats}>検索</Button>
    //             </Grid>
    //         </form>
    //     </Grid>
    // )
}