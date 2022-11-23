import { User } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import {
	createUserDocumentFromAuth,
	onAuthStateChangedListener,
} from "../utils/firebase.utils";

type UserContextValues = {
	currentUser: User | null;
	setCurrentUser: (_: User | null) => void;
};

const defaultValues: UserContextValues = {
	currentUser: null,
	setCurrentUser: () => null,
};

export const UserContext = createContext(defaultValues);

type UserProviderProps = {
	children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const value = { currentUser, setCurrentUser };

	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener((user) => {
			if (user) {
				createUserDocumentFromAuth(user);
			}
			setCurrentUser(user);
		});

		return unsubscribe;
	}, []);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
