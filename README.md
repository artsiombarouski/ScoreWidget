## About project

Small project for demonstrate implementation of "Rolling Score" width using React Native only (without any ready 3rd party libraries). Dependent only on 'react-native-linear-gradient' for implement shadows and 'react-native-svg' for icons which are displayed in dummy UI and don't actually.

Solution demonstrates two variants of implementation: 
- [FlatList](src/ScoreWidget.tsx#L21) (preferred because it's support 'useNativeDriver' in animations and good at dynamic items updating, and also have good native recycling logic support)
- [Pure React Native](src/ScoreWidget2.tsx#L19) (demonstrates implementation by using React Native regular components only, can be significantly improved if we will use few libraries for proper gestures handling and communicate with a native layer)
