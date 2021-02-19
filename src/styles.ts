/* eslint-disable */

import { StyleSheet } from "react-native";

export const appColors = {
  primary: "#D295FF",
  secondary: "#802DF6",
  background: "#090110"
};

export const appTheme = StyleSheet.create({
  rootPage: {
    backgroundColor: appColors.background,
    flex: 1
  },
  baseTextStyle: {
    fontFamily: "EuclidCircularA-Regular",
    color: "white"
  },
  headlineTextStyle: {
    fontFamily: "EuclidCircularA-Semibold",
    color: "white",
    fontSize: 20,
  },
  button: {
    backgroundColor: appColors.secondary,
    borderRadius: 16,
    padding: 8,
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontFamily: "EuclidCircularA-Bold",
    color: "white",
    textTransform: "uppercase"
  }
});

export const appBarTheme = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    ...appTheme.baseTextStyle,
    fontSize: 34,
    fontFamily: "EuclidCircularA-Semibold"
  }
});

export const optionsTheme = StyleSheet.create({
  container: {
    minHeight: 64,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginLeft: 0,
    marginRight: 16
  },
  title: {
    ...appTheme.baseTextStyle,
    fontSize: 20,
    fontWeight: "500",
    flex: 1
  }
});

export const SCORE_TEXT_WIDTH = 128;
export const SCORE_TEXT_PADDING = 12;
export const SCORE_TEXT_HEIGHT = 100;

export const SCORE_TITLE_CONTAINER_WIDTH = SCORE_TEXT_WIDTH + 60;
export const SCORE_TITLE_WIDTH = SCORE_TEXT_WIDTH + 20;
export const SCORE_VERTICAL_FADING_EDGE_WIDTH = SCORE_TEXT_WIDTH - SCORE_TEXT_PADDING;
