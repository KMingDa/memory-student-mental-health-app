import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
} from "react-native";

export default function BookshelfGame() {
  // Lock to landscape
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const width = Math.max(screenWidth, screenHeight);
  const height = Math.min(screenWidth, screenHeight);

  // Book images (6 books)
  const bookImages = [
    require("../../assets/images/book1.png"),
    require("../../assets/images/book2.png"),
    require("../../assets/images/book3.png"),
    require("../../assets/images/book4.png"),
    require("../../assets/images/book5.png"),
    require("../../assets/images/book6.png"),
  ];

  // ✅ Individual sizes for each book
  const bookSizes = [
    { width: 80, height: 100 }, // book1
    { width: 70, height: 90 },  // book2
    { width: 95, height: 95 },// book3
    { width: 60, height: 80 },  // book4
    { width: 90, height: 80 }, // book5
    { width: 60, height: 65 },  // book6
  ];

  const topMargin = 40;
  const bottomMargin = 40;

  // Dynamic vertical spacing so all books fit on screen
  const spacing =
    (height - topMargin - bottomMargin - 120) / (bookImages.length - 1);

  // Create pan + responder for each book
  const books = bookImages.map((_, index) => {
    const pan = useRef(
      new Animated.ValueXY({
        x: width - bookSizes[index].width - 40, // ✅ adjust for book width
        y: topMargin + index * spacing,
      })
    ).current;

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan as any).x._value,
          y: (pan as any).y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    });

    return { pan, responder };
  });

  return (
    <ImageBackground
      source={require("../../assets/images/bookibg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Shelf Image (keep original position) */}
      <Image
        source={require("../../assets/images/shelf.png")}
        style={styles.shelf}
        resizeMode="contain"
      />

      {/* Render draggable books */}
      {bookImages.map((img, i) => (
        <Animated.View
          key={i}
          {...books[i].responder.panHandlers}
          style={[styles.bookWrapper, books[i].pan.getLayout()]}
        >
          <Image
            source={img}
            style={{
              width: bookSizes[i].width,
              height: bookSizes[i].height,
            }}
            resizeMode="contain"
          />
        </Animated.View>
      ))}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#faf3e0",
    alignItems: "center",
    justifyContent: "center",
  },
  shelf: {
    height: 400,       // ✅ original shelf size
    marginBottom: -55, // ✅ original offset
    marginLeft: -300,  // ✅ original offset
  },
  bookWrapper: {
    position: "absolute",
  },
});