/* eslint-disable */

import React from "react";
import { Animated, LayoutRectangle, PanResponder, View, ViewStyle } from "react-native";

export interface ItemInfo<T> {
  item: T;
  index: number;
  offsetState: Animated.Value | Animated.AnimatedInterpolation;
}

export interface ScoreWidget2Props<T> {
  data?: T[];
  itemWidth: number;
  itemRenderer: (info: ItemInfo<T>) => JSX.Element;
  style?: ViewStyle;
  keyExtractor?: (info: ItemInfo<T>) => string | number | undefined;
}

interface ScoreWidget2State<T> {
  items?: ItemInfo<T>[];
  viewState?: LayoutRectangle;
  alignOffset: number;
}

export class ScoreWidget2<T> extends React.Component<ScoreWidget2Props<T>, ScoreWidget2State<T>> {

  constructor(props: ScoreWidget2Props<T>) {
    super(props);
    this.state = {
      items: props?.data?.map(this._dataToItem),
      alignOffset: 0
    };
  }

  private currentAnim?: Animated.CompositeAnimation = undefined;
  private xScroll = new Animated.Value(0);
  private panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) >= 4,

    onPanResponderGrant: (e, gestureState) => {
      console.log("onPanResponderGrant: " + e.nativeEvent.identifier);
      this.currentAnim?.stop();
      this.xScroll.setOffset((this.xScroll as any)._value);
    },
    onPanResponderMove: Animated.event(
      [null, { dx: this.xScroll }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, gestureState) => {
      console.log("onPanResponderRelease: " + (this.currentAnim == null));
      if (this.currentAnim) {
        return;
      }
      this.xScroll.flattenOffset();
      this.currentAnim?.stop();
      this.currentAnim = undefined;
      const currentValue = (this.xScroll as any)._value;
      const snapPoints = (this.state.items?.map((_, index) => this.props.itemWidth * index)) ?? [];

      console.log("currentValue; " + currentValue);
      if (currentValue > 0) {
        this.currentAnim = Animated.timing(this.xScroll, { toValue: snapPoints[0], useNativeDriver: false });
      } else {
        if (currentValue < -snapPoints[snapPoints.length - 1]) {
          this.currentAnim = Animated.timing(this.xScroll, {
            toValue: -snapPoints[snapPoints.length - 1],
            useNativeDriver: false
          });
        } else {
          console.log("snapPoints: " + snapPoints);
          const absCurrentValue = Math.abs(currentValue);
          const currentOffsetIndex =
            gestureState.dx < 0 || Math.abs(gestureState.dx) <= 50
              ? snapPoints?.findIndex((point) => this._between(absCurrentValue, point, point + this.props.itemWidth))
              : this._findLastIndex(snapPoints, (point) => this._between(absCurrentValue, point - this.props.itemWidth, point));
          console.log("currentOffsetIndex: " + currentOffsetIndex + "/" + gestureState.dx + "/" + absCurrentValue);
          let toValue;
          if (Math.abs(gestureState.dx) <= 50) {
            console.log("nothing");
            toValue = -snapPoints[currentOffsetIndex];
          } else if (gestureState.dx < 50 && currentOffsetIndex < snapPoints.length - 1) {
            console.log("move forward");
            toValue = -snapPoints[currentOffsetIndex + 1];
          } else if (gestureState.dx > 50 && currentOffsetIndex > 0) {
            console.log("move back");
            toValue = -snapPoints[currentOffsetIndex - 1];
          } else {
            console.log("nothing");
            toValue = -snapPoints[currentOffsetIndex];
          }
          console.log("toValue: " + toValue);
          this.currentAnim = Animated.spring(this.xScroll, {
            toValue: toValue,
            useNativeDriver: false,
            velocity: gestureState.vx
          });
        }
      }
      console.log("start anim");
      this.currentAnim?.start((result) => {
        this.currentAnim = undefined;
        console.log("anim: end");
      });
    }
  });

  _findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    let l = array.length;
    while (l--) {
      if (predicate(array[l], l, array))
        return l;
    }
    return -1;
  }

  _between(x: number, min: number, max: number) {
    return x >= min && x <= max;
  }

  componentWillUnmount() {
    this.xScroll.removeAllListeners();
  }

  componentDidUpdate(prevProps: Readonly<ScoreWidget2Props<T>>, prevState: Readonly<ScoreWidget2State<T>>, snapshot?: any) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        items: this.props?.data?.map(this._dataToItem)
      });
    }
  }

  _dataToItem(data: T, index: number): ItemInfo<T> {
    return {
      item: data, index: index, offsetState: new Animated.Value(0)
    };
  }

  private _renderItem =
    (props: ScoreWidget2Props<T>, pan: Animated.Value) =>
      (item: ItemInfo<T>): JSX.Element | undefined => {
        item.offsetState = pan.interpolate({
          inputRange: [
            (item.index - 1) * props.itemWidth,
            item.index * props.itemWidth,
            (item.index + 1) * props.itemWidth
          ],
          outputRange: [-1, 0, 1],
          extrapolate: "clamp"
        });
        return props.itemRenderer?.(item);
      };

  render() {
    const { items, alignOffset } = this.state;
    const { itemWidth } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            flexDirection: "row", transform: [{ translateX: this.xScroll }],
            paddingLeft: alignOffset, paddingRight: alignOffset, flex: 1
          }}
          {...this.panResponder.panHandlers}
          onLayout={({ nativeEvent: { layout } }) => {
            console.log("layout.width - itemWidth: " + layout.width + "/" + itemWidth);
            this.setState({
              viewState: layout,
              alignOffset: Math.max(0, (layout.width - itemWidth) / 2)
            });
          }}
        >
          {items?.map(this._renderItem(this.props, this.xScroll))}
        </Animated.View>
      </View>
    );
  }
}
