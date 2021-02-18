/* eslint-disable */

import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleProp,
  View,
  ViewProps,
  ViewStyle
} from "react-native";
import { PageIndicator, PageIndicatorProps } from "./PageIndicator";
import { ScoreTextComponent, ScoreTextComponentProps } from "./ScoreTextComponent";
import { ScoreData } from "./tempData";
import { ScoreTitleComponent, ScoreTitleComponentProps } from "./ScoreTitleComponent";

const renderScoreTextWidget =
  (itemHeight: number, scrollY: Animated.Value, props?: Partial<ScoreTextComponentProps>) =>
    ({ item, index }: ListRenderItemInfo<ScoreData>) => {
      const scrollOffset = scrollY.interpolate({
        inputRange: [
          (index - 1) * itemHeight,
          index * itemHeight,
          (index + 1) * itemHeight
        ],
        outputRange: [-1, 0, 1],
        extrapolate: "clamp"
      });
      return (
        <ScoreTextComponent
          {...props}
          value={item.value ?? ""}
          containerStyle={{
            height: itemHeight,
            alignSelf: "center",
            alignItems: "center",
            backgroundColor: "red",
            ...(props?.containerStyle as {})
          }}
          textStyle={{
            fontSize: 100,
            ...(props?.textStyle as {})
          }}
          letterTransform={(index, lettersCount, containerHeight) => {
            const translationStep = containerHeight / lettersCount;
            const translation = scrollOffset.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [
                translationStep * (lettersCount - index),
                0,
                -translationStep * index
              ],
              extrapolate: "clamp"
            });
            return {
              transform: [{ translateY: translation }]
            };
          }} />
      );
    };

const renderScoreTitleWidget =
  (itemWidth: number, scrollY: Animated.Value, props?: Partial<ScoreTitleComponentProps>) =>
    ({ item, index }: ListRenderItemInfo<ScoreData>) => {
      const scrollOffset = scrollY.interpolate({
        inputRange: [
          (index - 1) * itemWidth,
          index * itemWidth,
          (index + 1) * itemWidth
        ],
        outputRange: [-1, 0, 1],
        extrapolate: "clamp"
      });
      return (
        <ScoreTitleComponent
          {...props}
          selfSize={itemWidth}
          index={index}
          scrollOffset={scrollOffset}
          data={item as ScoreData} />
      );
    };

export interface ScoreWidgetProps {
  data?: ScoreData[];
  style?: StyleProp<ViewProps>;
  titleWidth?: number;
  scoreHeight?: number;
  scoreTextWidgetProps?: Partial<ScoreTextComponentProps>;
  scoreContainerStyle?: ViewStyle;
  indicatorProps?: Partial<PageIndicatorProps>;
  titleProps?: Pick<ScoreTitleComponentProps, "containerStyle" | "textStyle">;
}

export const ScoreWidget = (props: ScoreWidgetProps) => {
  const {
    data,
    indicatorProps,
    scoreContainerStyle,
    scoreHeight,
    titleWidth,
    scoreTextWidgetProps,
    titleProps,
  } = props;
  if (data == null) {
    return <></>;
  }
  const width = Math.round(Dimensions.get("window").width);
  const itemWidth = titleWidth ?? (width / 3);
  const startOffset = (width - itemWidth) / 2;
  const targetScoreHeight = scoreHeight ?? 80;

  const titlesListRef = React.useRef<FlatList>(null);
  const valuesListRef = React.useRef<FlatList>(null);

  const titlesScrollX = useRef(new Animated.Value(0)).current;
  const scoresScrollY = useRef(new Animated.Value(0)).current;
  const indicatorScroll = useRef(new Animated.Value(0)).current;

  titlesScrollX.addListener((value) => {
    indicatorScroll.setValue(value.value);
    const xOffset = value.value;
    const totalWidth = itemWidth * data.length;
    const scrollPercent = xOffset / totalWidth;
    const totalIndicatorsSize = targetScoreHeight * data.length;
    const scoresScrollOffset = totalIndicatorsSize * scrollPercent;
    valuesListRef.current?.scrollToOffset({ offset: scoresScrollOffset, animated: false });
  });
  const onTitlesScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: titlesScrollX } } }],
    { useNativeDriver: true }
  );
  const onScoresScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scoresScrollY } } }],
    { useNativeDriver: true }
  );

  const itemKeyExtractor = (item: any, index: number) => String(index);

  return (
    <View>
      <Animated.FlatList
        data={data}
        ref={valuesListRef}
        maxToRenderPerBatch={5}
        keyExtractor={itemKeyExtractor}
        style={{
          position: "absolute",
          height: targetScoreHeight,
          left: 0,
          right: 0,
          top: 0,
          ...scoreContainerStyle
        }}
        onScroll={onScoresScroll}
        scrollEnabled={false}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => {
          return { length: targetScoreHeight, offset: targetScoreHeight * index, index };
        }}
        renderItem={renderScoreTextWidget(targetScoreHeight, scoresScrollY, scoreTextWidgetProps)} />
      <Animated.FlatList
        data={data}
        ref={titlesListRef}
        onScroll={onTitlesScroll}
        getItemLayout={(data, index) => {
          return { length: itemWidth, offset: itemWidth * index, index };
        }}
        horizontal={true}
        maxToRenderPerBatch={6}
        disableIntervalMomentum={false}
        keyExtractor={itemKeyExtractor}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        decelerationRate={"fast"}
        overScrollMode={Platform.OS === "ios" ? "auto" : "never"}
        snapToInterval={itemWidth}
        contentContainerStyle={{
          paddingLeft: startOffset,
          paddingRight: startOffset
        }}
        renderItem={renderScoreTitleWidget(itemWidth, titlesScrollX, titleProps)}
      />
      <PageIndicator
        measureSize={itemWidth}
        dotMinSize={8}
        dotMaxSize={24}
        {...indicatorProps}
        pageCount={data.length}
        scrollPosition={indicatorScroll}
        onTap={(index) => {
          titlesListRef.current?.scrollToIndex({ index: index, animated: true });
        }} />
    </View>
  );
};
