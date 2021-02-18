/* eslint-disable */

import { Animated, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React from "react";

export interface ScoreTextComponentProps {
  value: string;
  containerStyle?: ViewStyle;
  textStyle?: StyleProp<TextStyle>;
  letterTransform?: (letterIndex: number, lettersCount: number, containerHeight: number) => any;
}

interface ScoreTextComponentState {
  containerHeight: number;
  letters: string[];
}

export class ScoreTextComponent extends React.Component<ScoreTextComponentProps, ScoreTextComponentState> {

  constructor(props: ScoreTextComponentProps) {
    super(props);
    this.state = {
      containerHeight: 0,
      letters: props.value.split("")
    };
  }

  shouldComponentUpdate(
    nextProps: Readonly<ScoreTextComponentProps>,
    nextState: Readonly<ScoreTextComponentState>, nextContext: any
  ): boolean {
    return nextProps.textStyle !== this.props.textStyle ||
      nextProps.value !== this.props.value ||
      nextState.containerHeight !== this.state.containerHeight;
  }

  private _renderLetter = (
    props: ScoreTextComponentProps,
    state: ScoreTextComponentState
  ) => (letter: string, index: number) => {
    return (
      <Animated.Text
        key={letter + index}
        style={{
          ...(props.textStyle as {}),
          ...scoreTextWidgetStyle.textStyle,
          marginLeft: index == 0 ? 0 : "-100%",
          textAlign: "center",
          ...props.letterTransform?.(index, state.letters.length, state.containerHeight)
        }}
        textBreakStrategy={"simple"}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.01}
        numberOfLines={1}>
        <Text style={scoreTextWidgetStyle.hiddenTextStyle}>
          {props.value.substring(0, index)}
        </Text>
        <Text>
          {letter}
        </Text>
        <Text style={scoreTextWidgetStyle.hiddenTextStyle}>
          {props.value.substring(index + 1)}
        </Text>
      </Animated.Text>
    );
  };

  render() {
    const { letters } = this.state;
    const { containerStyle } = this.props;
    return (
      <View
        style={{
          ...(containerStyle as {}),
          ...scoreTextWidgetStyle.container
        }}
        onLayout={({ nativeEvent: { layout: { height } } }) => {
          this.setState({ containerHeight: height });
        }}>
        {letters.map(this._renderLetter(this.props, this.state))}
      </View>
    );
  }
}

const scoreTextWidgetStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexShrink: 1
  },
  textStyle: {
    flex: 1,
    flexWrap: "nowrap"
  },
  hiddenTextStyle: {
    color: "transparent"
  }
});