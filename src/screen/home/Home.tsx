import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import HomeView from './Home.view';

import { search } from '../../service/spotifySearch/spotifySearch';

import Styles from './Home.style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header/Header';
import useProfile from '../../contexts/profile/useProfile';
import useGoogleToken from '../../contexts/googleToken/useToken';

export interface ISongs {
    album: string;
    artist: string;
    id: string;
    imageUri: string;
    is_playable: any;
    preview_url: any;
    title: string;
}

export default function Home() {

    const classes = Styles;

    const navigation = useNavigation();

    const { googleToken } = useGoogleToken();

    const [text, setText] = useState<string>()
    const [songs, setSongs] = useState<ISongs[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const { setNewProfile } = useProfile();

    useEffect(() => componentMount(), [])

    useEffect(() => {
        if (!text) {
            setSongs([])
        }
    }, [text])

    function handleSearchChange(text) {
        setText(text);
    }

    function componentMount() {
        loadProfile();
    }

    async function onSearch(text: string) {
        const data = await search({ limit: 30, offset: 0, value: text });
        setSongs(data);
    };

    async function loadProfile() {
        const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleToken}`);
        const userinfo = await response.json();
        setNewProfile(userinfo);
        setLoading(false);
    }

    async function playSound(item: ISongs) {

        navigation.navigate('Music', {
            itemId: item.id,
            music: item.preview_url,
            title: item.title,
            image: item.imageUri,
            artist: item.artist,
            album: item.album
        });

    }

    function iconFunction() {
        onSearch(text)
    }

    function renderList({ item }: { item: ISongs }) {
        return (
            <TouchableOpacity onPress={() => playSound(item)}>
                <View style={classes.musicBox}>
                    <Image
                        style={classes.image}
                        source={{ uri: item.imageUri }}
                    />
                    <View style={{ justifyContent: 'space-around' }}>
                        <Text style={classes.titleMusic}>{item.title}</Text>
                        <Text style={[classes.titleMusic, { fontSize: 12, fontWeight: '600' }]}>{item.artist}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    function bannerVisible() {
        if (!songs) return;

        if (songs.length > 0) return "none"; else return "flex";

    }

    return (
        !loading ? (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#27153E' }}>
                <Header />
                <HomeView
                    text={text}
                    data={songs}
                    bannerVisible={bannerVisible()}
                    iconFunction={iconFunction}
                    renderList={renderList}
                    handleSearchChange={handleSearchChange}
                />
            </SafeAreaView>
        ) : (
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: '#27153E' }}>
                <ActivityIndicator size={100} color="#fafafa" />
            </View>
        )
    );
}