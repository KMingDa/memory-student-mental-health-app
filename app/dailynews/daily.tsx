import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ASSUMING PixelDialog is available in the relative path provided
import PixelDialog from "../memory-modal/popout";

// --- ASSET IMPORTS ---
const assets = {
    misahead: require('@/assets/images/misahead.png'), 
    home: require('../../assets/images/home.png'),
    bear: require('../../assets/images/bear.png'),
    trophy: require('../../assets/images/trophy.png'),
    settings: require('../../assets/images/settings.png'),
};

interface Article {
    id: string;
    title?: string;
    body?: string;
    image: any;
}

// LOREM IPSUM CONTENT FOR THE BRAINCELLS ARTICLE
const braincellsArticleContent = {
    title: "There is More Than One Braincells in Human Brain?", 
    image: require("../../assets/images/zb1.jpg"), 
    fullText: `
        Recent studies have challenged the long-held misconception that human cognition operates on a single functional braincell. Emerging evidence suggests the existence of multiple active units—commonly referred to as “braincells”—working in chaotic yet coordinated harmony to produce thoughts, emotions, and questionable life decisions.
        For centuries, scholars debated how humans managed to maintain sentient behavior while demonstrating inconsistent decision-making. Early theories proposed a solitary, overworked braincell controlling all neural processes. However, advancements in neuro-simulation and thoughtwave imaging have revealed a more complex system—one that thrives on internal disagreement.
        Initial scans indicate that human braincells specialize in different functions:

         - Logic Cells: Handle problem-solving and reasoning (though occasionally absent).

         - Emotion Cells: Responsible for spontaneous decisions and dramatic flair.

         - Memory Cells: Store valuable data, but tend to misplace it under pressure.

         - Chaos Cells: Their purpose remains unknown, but they appear highly active during group discussions and midnight thoughts.

        Anaxa’s experimental replication of these dynamics in an artificial system led to mixed results—literally. While the system demonstrated creativity, it also began arguing with itself about snack preferences.
        These findings suggest that intelligence may not stem from singular precision but from the noisy collaboration of many imperfect contributors. The human brain, in its unpredictable brilliance, exemplifies organized disorder—something artificial cognition continues to struggle to imitate authentically.
        There is, indeed, more than one braincell in the human brain—though whether they cooperate is another question entirely. As Anaxa notes:

        "True intelligence might just be several confused neurons agreeing to disagree."
    `,
};


// --- DATE FORMATTING FUNCTION ---
const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).replace(/ /g, ' '); 
};

const formattedDate = getFormattedDate(); 

export default function DailyNews() {
    const router = useRouter();
    
    const [fontsLoaded] = useFonts({
        Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
        Jersey15: require("@/assets/fonts/Jersey15-Regular.ttf"), 
    });

    const articles: Article[] = [
        {
            id: "Anaxa's Ideology",
            title: "There is More Than One Braincells in Human Brain?",
            body:
                "A research conducted by Prof. Anaxagoras showed that human intelligence may be influenced by the amount of braincells present in a person’s brain...",
            image: require("../../assets/images/zb1.jpg"),
        },
        // ... rest of the articles 
        {
            id: "Vera's New Launch",
            image: require("../../assets/images/newprod.png"),
        },
        {
            id: "Frieren, Stop Stealing My Food!",
            image: require("../../assets/images/berry.png"),
        },
        {
            id: "What's that?",
            title: "FACT OF THE DAY",
            body:
                "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient tombs that are still edible!",
            image: null,
        },
        {
            id: "Weather Report: Ice Cream Sales Soar",
            image: require("../../assets/images/icecream.png"),
        },
        {
            id: "I got 99 Problems but Exercise Ain't One",
            title: "11 minutes of aerobic Daily lowers diabetes risk",
            body:
                "Studies and research show that adding 11 minutes of exercise to your day could lower your risk of chronic diseases ...",
            image: require("../../assets/images/exercise.jpg"),
        },
    ];

    const [modalVisible, setModalVisible] = useState(false);
    const [showArticleModal, setShowArticleModal] = useState(false); 

    const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"like" | "neutral" | "dislike" | null>(
        null
    );
    const [comment, setComment] = useState("");
    const [showDialog, setShowDialog] = useState(false); 

    if (!fontsLoaded) return null;

    const openModal = (articleId: string) => {
        setSelectedArticle(articleId);
        if (articleId === "Anaxa's Ideology") { 
            setShowArticleModal(true);
        } else {
            setModalVisible(true);
        }
        setFeedback(null);
        setComment("");
    };

    const submitFeedback = () => {
        console.log("Feedback for article:", selectedArticle);
        console.log("Feedback type:", feedback);
        console.log("Comment:", comment);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Header - Moved up using negative marginTop */}
            <View style={styles.header}>
                <Text style={styles.dateText}>{formattedDate}</Text>
                <View style={styles.profileIcon}>
                    <Image
                        source={assets.misahead}
                        style={{ width: 28, height: 28, borderRadius: 14 }}
                        resizeMode="cover"
                    />
                </View>
            </View>

            {/* Title */}
            <View style={styles.titleWrapper}>
                <Text style={[styles.titleHeader, styles.daily]}>DAILY</Text>
                <Text style={[styles.titleHeader, styles.news]}>NEWS</Text>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, styles.scrollPadding]}>
                {/* Row 1: Research Findings + stacked right column (Aligned Right) */}
                <View style={styles.row}>
                    
                    {/* Left Card: Braincells (181 wide) */}
                    <TouchableOpacity 
                        style={[styles.card, { width: 181, height: 313 }]} 
                        onPress={() => openModal(articles[0].id)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={articles[0].image}
                            style={[styles.fullImage, { height: 180 }]}
                            resizeMode="cover"
                        />
                        <View style={styles.textBox}>
                            <ScrollView 
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false} 
                            >
                                <Text style={styles.title}>{articles[0].title}</Text>
                                <Text style={styles.body}>
                                    {articles[0].body}{" "}
                                    <Text style={styles.readMore}>Read more &gt;</Text>
                                </Text>
                            </ScrollView>
                        </View>
                        
                        <TouchableOpacity
                            style={styles.leftFeedbackBtn}
                            onPress={() => openModal(articles[0].id)} 
                        >
                            <Text style={styles.feedbackText}>⋮</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>


                    {/* Right Column: Two stacked ads (145 wide) */}
                    <View style={[styles.column, { marginLeft: 20 }]}> 
                        <View style={[styles.card, { width: 145, height: 152 }]}>
                            <TouchableOpacity
                                style={styles.leftFeedbackBtn}
                                onPress={() => openModal("newprod")}
                            >
                                <Text style={styles.feedbackText}>⋮</Text>
                            </TouchableOpacity>
                            <Image
                                source={articles[1].image}
                                style={styles.fullImage}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={[styles.card, { width: 145, height: 152 }]}>
                            <TouchableOpacity
                                style={styles.leftFeedbackBtn}
                                onPress={() => openModal("berry")}
                            >
                                <Text style={styles.feedbackText}>⋮</Text>
                            </TouchableOpacity>
                            <Image
                                source={articles[2].image}
                                style={styles.fullImage}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                </View>

                {/* Fact of the Day (Full Width) */}
                <View style={[styles.card, styles.factBox]}>
                    <TouchableOpacity
                        style={styles.leftFeedbackBtn}
                        onPress={() => openModal("fact")}
                    >
                        <Text style={styles.feedbackText}>⋮</Text>
                    </TouchableOpacity>
                    <Text style={styles.factTitle}>{articles[3].title}</Text>
                    <Text style={styles.factBody}>{articles[3].body}</Text>
                </View>

                {/* Row 2: Ice Cream (90 wide) + Exercise (250 wide) - SIDE BY SIDE WITH SPACE */}
                {/* --- EDITED: Row structure is now combined with "space-between" --- */}
                <View style={[styles.row, { marginTop: 12, justifyContent: 'space-between' }]}>
                    {/* Ice Cream Card (Left) */}
                    <View style={[styles.card, { width: 90, height: 205, marginBottom: 0 }]}>
                        <TouchableOpacity
                            style={styles.leftFeedbackBtn}
                            onPress={() => openModal("icecream")}
                        >
                            <Text style={styles.feedbackText}>⋮</Text>
                        </TouchableOpacity>
                        <Image
                            source={articles[4].image}
                            style={styles.fullImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Exercise Card (Right) */}
                    <View style={[styles.card, { width: 250, height: 205, marginBottom: 0 }]}>
                        <TouchableOpacity
                            style={styles.leftFeedbackBtn}
                            onPress={() => openModal("exercise")}
                        >
                            <Text style={styles.feedbackText}>⋮</Text>
                        </TouchableOpacity>
                        <Image
                            source={articles[5].image}
                            style={[styles.fullImage, { height: 120 }]}
                            resizeMode="cover"
                        />
                        <View style={styles.textBox}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.title}>{articles[5].title}</Text>
                                <Text style={styles.body}>
                                    {articles[5].body}{" "}
                                    <Text style={styles.readMore}>Read more &gt;</Text>
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                {/* --- END EDITED ROW 2 --- */}
                
            </ScrollView>

            <View style={styles.bottomBar} />
            
            {/* --- Bottom Menu (Navigation) --- */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity onPress={() => router.push('../furni-home/homesc')}>
                    <Image source={assets.home} style={styles.icon} />
                </TouchableOpacity>
        
                <TouchableOpacity onPress={() => setShowDialog(true)}>
                    <Image source={assets.bear} style={styles.icon} />
                </TouchableOpacity>
        
                <TouchableOpacity onPress={() => router.push('../../leaderboard/lead')}>
                    <Image source={assets.trophy} style={styles.icon} />
                </TouchableOpacity>
        
                <TouchableOpacity>
                    <Image source={assets.settings} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />

            {/* --- NEW ARTICLE MODAL FOR BRAINCELLS NEWS --- */}
            <Modal visible={showArticleModal} transparent animationType="slide">
                <View style={styles.modalBg}>
                    <View style={[styles.modalBox, styles.articleModalBox]}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                            <Text style={styles.articleTitle}>{braincellsArticleContent.title}</Text>
                            
                            <Image
                                source={articles[0].image}
                                style={styles.articleImage}
                                resizeMode="cover"
                            />
                            {/* Article text applied directly to Text component */}
                            <Text style={styles.articleText}>
                                {braincellsArticleContent.fullText}
                            </Text>
                        </ScrollView>
                        
                        <TouchableOpacity 
                            style={styles.articleCloseBtn} 
                            onPress={() => setShowArticleModal(false)}
                        >
                            <Text style={styles.articleCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* --- FEEDBACK MODAL (Original Modal) --- */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            Feedback for {selectedArticle}
                        </Text>

                        <TouchableOpacity onPress={() => setFeedback("like")}>
                            <Text style={feedback === "like" ? styles.selected : styles.option}>
                                👍 I like it
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFeedback("neutral")}>
                            <Text
                                style={feedback === "neutral" ? styles.selected : styles.option}
                            >
                                😐 Neutral
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFeedback("dislike")}>
                            <Text
                                style={feedback === "dislike" ? styles.selected : styles.option}
                            >
                                👎 Do not like it
                            </Text>
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Additional comments (optional)"
                            style={styles.input}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />

                        <TouchableOpacity style={styles.submitBtn} onPress={submitFeedback}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: "#ccc", marginTop: 8 }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.submitText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#d9f3ff" },
    bottomBar: { backgroundColor: "#ffe4ec", height: 28 },
    
    // --- HEADER STYLES ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF5F5',
        marginTop:30, 
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Jersey15', 
    },
    profileIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFE4EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ---------------------

    titleWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 12,
    },
    titleHeader: { fontFamily: "Jersey20", fontSize: 60 },
    daily: { color: "#000", marginRight: 6 },
    news: { color: "#D66878" },
    scrollContent: { paddingHorizontal: 12, paddingBottom: 16 },
    scrollPadding: { paddingBottom: 80 }, 
    
    // Row 1: Aligned to the right
    row: { 
        flexDirection: "row", 
        // Note: For Row 1, this is 'flex-end', for Row 2, we override to 'space-between' inline
        justifyContent: "flex-end", 
        marginBottom: 12 
    },
    
    column: { 
        flexDirection: "column", 
    }, 
    
    card: {
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    fullImage: { width: "100%", height: "100%" },
    textBox: { padding: 8, flexShrink: 1 },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#333" },
    readMore: { fontWeight: "bold", color: "#D66878" },
    body: { fontSize: 12, color: "#555" },
    factBox: { width: "95%", padding: 16, alignSelf: "center", alignItems: "center" },
    factTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
    factBody: { fontSize: 14, textAlign: "center", color: "#444" },
    leftFeedbackBtn: { 
        position: "absolute", 
        top: 8, 
        left: 8, 
        padding: 4, 
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        borderRadius: 4,
    },
    feedbackText: { fontSize: 18, color: "#555" },
    
    // --- MODAL STYLES ---
    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
    option: { fontSize: 14, paddingVertical: 6 },
    selected: { fontSize: 14, paddingVertical: 6, color: "#D66878", fontWeight: "bold" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 8,
        marginVertical: 12,
        minHeight: 60,
        textAlignVertical: "top",
    },
    submitBtn: {
        backgroundColor: "#D66878",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    submitText: { color: "#fff", fontWeight: "bold" },

    // --- NEW ARTICLE MODAL STYLES ---
    articleModalBox: {
        width: '95%',
        height: '90%',
        padding: 0,
        overflow: 'hidden',
    },
    articleTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        // Changed to left-aligned for better article reading flow
        textAlign: 'left', 
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        color: '#333',
    },
    articleImage: {
        width: '100%',
        height: 180,
        marginBottom: 15,
    },
    articleText: {
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 16,
        color: '#555',
        // --- ADDED: Justification ---
        textAlign: 'justify',
    },
    articleCloseBtn: {
        backgroundColor: "#D66878",
        padding: 12,
        alignItems: "center",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 5,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    articleCloseText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    // --- BOTTOM MENU STYLES ---
    bottomMenu: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        position: "absolute",
        bottom: 0,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        zIndex: 50,
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
});