import React, { useRef } from 'react';
import cx from 'classnames';
import matchSorter from 'match-sorter';
import { get } from 'lodash';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import Downshift from 'downshift';

import ClearIcon from './ic-deassign.svg';

import { BodyText } from './Text';

// Limit value of the dataSource when being fetched from the API
const scrollableMaxResults = 250;

function Menu({ downshiftProps, ...props }) {
  const {
    classes,
    dataSource,
    dataSourceConfig,
    maxSearchResults,
    scrollable
  } = props;

  const searchResults = scrollable ? scrollableMaxResults : maxSearchResults;

  const {
    getItemProps,
    getMenuProps,
    isOpen,
    inputValue,
    selectedItem,
    highlightedIndex
  } = downshiftProps;

  let items = matchSorter(dataSource, inputValue, {
    keys: [dataSourceConfig.text]
  }).slice(0, searchResults);
  items = items.map((item, index) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = item === selectedItem;
    const props = {
      ...getItemProps({ item }),
      key: index,
      selected: isHighlighted
    };

    return (
      <MenuItem {...props}>
        <BodyText
          className={cx(isSelected && classes.selectedItem, classes.bodyText)}
        >
          {get(item, dataSourceConfig.text)}
        </BodyText>
      </MenuItem>
    );
  });

  // TODO Doesn't align with edges of TextField. Azure Active Directory Locks AutoComplete

  // TODO Doesn't automatically shrink width if the scrollbar appears due to Popper menu. It
  // resizes after first items hovered or selected. happens because the width of the TextField
  // decreases. Reproducible on Scratch.

  const popperNode = props.popperRef.current;
  const paperStyle = {
    width: popperNode ? popperNode.clientWidth : null,
    // Restricting the height to display max 10 items during the scroll
    maxHeight: scrollable ? 460 : null,
    overflowY: scrollable ? 'auto' : 'hidden',
    // If the menu is at the end of the page, the bottom of the menu touches
    // end of the screen, it seems as though some items have been sliced, this
    // give a space between bottom of the menu to end of the screen.
    marginBottom: 20
  };

  return (
    <Popper
      open={isOpen}
      anchorEl={popperNode}
      placement="bottom"
      modifiers={{
        flip: { enabled: false },
        hide: { enabled: false },
        preventOverflow: { enabled: false }
      }}
      className={classes.popper}
    >
      <div {...(isOpen ? getMenuProps({}, { suppressRefError: true }) : {})}>
        <Paper square style={paperStyle}>
          {items}
        </Paper>
      </div>
    </Popper>
  );
}

function Field({ downshiftProps, ...props }) {
  const {
    classes,
    // This prop applies formControl style to the TextField if it is true
    search,
    clear,
    popperRef,
    onChange,
    TextFieldProps
  } = props;

  const {
    clearSelection,
    inputValue,
    getInputProps,
    openMenu
  } = downshiftProps;

  const clearInputAdornment = (
    <InputAdornment position="end">
      <IconButton
        className={classes.icon}
        onClick={() => clearSelection(() => onChange(undefined))}
      >
        <img src={ClearIcon} alt="clear" />
      </IconButton>
    </InputAdornment>
  );

  const textFieldProps = {
    className: search === true ? classes.search : '',
    ...TextFieldProps,
    InputProps: {
      ...TextFieldProps.InputProps,
      ...getInputProps({ onFocus: openMenu }),
      inputRef: popperRef,
      endAdornment: clear && inputValue !== '' ? clearInputAdornment : undefined
    }
  };

  return <TextField {...textFieldProps} />;
}

const defaultItem = {};

const autoCompleteStyles = {
  // Overrides for FormControl has been defined in the theme.js file, since
  // the minHeight defined there is 80px, its breaking the search field styles,
  // this particular override will fix it
  search: {
    minHeight: 50,
    justifyContent: 'center'
  },
  selectedItem: { fontWeight: 500 },

  popper: { zIndex: 1500 },

  container: { position: 'relative' },

  // HACK When AutoComplete is used in CardSearch because of display: flex, fullWidth prop on TextField doesn't
  // work because width 100% is not present on this AutoComplete container hence we need to add it.
  fullWidthContainer: {
    position: 'relative',
    width: '100%'
  },
  icon: {
    // This is to keep the bottom and right spaces of the icon consistent
    paddingRight: 5,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },

  paper: {
    position: 'absolute',
    // The zIndex needs to be atleast 3 because the sliders have zIndex of 2 and if there is a
    // Slider below AutoComplete it will show on the AutoComplete popup
    zIndex: 3,
    // This constraints the AutoComplete popup just to the dimensions of the TextField together
    // with position: relative
    left: 0,
    right: 0
  },
  // Make long menu item text in the dropdown to trim and add ellipsis.
  bodyText: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
};

/**
 * @name: AutoComplete
 * @description: The autocomplete is a normal text input enhanced by a panel of suggested options.
 *
 * @param {string[] | Object[]} dataSource: List of items that can be autocompleted
 * @param {Object} [dataSourceConfig]: if dataSource is list of string, this
 * should be empty. Otherwise if dataSource is list of object, then dataSourceConfig
 * configures display of item and React key for the item
 * @param {string} [dataSourceConfig.value]: the field of item that should be
 * used as React Key
 * @param {string} [dataSourceConfig.text]: the field of item that's used item text
 * @param {number} [maxSearchResults = 10]: maximum number of items show in
 * autocomplete popup
 * @param {Object => string} [onChange]: called when user selects a new item
 * @param {Object => string} [onInputChange]: called when user changes the input field
 * @param {Object} [TextFieldProps]: same props as material-ui TextFieldProps
 * @param [Object] [defaultSelectedItem]: pass an item that should be selected
 * by default.
 * @param {Boolean} [clear]: Condition to show clear current selected item option
 *
 */

function AutoComplete(props) {
  const popperRef = useRef();

  const {
    classes,
    TextFieldProps,
    dataSourceConfig,
    // TODO change prop to initialSelectedItem
    defaultSelectedItem,
    variant = 'default',
    value,
    onChange,
    onInputChange
  } = props;

  // Here empty strings are necessary because when user presses Escape key the Downshift tries to
  // render the selectedItem and user has not selected any item yet, itemToString recieves null.
  const itemToString = item => get(item, dataSourceConfig.text) || '';

  let _props;
  if (variant === 'next') {
    // Avoids uncontrolled warning when AutoComplete is not selected or touched
    _props = { selectedItem: value || defaultItem };
  } else {
    _props = { initialSelectedItem: defaultSelectedItem };
  }

  return (
    <Downshift
      onChange={onChange}
      onInputValueChange={onInputChange}
      itemToString={itemToString}
      {..._props}
    >
      {downshiftProps => (
        <div
          className={
            // We are defaulting to fullWidthContainer unless fullWidth is false since after fullWidth: true override
            // TextFieldProps.fullWidth: true can be removed and this would not break silently.
            TextFieldProps.fullWidth !== false
              ? classes.fullWidthContainer
              : classes.container
          }
        >
          <Field
            downshiftProps={downshiftProps}
            popperRef={popperRef}
            {...props}
          />
          <Menu
            downshiftProps={downshiftProps}
            popperRef={popperRef}
            {...props}
          />
        </div>
      )}
    </Downshift>
  );
}

AutoComplete.defaultProps = {
  maxSearchResults: 5,
  onChange: () => {}
};

export default withStyles(autoCompleteStyles)(AutoComplete);
