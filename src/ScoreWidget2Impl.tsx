/* eslint-disable */

import { ScoreLeft, ScoreRight } from "../assets/images";
import { ItemInfo, ScoreWidget2, ScoreWidget2Props } from "./ScoreWidget2";
import { ScoreData, tempScoreData } from "./tempData";
import { ScoreTitleComponent } from "./ScoreTitleComponent";
import { ScoreTextComponent } from "./ScoreTextComponent";
import { PageIndicator } from "./PageIndicator";
import { FadingEdges } from "./FadingEdges";
import {
  appColors,
  SCORE_TEXT_HEIGHT,
  SCORE_TEXT_PADDING,
  SCORE_TEXT_WIDTH,
  SCORE_TITLE_CONTAINER_WIDTH,
  SCORE_TITLE_WIDTH,
  SCORE_VERTICAL_FADING_EDGE_WIDTH
} from "./styles";
import { Animated, View } from "react-native";
import React from "react";

const renderScoreTextWidget = ({ item, index, offsetState, width }: ItemInfo<ScoreData>) => {
  return (
    <ScoreTitleComponent
      data={item}
      index={index}
      selfSize={width}
      scrollOffset={offsetState}
      containerStyle={{ height: 148 }}
      textStyle={{
        maxWidth: SCORE_TITLE_WIDTH,
        color: "white",
        fontFamily: "EuclidCircularA-Bold",
        fontSize: 14
      }} />
  );
};

const renderScoreTitleWidget = (item: ItemInfo<ScoreData>, itemOffset: Animated.AnimatedInterpolation) => {
  return (
    <ScoreTextComponent
      value={item.item.value ?? ""}
      containerStyle={{
        width: SCORE_TEXT_WIDTH - SCORE_TEXT_PADDING * 2,
        height: SCORE_TEXT_HEIGHT,
        alignItems: "center"
      }}
      textStyle={{
        color: "white",
        fontFamily: "EuclidCircularA-Bold",
        fontSize: 56
      }}
      letterTransform={(index, lettersCount, containerHeight) => {
        const targetContainerHeight = containerHeight != 0 ? containerHeight : SCORE_TEXT_HEIGHT;
        const translationStep = targetContainerHeight / lettersCount;
        const translation = itemOffset.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [
            targetContainerHeight + (translationStep * (lettersCount - index)),
            0,
            -targetContainerHeight - (translationStep * index)
          ],
          extrapolate: "clamp"
        });
        return {
          transform: [{ translateY: translation }]
        };
      }}
    />
  );
};

export const createScoreWidget2Impl = (widgetProps?: Partial<ScoreWidget2Props<any>>) => {
  return (
    <View style={{ marginTop: 16, marginBottom: 20 }}>
      <ScoreLeft style={{
        position: "absolute",
        transform: [{ translateX: -SCORE_TEXT_WIDTH / 2 }],
        right: "50%"
      }} />
      <ScoreRight style={{
        position: "absolute",
        left: "50%",
        transform: [{ translateX: SCORE_TEXT_WIDTH / 2 }]
      }} />
      <ScoreWidget2<ScoreData>
        {...widgetProps}
        data={tempScoreData}
        style={{ height: 168 }}
        keyExtractor={(item) => item.index}
        itemWidth={SCORE_TITLE_CONTAINER_WIDTH}
        itemRenderer={renderScoreTextWidget}
        selfRenderContainerStyle={{
          alignSelf: "center",
          overflow: "hidden",
          height: SCORE_TEXT_HEIGHT,
          width: SCORE_TEXT_WIDTH - SCORE_TEXT_PADDING * 2
        }}
        selfRenderer={renderScoreTitleWidget}
        freeRenderer={(scroll, itemWidth) => {
          return (
            <PageIndicator
              measureSize={itemWidth}
              dotMinSize={8}
              dotMaxSize={24}
              color="white"
              containerStyle={{ marginTop: 20 }}
              pageCount={tempScoreData.length}
              scrollPosition={scroll}
            />
          );
        }} />
      <FadingEdges
        color={appColors.background}
        topStyle={{
          width: SCORE_VERTICAL_FADING_EDGE_WIDTH,
          left: undefined,
          right: undefined
        }}
        bottomStyle={{
          width: SCORE_VERTICAL_FADING_EDGE_WIDTH,
          left: undefined,
          right: undefined,
          bottom: undefined,
          top: SCORE_TEXT_HEIGHT - 30
        }} />
    </View>
  );
};
