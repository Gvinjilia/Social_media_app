import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePost } from "../contexts/PostContext";
import { useEffect, useState } from "react";
import PostDetails from "./PostDetails";

const Posts = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const { getPosts, posts } = usePost();

    useEffect(() => {
        getPosts();
    }, []);

    const tags = [...new Set(posts.flatMap((post) => post.tags ? post.tags.map((t) => t.toLowerCase()) : []))];

    const filteredPosts = posts.filter(post => {
        const matchesSearch = !search.trim() || post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());

        const matchesTag = !selected || (post.tags && post.tags.some((t) => t.toLowerCase() === selected.toLowerCase()));

        return matchesSearch && matchesTag;
    });

    return (
        <ScrollView style={styles.mainDiv}>
            <TextInput style={styles.searchInput} placeholder="Search posts..." placeholderTextColor="#999" value={search} onChangeText={setSearch} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tagsMainDiv}>
                    <TouchableOpacity style={[styles.tagsStyles, !selected && styles.tagsStylesPressed]} onPress={() => setSelected(null)}>
                        <Text style={[styles.tagTextStyle, !selected && styles.tagTextStylePressed]}>All</Text>
                    </TouchableOpacity>
                    {
                        tags.length > 0 && (
                            tags.map((t, index) => (
                                <TouchableOpacity key={index} style={[styles.tagsStyles, selected === t && styles.tagsStylesPressed]} onPress={() => setSelected(selected === t ? null : t)}>
                                    <Text style={[styles.tagTextStyle, selected === t && styles.tagTextStylePressed]}>{t.toLowerCase()}</Text>
                                </TouchableOpacity>
                            ))
                        )
                    }
                </View>
            </ScrollView>

            <View>
                {
                    filteredPosts.length > 0 ? (
                        filteredPosts.map((p, index) => (
                            <PostDetails key={index} p={p}  />
                        ))
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>No results</Text>
                        </View>
                    )
                }
            </View>
        </ScrollView>
    );
};

export default Posts;

export const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    postStyles: {
        borderRadius: 2,
        flexDirection: 'column',
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
        borderRadius: 4,
        gap: 10,
        padding: 5
    },
    postTitleStyles: {
        fontSize: 18,
        fontWeight: 600
    },
    tagsStylesPressed: {
        backgroundColor: '#564dff',
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        padding: 5
    },
    tagsStyles: {
        borderColor: '#564dff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        padding: 5
    },
    tagTextStyle: {
        color: 'black',
        fontSize: 12
    },
    tagTextStylePressed: {
        color: 'white',
        fontSize: 12
    },
    tagsMainDiv: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 10
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 12,
        fontSize: 15,
        color: '#333',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    buttonStyles: {
        backgroundColor: '#6C63FF',
        width: '100%',
        borderRadius: 2,
        padding: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextStyles: {
        color: 'white'
    },
});