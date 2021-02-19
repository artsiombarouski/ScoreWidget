/* eslint-disable */

import { ScoreData } from "./tempData";
import { Animated, TextStyle, View, ViewStyle } from "react-native";
import React from "react";

/**
 * Component for display 'ScoreData' title
 */

export interface ScoreTitleComponentProps {
  data: ScoreData;
  selfSize: number;
  index: number;
  scrollOffset: Animated.AnimatedInterpolation;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

interface ScoreTitleState {
  layoutWidth?: number;
  textWidth?: number;
}

export class ScoreTitleComponent extends React.Component<ScoreTitleComponentProps, ScoreTitleState> {
  constructor(props: ScoreTitleComponentProps) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(
    nextProps: Readonly<ScoreTitleComponentProps>,
    nextState: Readonly<ScoreTitleState>
  ): boolean {
    return nextProps.data !== this.props.data ||
      nextState.layoutWidth !== this.state.layoutWidth ||
      nextState.textWidth !== this.state.layoutWidth;
  }

  render() {
    const { layoutWidth = 0, textWidth = 0 } = this.state;
    const { data, selfSize, scrollOffset, containerStyle, textStyle } = this.props;
    const layoutDiff = layoutWidth - textWidth;
    const alignmentTransition = scrollOffset.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-layoutDiff / 2, 0, layoutDiff / 2],
      extrapolate: "clamp"
    });
    return (
      <View style={{
        alignItems: "center",
        justifyContent: "flex-end",
        width: selfSize,
        overflow: "hidden",
        ...containerStyle
      }} onLayout={({ nativeEvent: { layout: { width } } }) => {
        this.setState({ layoutWidth: width });
      }}>
        <Animated.Text
          onLayout={({ nativeEvent: { layout: { width } } }) => {
            this.setState({ textWidth: width });
          }}
          style={{
            textAlign: "center", ...textStyle, transform: [{
              translateX: alignmentTransition
            }]
          }}
          numberOfLines={2}>
          {data.title}
        </Animated.Text>
      </View>
    );
  }
}
