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
