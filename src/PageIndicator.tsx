/* eslint-disable */

import React from "react";
import { Animated, ColorValue, StyleSheet, TouchableOpacity, useWindowDimensions, View, ViewStyle } from "react-native";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface PageIndicatorProps {
  pageCount: number;
  dotMinSize?: number;
  dotMaxSize?: number;
  color?: ColorValue;
  onTap?: (index: number) => void;
  scrollPosition: Animated.AnimatedInterpolation;
  measureSize?: number;
  containerStyle?: ViewStyle;
}

export interface PageIndicatorState {
}

export class PageIndicator extends React.Component<PageIndicatorProps, PageIndicatorState> {

  constructor(props: PageIndicatorProps) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps: Readonly<PageIndicatorProps>, nextState: Readonly<PageIndicatorState>, nextContext: any): boolean {
    return nextProps.pageCount != this.props.pageCount;
  }

  render() {
    const {
      pageCount,
      scrollPosition,
      dotMinSize = 10,
      dotMaxSize = 20,
      color = "red",
      measureSize,
      onTap,
      containerStyle
    } = this.props;
    const targetWidth = measureSize ?? useWindowDimensions().width;
    const dotsElements = Array<JSX.Element>(pageCount);
    for (let index = 0; index < pageCount; index++) {
      const sizeInterpolation = scrollPosition.interpolate({
        inputRange: [(index - 1) * targetWidth, index * targetWidth, (index + 1) * targetWidth],
        outputRange: [dotMinSize, dotMaxSize, dotMinSize],
        extrapolate: "clamp"
      });
      const opacityInterpolation = scrollPosition.interpolate({
        inputRange: [(index - 1) * targetWidth, index * targetWidth, (index + 1) * targetWidth],
        outputRange: [0.5, 1.0, 0.5],
        extrapolate: "clamp"
      });
      dotsElements[index] = (
        <AnimatedTouchable
          key={index}
          onPress={() => onTap?.(index)}
          style={{
            height: dotMinSize,
            width: sizeInterpolation,
            borderRadius: dotMinSize / 2,
            marginHorizontal: dotMinSize / 2,
            backgroundColor: color,
            opacity: opacityInterpolation
          }} />
      );
    }
    return (
      <View>
        <View style={{ ...pageIndicatorStyle.container, ...containerStyle }}>
          {dotsElements}
        </View>
      </View>
    );
  }
}

const pageIndicatorStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});
