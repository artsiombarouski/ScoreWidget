/* eslint-disable */

import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { ViewStyle } from "react-native";

export interface FadingEdgesProps {
  color?: string;
  leftStyle?: ViewStyle;
  topStyle?: ViewStyle;
  rightStyle?: ViewStyle;
  bottomStyle?: ViewStyle;
}

export const FadingEdges = (props: FadingEdgesProps) => {
  const targetFadingEdgeColor = props.color ?? "#00000000";

  return (
    <>
      <LinearGradient
        pointerEvents={"none"}
        angle={90}
        useAngle={true}
        colors={[targetFadingEdgeColor, "#00000000"]}
        locations={[0.2, 0.9]}
        style={{
          width: 80, position: "absolute", left: 0, top: 0, bottom: 0,
          ...props.leftStyle
        }} />
      <LinearGradient
        pointerEvents={"none"}
        angle={180}
        useAngle={true}
        colors={[targetFadingEdgeColor, "#00000000"]}
        locations={[0.2, 0.9]}
        style={{
          height: 30, position: "absolute", left: 0, top: 0, right: 0, alignSelf: "center",
          ...props.topStyle
        }} />
      <LinearGradient
        pointerEvents={"none"}
        angle={270}
        useAngle={true}
        colors={[targetFadingEdgeColor, "#00000000"]}
        locations={[0.2, 0.9]}
        style={{
          width: 80, position: "absolute", right: 0, top: 0, bottom: 0,
          ...props.rightStyle
        }} />
      <LinearGradient
        pointerEvents={"none"}
        angle={0}
        useAngle={true}
        colors={[targetFadingEdgeColor, "#00000000"]}
        locations={[0.2, 0.9]}
        style={{
          height: 30, position: "absolute", left: 0, bottom: 0, right: 0, alignSelf: "center",
          ...props.bottomStyle
        }} />
    </>
  );
};
