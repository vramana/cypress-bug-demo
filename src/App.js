import React, { useRef } from "react";
import matchSorter from "match-sorter";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import Downshift from "downshift";
import MenuItem from "@material-ui/core/MenuItem";

const BodyText = ({ children }) => children;

const styles = {
  container: {
    marginLeft: "300px"
  },
  popper: {
    zIndex: 1500
  }
};

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
    highlightedIndex
  } = downshiftProps;

  let items = matchSorter(dataSource, inputValue, {
    keys: [dataSourceConfig.text]
  }).slice(0, searchResults);
  items = items.map((item, index) => {
    const isHighlighted = highlightedIndex === index;
    const props = {
      ...getItemProps({ item }),
      key: index,
      selected: isHighlighted
    };

    return (
      <MenuItem {...props}>
        <BodyText>{item[dataSourceConfig.text]}</BodyText>
      </MenuItem>
    );
  });

  const popperNode = props.popperRef.current;

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
      data-test-id="autoCompleteMenu"
    >
      <div {...(isOpen ? getMenuProps({}, { suppressRefError: true }) : {})}>
        <Paper square>{items}</Paper>
      </div>
    </Popper>
  );
}

function Field({ downshiftProps, ...props }) {
  const { classes, search, clear, popperRef, TextFieldProps } = props;

  const { inputValue, getInputProps, openMenu } = downshiftProps;

  const clearInputAdornment = null;

  const textFieldProps = {
    className: search === true ? classes.search : "",
    ...TextFieldProps,
    InputProps: {
      ...TextFieldProps.InputProps,
      ...getInputProps({ onFocus: openMenu }),
      inputRef: popperRef,
      endAdornment: clear && inputValue !== "" ? clearInputAdornment : undefined
    }
  };

  return <TextField {...textFieldProps} />;
}

const defaultItem = {};

const autoCompleteStyles = {
  search: {
    minHeight: 50,
    justifyContent: "center"
  },
  selectedItem: { fontWeight: 500 },

  popper: { zIndex: 1500 },

  container: { position: "relative" },

  fullWidthContainer: {
    position: "relative",
    width: "100%"
  },
  icon: {
    paddingRight: 5,
    "&:hover": {
      backgroundColor: "transparent"
    }
  },

  paper: {
    position: "absolute",
    zIndex: 3,
    left: 0,
    right: 0
  },
  bodyText: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  }
};

function _AutoComplete(props) {
  const popperRef = useRef();

  const {
    classes,
    TextFieldProps,
    dataSourceConfig,
    defaultSelectedItem,
    variant = "default",
    value,
    onChange,
    onInputChange
  } = props;
  const itemToString = item => (item && item[dataSourceConfig.text]) || "";

  let _props;
  if (variant === "next") {
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

const AutoComplete = withStyles(autoCompleteStyles)(_AutoComplete);

AutoComplete.defaultProps = {
  maxSearchResults: 5,
  onChange: () => {}
};

function _App({ classes }) {
  const foods = [
    { name: "Chicken" },
    { name: "Mutton" },
    { name: "Beef" },
    { name: "Pork" }
  ];
  return (
    <div className={classes.container}>
      <AutoComplete
        dataSource={foods}
        dataSourceConfig={{ value: "name", text: "name" }}
        TextFieldProps={{
          name: "foods",
          fullWidth: false
        }}
      />
    </div>
  );
}

const App = withStyles(styles)(_App);

export default App;
