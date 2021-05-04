import React from 'react';
import { bool } from 'prop-types';

import Button from '../../Button';
import reloadIcon from '../../../../images/test-cases/ico_reset.svg';
import undoIcon from '../../../../images/test-cases/ico_undo.svg';
import redoIcon from '../../../../images/test-cases/ico_redo.svg';
import expandIcon from '../../../../images/test-cases/ico_ExpandAll.svg';
import collapseIcon from '../../../../images/test-cases/ico_CollapseAll.svg';
import './style.scss';
import { reloadGrid, undoGridAction, redoGridAction, expandAllRows, collapseAllRows } from '../commonGridEvents';

const gridActionsComponent = ({ undoRedoOps, viewOps }) => {
  return (
    <div className="grid-actions">
      {undoRedoOps && (
        <div className="undo-redo-ops">
          <Button tooltip="Reload grid, cancel all changes (Alt+R)" id="reload-grid" color="link" onClick={reloadGrid}>
            <img className="img" src={reloadIcon} />
          </Button>
          <Button tooltip="Undo last action (Ctrl+Z)" color="link" id="undo-grid" onClick={undoGridAction}>
            <img className="img" src={undoIcon} />
          </Button>
          <Button tooltip="Redo last action (Ctrl+Y)" color="link" id="redo-grid" onClick={redoGridAction}>
            <img className="img" src={redoIcon} />
          </Button>
        </div>
      )}
      {undoRedoOps && viewOps && <span className="vl" />}
      {viewOps && (
        <div className="view-ops">
          <Button tooltip="Expand All (Alt+W)" color="link" id="expand-grid" onClick={expandAllRows}>
            <img className="img" src={expandIcon} />
          </Button>
          <Button tooltip="Collapse All (Alt+Q)" color="link" id="collapse-grid" onClick={collapseAllRows}>
            <img className="img" src={collapseIcon} />
          </Button>
        </div>
      )}
    </div>
  );
};

gridActionsComponent.defaultProps = {
  undoRedoOps: true,
  viewOps: true,
};

gridActionsComponent.propTypes = {
  undoRedoOps: bool,
  viewOps: bool,
};

export default gridActionsComponent;
