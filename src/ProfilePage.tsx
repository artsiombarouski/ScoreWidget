/* eslint-disable */

import React from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { AllScenes, ArrowRight, ContactUs, Invite, Join, Like, Settings } from "../assets/images";
import { appBarTheme, appColors, appTheme, optionsTheme } from "./styles";
import { createScoreWidget2Impl } from "./ScoreWidget2Impl";
import { createScoreWidgetImpl } from "./ScoreWidgetImpl";

/**
 * Options components
 */

interface OptionRowProps {
  title: string;
  icon: JSX.Element;
}

const OptionRow = ({ title, icon }: OptionRowProps) => {
  return (
    <TouchableOpacity>
      <View style={optionsTheme.container}>
        {icon}
        <Text style={optionsTheme.title}>{title}</Text>
        <ArrowRight />
      </View>
    </TouchableOpacity>
  );
};

/**
 * Appbar component
 */
interface AppBarProps {
  title?: JSX.Element;
}

const AppBar = ({ title }: AppBarProps) => {
  return (
    <View style={{
      ...appBarTheme.container
    }}>
      {title}
    </View>
  );
};

const PlusComponent = (style?: TextStyle) => {
  return (
    <Text style={{
      fontSize: 14,
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 4,
      paddingTop: 4,
      borderRadius: 6,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      fontFamily: "EuclidCircularA-Bold",
      textTransform: "uppercase",
      position: "relative",
      bottom: 0,
      color: "white",
      overflow: "hidden",
      textAlign: "center",
      ...style
    }}>
      Plus
    </Text>
  );
};

/**
 * Greeting header component
 */

interface GreetingComponentProps {
  style?: ViewStyle;
  userName?: string;
}

const GreetingComponent = ({ userName, style }: GreetingComponentProps) => {
  return (
    <View style={{
      ...appBarTheme.container, ...style
    }}>
      <Text style={{ ...appBarTheme.title, marginRight: 8 }}>
        Hi {userName}
      </Text>
      <PlusComponent />
    </View>
  );
};

/**
 * Upgrade component
 */

const UpgradeComponent = () => {
  return (
    <View style={{
      ...appBarTheme.container,
      padding: 16,
      backgroundColor: "rgba(128, 45, 246, 0.2)",
      margin: 20,
      borderRadius: 12,
      borderColor: "#802DF6",
      borderWidth: 2
    }}>
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          overflow: "hidden",
          alignItems: "center"
        }}>
          <Text
            style={{
              ...appBarTheme.title,
              fontSize: 24,
              textTransform: "uppercase",
              marginRight: 8,
              flex: 1
            }}
            numberOfLines={1} adjustsFontSizeToFit={true}>
            Upgrade to
          </Text>
          <PlusComponent backgroundColor={appColors.secondary} flex={0} />
        </View>
        <Text style={{ ...appTheme.baseTextStyle, opacity: 0.8, marginTop: 8 }}>
          Experience full loóna effect each night! Unlock all exclusive content.
        </Text>
      </View>
      <TouchableOpacity style={{
        ...appTheme.button,
        marginLeft: 16,
        borderRadius: 24
      }}>
        <Text style={{
          ...appTheme.buttonText,
          fontSize: 20,
          marginLeft: 12,
          marginRight: 12
        }}>update</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Headline
 */

const Headline = (props: { value?: string }) => {
  return (
    <Text style={{
      ...appTheme.headlineTextStyle, paddingHorizontal: 20, paddingVertical: 12, textAlign: "center"
    }}>{props.value}</Text>
  );
};

/**
 * Profile page
 */

export interface ProfilePageProps {
}

export const ProfilePage = (props: ProfilePageProps) => {
  return (
    <SafeAreaView style={{
      ...appTheme.rootPage,
      paddingTop: StatusBar.currentHeight
    }}>
      <ScrollView>
        <AppBar title={
          <Text style={appBarTheme.title}>
            <Text style={{ color: appColors.primary }}>my</Text>
            <Text> loóna</Text>
          </Text>
        } />
        <GreetingComponent userName={"Andrew"} />
        <UpgradeComponent />
        <Headline value={"Example with FlatList"} />
        {createScoreWidgetImpl()}
        <Headline value={"Example with pure React Native"} />
        {createScoreWidget2Impl()}
        <OptionRow icon={<Like style={optionsTheme.icon} />} title={"Favourite"} />
        <OptionRow icon={<AllScenes style={optionsTheme.icon} />} title={"All scenes"} />
        <OptionRow icon={<Join style={optionsTheme.icon} />} title={"Join loóna family"} />
        <OptionRow icon={<Invite style={optionsTheme.icon} />} title={"Invite your friend"} />
        <OptionRow icon={<ContactUs style={optionsTheme.icon} />} title={"Contact us"} />
        <OptionRow icon={<Settings style={optionsTheme.icon} />} title={"Settings"} />
      </ScrollView>
    </SafeAreaView>
  );
};
