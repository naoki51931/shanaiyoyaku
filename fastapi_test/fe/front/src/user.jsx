import axios from "axios"
import { useState, useEffect } from "react"
import "./css/UserList.css";

const Back_URL = "http://127.0.0.1:8000";

export const UserList = () => {
	const [users, setUsers] = useState([])
	const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [kanji_name, setKanji_name] = useState("")
    const [kata_name, setKata_name] = useState("")
    const [position, setPosition] = useState("")
    const [is_approval, setIs_approval] = useState("")

	function handlePush() {
        if (user !== "" && password !== "" && kanji_name !== "" && kata_name !== "" && position !== "" && is_approval !== "") {
			setUsers(users.concat([user]))
			setUser("")
            setPassword("");
            setKanji_name("");
            setKata_name("");
            setPosition("");
            setIs_approval("");
		}
	}
	function handleGetUsers() {
		axios.get(Back_URL + "/user/all/").then((res) => {
			let tmpUsers = []
			for (let i = 0; i < res.data.length; i++) {
				tmpUsers = tmpUsers.concat([
					{
						id: res.data[i].id,
						kanji_name: res.data[i].kanji_name,
                        kata_name: res.data[i].kata_name,
                        position: res.data[i].position,
                        is_superuser: res.data[i].is_superuser,
                        is_approval: res.data[i].is_approval,
                        created_at: res.data[i].created_at,
                        updated_at: res.data[i].updated_at,
					},
				])
			}
			setUsers(tmpUsers)
		})
	}
	useEffect(() => {
		handleGetUsers()
	}, [])
	function handlePush() {
		if (password !== "" && kanji_name !== "" && kata_name !== "" && position !== "" && is_approval !== "") {
			axios.post(Back_URL + "/user/", {
					password: password,
                    kanji_name: kanji_name,
                    kata_name: kata_name,
                    position: position,
                    is_approval: is_approval
				}).then(() => {
				handleGetUsers()
			})
			setPassword("");
            setKanji_name("");
            setKata_name("");
            setPosition("");
            setIs_approval("");
		}
	}
	function handleDelete(index) {
		axios.delete(Back_URL + `/user/` + users[index].id).then(() => {
			handleGetUsers()
		})
	}

	return (
		<div className="UserList">
			<h1 className="title">ユーザー一覧　編集閲覧画面</h1>
            <h2>新規ユーザー追加</h2>
        <ul className="ul">
            <li className="li">
                <span className="span">パスワード</span>
                <span className="span">名前（漢字）</span>
                <span className="span">名前（カタカナ）</span>
                <span className="span">役職</span>
                <span className="span">承認</span>
                <span className="span"></span>
            </li>
            <li className="li">
			<span className="span"><input value={password} onChange={(e) => setPassword(e.target.value)} /></span>
            <span className="span"><input value={kanji_name} onChange={(e) => setKanji_name(e.target.value)} /></span>
            <span className="span"><input value={kata_name} onChange={(e) => setKata_name(e.target.value)} /></span>
            <span className="span"><input value={position} onChange={(e) => setPosition(e.target.value)} /></span>
            <span className="span"><input value={is_approval} onChange={(e) => setIs_approval(e.target.value)} /></span>
			<span className="span"><button onClick={handlePush} className="button">
				登録
			</button></span>
            </li>
            </ul>
			<h2>ユーザー一覧</h2>
			<ul className="ul">
                <li className="li">
                    <span className="span">ID</span>
                    <span className="span">名前</span>
                    <span className="span">名前（カタカナ）</span>
                    <span className="span">役職</span>
                    <span className="span">管理者</span>
                    <span className="span">承認</span>
                    <span className="span">追加日時</span>
                    <span className="span">更新日時</span>
                </li>
				{users.map((User, index) => (
					<li key={index} className="li">
						<span className="span">{User.id}</span>
                        <span className="span">{User.kanji_name}</span>
                        <span className="span">{User.kata_name}</span>
                        <span className="span">{User.position}</span>
                        <span className="span">{User.is_superuser && "〇"}</span>
                        <span className="span">{User.is_approval}</span>
                        <span className="span">{User.created_at}</span>
                        <span className="span">{User.updated_at}</span>
                        <button onClick={() => handleDelete(index)} className="button">
							削除
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}