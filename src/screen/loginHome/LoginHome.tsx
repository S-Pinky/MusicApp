import React, { useEffect } from 'react';
import LoginView from './LoginHome.view';

import { useNavigation } from "@react-navigation/native";
import useProfile from '../../contexts/profile/useProfile';


export default function LoginHome() {

    const navigation = useNavigation();

    const {profile, setNewProfile} = useProfile();

    useEffect(() => {
        console.log('profile', profile);
    },[])

    function loginButton(){
        navigation.navigate('Login');
    }

    return (
        <LoginView
            buttonFunction={loginButton}
            textFunction={() => null}
        />
    );
}