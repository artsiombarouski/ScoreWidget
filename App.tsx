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
    </>
  );
};

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested"
]);

export default App;
