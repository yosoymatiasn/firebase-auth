import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";

import {
	db,
	getUsers,
	signInWithGooglePopup,
	signOutUser,
} from "../utils/firebase.utils";
import { UserContext } from "../context/user.context";
import { collection, getDocs } from "firebase/firestore";
import { User } from "firebase/auth";

type Props = {};

type MyUser = {
	uid: string;
	email: string;
};

const Login: NextPage<Props> = ({}) => {
	const [users, setUsers] = useState<MyUser[]>([]);
	const { currentUser } = useContext(UserContext);

	useEffect(() => {
		const fetchUsers = async () => {
			const data = await getUsers();
			data.forEach(async (doc) => {
				const data = doc.data();
				setUsers((prev) => [
					...prev,
					{
						email: data.email,
						uid: doc.id,
					},
				]);
			});
			console.log(users);
		};
		fetchUsers();

		return setUsers([]);
	}, []);

	const loginUser = async () => {
		await signInWithGooglePopup();
	};

	const getPost = async () => {
		const colRef = collection(db, "posts");
		const snapshots = await getDocs(colRef);
		console.log(snapshots);
	};

	return (
		<div className="flex flex-col ">
			<h1>{!currentUser ? "Login" : "Logout, " + currentUser.displayName}</h1>
			{!currentUser ? (
				<button onClick={loginUser}>Sign in with google</button>
			) : (
				<button onClick={signOutUser}>Sign out</button>
			)}

			<button onClick={getPost}>get posts</button>

			<div className="flex w-full mt-4">
				{users.map((user, idx) => {
					return (
						<button
							className="w-1/2 flex flex-col justify-center p-4 border-black border-solid border-2 m-1 "
							key={idx}
							onClick={() => {
								// updateUserRole("admin", user.uid);
							}}
						>
							<span className="font-bold "></span>
							<span>{user.email}</span>
							<span>{user.uid}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default Login;
