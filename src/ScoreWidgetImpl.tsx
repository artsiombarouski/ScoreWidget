/* eslint-disable */

import { ScoreLeft, ScoreRight } from "../assets/images";
import { ScoreWidget } from "./ScoreWidget";
import { tempScoreData } from "./tempData";
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
import { View } from "react-native";
import React from "react";

export const createScoreWidgetImpl = () => {
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
      <ScoreWidget
        data={tempScoreData}
        indicatorProps={{
          color: "white",
          containerStyle: {
            marginTop: 20
          }
        }}
        titleWidth={SCORE_TITLE_CONTAINER_WIDTH}
        scoreHeight={SCORE_TEXT_HEIGHT}
        scoreTextWidgetProps={{
          containerStyle: {
            width: SCORE_TEXT_WIDTH - SCORE_TEXT_PADDING * 2,
            backgroundColor: "transparent"
          },
          textStyle: {
            color: "white",
            fontFamily: "EuclidCircularA-Bold",
            fontSize: 56
          }
        }}
        titleProps={{
          containerStyle: {
            height: 148
          },
          textStyle: {
            maxWidth: SCORE_TITLE_WIDTH,
            color: "white",
            fontFamily: "EuclidCircularA-Bold",
            fontSize: 14
          }
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
