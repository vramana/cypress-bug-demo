import React from 'react';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';

export const fontFamily = '"Poppins", sans-serif';

const kisiPalette = {
  kisiBlue: '#3387FF',
  kisiNavyBlue: '#115082',
  kisiDarkBlue: '#09283D',
  kisiPurple: '#6786F0',

  kisiWhite: '#FFFFFF',
  kisiCoolWhite: '#F7F9FF',

  kisiRed: '#ED243D',
  kisiGrapeRed: '#85004F',

  kisiGreen: '#27ce8b',
  kisiDeepGreen: 'rgb(130, 180, 0)',

  kisiLightGrey: '#F0F0F0',
  kisiLightGrey40: 'rgba(240, 240, 240, 0.4)',
  kisiLightGrey30: 'rgba(240, 240, 240, 0.3)',
  kisiSteelGrey: '#8C94A9',
  kisiWarmGrey: '#7F7F7F',
  kisiWarmGrey30: 'rgba(127, 127, 127, 0.3)',
  kisiWarmGrey50: 'rgba(127, 127, 127, 0.5)',
  kisiDarkGrey: '#404040',

  kisiBlack: '#000000',

  // The following colors are not present in the Zeplin style guide, but still
  // present in the designs
  kisiBlueyGrey: '#8c94aa',
  kisiOrange: 'rgb(255, 153, 40)',
  kisiYellow: 'rgb(255, 205, 49)'
};

const { kisiDarkGrey } = kisiPalette;

const bodyTextStyle = {
  text: {
    color: kisiDarkGrey,
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.71,
    letterSpacing: 0.2
  }
};

function _BodyText({ children, classes, className, variant, color }) {
  const style = {};
  if (variant === 'bold') {
    style.fontWeight = 700;
  }
  // @Cleanup after User/Header is removed
  if (variant === 'light-bold') {
    style.fontWeight = 500;
  }

  if (color) {
    style.color = color;
  }

  return (
    <div className={cx(classes.text, className)} style={style}>
      {children}
    </div>
  );
}

export const BodyText = withStyles(bodyTextStyle)(_BodyText);
