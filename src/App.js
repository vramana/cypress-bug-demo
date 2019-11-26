import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  popper: {
    zIndex: 1500
  }
};

function _App({ classes }) {
  const [dialog, setDialog] = useState(false);
  const [selectedFood, setSelectedFood] = useState();
  const foods = ["Chicken", "Mutton", "Beef", "Pork"];
  return (
    <div>
      {!dialog && <Button onClick={() => setDialog(true)}>FOODS</Button>}
      <Popper data-test-id="menu" open={dialog} className={classes.popper}>
        <div>
          <Paper>
            {foods.map((food, index) => (
              <MenuItem
                onClick={() => {
                  setSelectedFood(index);
                  setDialog(false);
                }}
              >
                {food}
              </MenuItem>
            ))}
          </Paper>
        </div>
      </Popper>
      {selectedFood !== undefined && (
        <div>
          The food you have selected is <span>{foods[selectedFood]}</span>
        </div>
      )}
    </div>
  );
}

const App = withStyles(styles)(_App);

export default App;
