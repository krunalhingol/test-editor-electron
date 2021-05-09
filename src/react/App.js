import React, { Component } from 'react';
import './App.css';
import { addRow, deleteRow, OnCanDrop, onClick, onKeyUp, onRenderFinish, onStartDrag, onStartEdit } from './Grid/commonGridEvents';
import { goToLine, hideGoToLine, saveTCGridData } from './Grid/commonGridOperations';
import { reloadGridData } from './Grid/loadTestCaseUtils';
import { GRID_TYPES } from './Grid/RowDef';

class App extends Component {
  componentDidMount(){
    window.Grids.OnKeyUp = onKeyUp;
    window.Grids.OnClick = onClick;
    window.Grids.OnRenderFinish = onRenderFinish;
    window.addRow = addRow;
    window.goToLine = goToLine;
    window.hideGoToLine = hideGoToLine;
    window.Grids.deleteRow = deleteRow;
    window.Grids.OnStartEdit = onStartEdit;
    window.Grids.OnCanDrop = OnCanDrop;
    window.Grids.OnStartDrag = onStartDrag;
    reloadGridData({ divId: 'treeGridWrapper', type: GRID_TYPES.TEST_CASE, isReadOnly: false })
  }
  render() {
    return (
      <div className="App" id="page-wrapper">
        <button onClick={saveTCGridData}>Save Data</button>
        <div id="treeGridWrapper" className='tree-grid-wrapper' />
      </div>
    );
  }
}

export default App;
