/* eslint-disable */

import React from "react";
import { LogBox, StatusBar } from "react-native";
import { ProfilePage } from "./src/ProfilePage";

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="rgba(0,0,0,0)" />
      <ProfilePage />
      {/*<View style={{flex: 1}}>*/}
      {/*  <ScoreWidget2<ScoreData>*/}
      {/*    data={tempScoreData}*/}
      {/*    itemWidth={200}*/}
      {/*    itemRenderer={({ item, index, offsetState }) => {*/}
      {/*    return <ScoreTitleComponent data={item} selfSize={200} index={index}*/}
      {/*                                scrollOffset={offsetState} containerStyle={{height: 300}} />;*/}
      {/*  }} />*/}
      {/*</View>*/}
    </>
  );
};

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested" // TODO: Remove when fixed
]);

export default App;
