/* eslint-disable */

import React from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
  View,
  ViewStyle
} from "react-native";

/**
 * Widget with 'Pure React Native' implementation for displaying scores
 */

const MOVE_THRESHOLD = Platform.OS == "ios" ? 6 : 8;
const SWIPE_THRESHOLD = 10;
const FLING_THRESHOLD = 50;

export interface ItemInfo<T> {
  item: T;
  index: number;
  width: number;
  offsetState: Animated.Value | Animated.AnimatedInterpolation;
}

export interface ScoreWidget2Props<T> {
  data?: T[];
  itemWidth?: number;
  itemRenderer: (info: ItemInfo<T>) => JSX.Element;
  selfRenderer?: (info: ItemInfo<T>, itemOffset: Animated.AnimatedInterpolation) => JSX.Element;
  style?: ViewStyle;
  keyExtractor?: (info: ItemInfo<T>) => string | number | undefined;
  selfRenderContainerStyle?: ViewStyle;
  freeRenderer: (scroll: Animated.AnimatedInterpolation, itemWidth: number) => JSX.Element;
  onScrollStateChanged?: (scrolling: boolean) => void,
}

interface ScoreWidget2State<T> {
  items?: ItemInfo<T>[];
  viewState?: LayoutRectangle;
  alignOffset: number;
}

export class ScoreWidget2<T> extends React.Component<ScoreWidget2Props<T>, ScoreWidget2State<T>> {

  private readonly xScroll = new Animated.Value(0);
  private readonly xSelfScroll = new Animated.Value(0);
  private readonly xFreeScroll = new Animated.Value(0);
  private readonly useNativeDriver = false;
  private readonly panResponder: PanResponderInstance;

  private settleAnimation?: Animated.CompositeAnimation;

  constructor(props: ScoreWidget2Props<T>) {
    super(props);
    const windowWidth = Dimensions.get("window").width;
    this.state = {
      items: props?.data?.map(this._dataToItem),
      viewState: { width: windowWidth, height: 0, x: 0, y: 0 },
      alignOffset:
        props.itemWidth ?
          Math.max(0, (windowWidth - props.itemWidth) / 2) : 0
    };

    this.xScroll.addListener((value) => {
      this.xSelfScroll.setValue(value.value * -1);
      this.xFreeScroll.setValue(value.value * -1);
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (ev, gestureState) => false,
      onStartShouldSetPanResponderCapture: (e, g) => false,
      onMoveShouldSetPanResponder: (ev, gestureState) => Math.abs(gestureState.dx) > MOVE_THRESHOLD,
      onMoveShouldSetPanResponderCapture: (e, g) => Math.abs(g.dx) > MOVE_THRESHOLD,
      onShouldBlockNativeResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderGrant: this._handleScrollStart(this),
      onPanResponderMove: this._handleScroll(this),
      onPanResponderRelease: this._handleScrollRelease(this),
      onPanResponderTerminate: this._handleScrollRelease(this)
    });
  }

  componentWillUnmount() {
    this.xScroll.removeAllListeners();
  }

  componentDidUpdate(prevProps: Readonly<ScoreWidget2Props<T>>, prevState: Readonly<ScoreWidget2State<T>>, snapshot?: any) {
    if (this.props.data !== prevProps.data) {
      this.xScroll.setValue(0);
      if (this.settleAnimation) {
        this.settleAnimation.stop();
        this.settleAnimation = undefined;
      }
      this.setState({
        items: this.props?.data?.map(this._dataToItem)
      });
    }
  }

  private _handleScrollStart = (ref: ScoreWidget2<any>) => (e: GestureResponderEvent, g: PanResponderGestureState) => {
    ref.settleAnimation?.stop();
    const currentValue = (ref.xScroll as any)._value;
    ref.xScroll.setOffset(currentValue);
    ref.xScroll.setValue(0);
    ref.props.onScrollStateChanged?.(true);
  };

  private _handleScroll = (ref: ScoreWidget2<any>) => (e: GestureResponderEvent, g: PanResponderGestureState) => {
    ref._handleScrollUpdate(g.dx);
  };

  private _handleScrollRelease = (ref: ScoreWidget2<any>) => (e: GestureResponderEvent, g: PanResponderGestureState) => {
    if (ref.settleAnimation) {
      return;
    }
    const { itemWidth = ref.state.viewState?.width ?? 0 } = ref.props;

    ref.xScroll.flattenOffset();

    const absDx = Math.abs(g.dx);
    const currentValue = (ref.xScroll as any)._value;
    const snapPoints = (ref.state.items?.map((_, index) => itemWidth * index)) ?? [];

    if (absDx < SWIPE_THRESHOLD) {
      ref._startSpringSettle({
        toValue: currentValue - g.dx,
        useNativeDriver: ref.useNativeDriver
      });
    } else if (currentValue > 0) {
      //We are overscroll
      ref._startSettle({
        toValue: 0,
        useNativeDriver: ref.useNativeDriver
      });
    } else if (currentValue < -snapPoints[snapPoints.length - 1]) {
      ref._startSettle({
        toValue: -snapPoints[snapPoints.length - 1],
        useNativeDriver: ref.useNativeDriver
      });
    } else {
      const absCurrentValue = Math.abs(currentValue);
      let currentOffsetIndex =
        g.dx < 0 || absDx <= 50
          ? snapPoints?.findIndex((point) => ScoreWidget2._between(absCurrentValue, point, point + itemWidth))
          : ScoreWidget2._findLastIndex(snapPoints, (point) => ScoreWidget2._between(absCurrentValue, point - itemWidth, point));
      currentOffsetIndex = Math.max(0, Math.min(currentOffsetIndex, snapPoints.length - 1));
      let toValue;
      if (absDx <= FLING_THRESHOLD) {
        //Move back to current position
        toValue = -snapPoints[currentOffsetIndex];
      } else if (g.dx <= 0 && currentOffsetIndex < snapPoints.length - 1) {
        //Move forward
        toValue = -snapPoints[currentOffsetIndex + 1];
      } else if (g.dx > FLING_THRESHOLD && currentOffsetIndex > 0) {
        //Move back
        toValue = -snapPoints[currentOffsetIndex - 1];
      } else {
        //Move back to current position
        toValue = -snapPoints[currentOffsetIndex];
      }
      ref._startSpringSettle({
        toValue: toValue,
        useNativeDriver: ref.useNativeDriver,
        velocity: g.vx
      });
    }
    ref.props.onScrollStateChanged?.(false);
  };

  private _handleScrollUpdate(value: number) {
    this.xScroll.setValue(value);
  }

  private _startSettle(config: Animated.TimingAnimationConfig) {
    this.settleAnimation = Animated.timing(this.xScroll, config);
    this.settleAnimation.start(() => {
      this.settleAnimation = undefined;
    });
  }

  private _startSpringSettle(config: Animated.SpringAnimationConfig) {
    this.settleAnimation = Animated.spring(this.xScroll, config);
    this.settleAnimation.start(() => {
      this.settleAnimation = undefined;
    });
  }

  private static _findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    let l = array.length;
    while (l--) {
      if (predicate(array[l], l, array))
        return l;
    }
    return -1;
  }

  private static _between(x: number, min: number, max: number) {
    return x >= min && x <= max;
  }

  private _dataToItem(data: T, index: number): ItemInfo<T> {
    return {
      item: data, index: index, width: 0, offsetState: new Animated.Value(0)
    };
  }

  private _renderItem =
    (props: ScoreWidget2Props<T>, scroll: Animated.Value, optimizedScroll: Animated.Value, itemWidth: number) =>
      (item: ItemInfo<T>): JSX.Element | undefined => {

        const targetPosition = item.index * itemWidth + this.state.alignOffset;
        const translation = Animated.add(scroll, targetPosition);

        item.width = itemWidth;
        item.offsetState = optimizedScroll.interpolate({
          inputRange: [
            itemWidth * (item.index - 1),
            itemWidth * item.index,
            itemWidth * (item.index + 1)
          ],
          outputRange: [-1, 0, 1],
          extrapolate: "clamp"
        });
        return (
          <Animated.View
            key={props.keyExtractor?.(item)}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: itemWidth,
              alignSelf: "center",
              transform: [{
                translateX: translation
              }],
              alignItems: "center",
              justifyContent: "center"
            }}>
            {props.itemRenderer?.(item)}
          </Animated.View>
        );
      };

  private _renderSelfItem =
    (props: ScoreWidget2Props<T>, scroll: Animated.AnimatedInterpolation, itemWidth: number) =>
      (item: ItemInfo<T>): JSX.Element | undefined => {
        const offset = scroll.interpolate({
          inputRange: [
            itemWidth * (item.index - 1),
            itemWidth * item.index,
            itemWidth * (item.index + 1)
          ],
          outputRange: [-1, 0, 1],
          extrapolate: "clamp"
        });
        return (
          <View
            key={props.keyExtractor?.(item)}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
            {props.selfRenderer?.(item, offset)}
          </View>
        );
      };

  private _handleLayoutEvent = (itemWidth: number) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    const targetItemWidth = itemWidth ?? layout.width;
    this.setState({
      viewState: layout,
      alignOffset: Math.max(0, (layout.width - targetItemWidth) / 2)
    });
  };

  render() {
    const { items, viewState } = this.state;
    const {
      itemWidth = viewState?.width ?? 0,
      style,
      selfRenderContainerStyle
    } = this.props;

    return (
      <View
        style={{ ...style }}
        {...this.panResponder.panHandlers}>
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row"
          }}
          onLayout={this._handleLayoutEvent(itemWidth)}>
          {
            this.props.itemRenderer &&
            items?.map(this._renderItem(this.props, this.xScroll, this.xSelfScroll, itemWidth))
          }
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            ...selfRenderContainerStyle
          }}
          pointerEvents={"none"}>
          {
            viewState &&
            this.props.selfRenderer &&
            items?.map(this._renderSelfItem(this.props, this.xSelfScroll, itemWidth))
          }
        </Animated.View>
        {viewState && this.props.freeRenderer?.(this.xFreeScroll, itemWidth)}
      </View>
    );
  }
}
