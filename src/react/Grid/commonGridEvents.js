import { toast } from "react-toastify";
import {
  GRID_TYPES,
  stepTypes,
  asyncStatusCodes,
  rowBlockCombinations,
} from "./RowDef";
import { testCaseConstants } from "../../appConstants";
import * as commonGridOperations from "./commonGridOperations";
import { getNewRowId } from "./utils";

const constants = require("./RowDef");

const isAltC = (name, prefix) =>
  name &&
  prefix &&
  name.toLowerCase() === `c` &&
  prefix.toLowerCase() === `alt`;

const isAltV = (name, prefix) =>
  name &&
  prefix &&
  name.toLowerCase() === `v` &&
  prefix.toLowerCase() === `alt`;

const isAltShiftV = (name, prefix) =>
  name &&
  prefix &&
  name.toLowerCase() === `v` &&
  prefix.toLowerCase() === `shiftalt`;

const isAltI = (name, prefix) =>
  name &&
  prefix &&
  name.toLowerCase() === `i` &&
  prefix.toLowerCase() === `alt`;

const isAltT = (name, prefix) =>
  name &&
  prefix &&
  name.toLowerCase() === `t` &&
  prefix.toLowerCase() === `alt`;

export const onKeyUp = (grid, key, event, name, prefix) => {
  const selectedRows = window.treeGrid.GetSelRows();
  const keyCode = key && parseInt(key, 10);
  let selectedRow = null;
  if (selectedRows.length > 0) {
    selectedRow = selectedRows[0];
  }
  if (!selectedRow) {
    return;
  }

  if (event.altKey && keyCode === 83) {
    window.treeGrid.ActionAcceptEdit();
    window.treeGrid.gridType === GRID_TYPES.TEST_CASE &&
      commonGridOperations.saveTCGridData();
  } else if (event.altKey && keyCode === 79) {
    selectedRow.Def.rowType === stepTypes.taskStep &&
      onStartEdit(grid, selectedRow, "object");
  } else if ((event.altKey && keyCode === 45) || isAltT(name, prefix)) {
    window.treeGrid.gridType === GRID_TYPES.TEST_CASE && addRow(stepTypes.task);
  } else if ((!event.altKey && keyCode === 45) || isAltI(name, prefix)) {
    addRow(stepTypes.taskStep);
  } else if (event.altKey && keyCode === 46) {
    deleteRow(grid, selectedRow);
  } else if (isAltC(name, prefix)) {
    performCopy(selectedRow);
  } else if (isAltV(name, prefix)) {
    performReplacePasteAction(selectedRow);
  } else if (isAltShiftV(name, prefix)) {
    performInsertPasteAction(selectedRow);
  } else if (event.altKey && keyCode == 71) {
    showGoToLine(grid);
  } else if (event.altKey && keyCode === 65) {
    window.treeGrid.Focus(selectedRow, "action", 1);
  } else if (event.altKey && keyCode === 99) {
    window.treeGrid.Focus(selectedRow, "action", 1);
  } else if (event.altKey && keyCode === 81) {
    window.treeGrid.CollapseAll();
  } else if (event.altKey && keyCode === 87) {
    window.treeGrid.ExpandAll();
  } else if (event.altKey && keyCode === 82) {
    window.treeGrid.Reload();
  }
};

export const onInsertPasteAction = (currentRow, selectedRow, shouldReplace) => {
  window.treeGrid.StartUndo();
  if (!currentRow || !selectedRow) {
    return;
  }
  if (selectedRow.Def.rowType !== "taskStep") {
    return;
  }
  const generatedId = generateUniqueId();
  const grid = window.treeGrid;
  const reusedRows = getReusedRows(grid, selectedRow.parentNode);
  if (reusedRows.length > 0) {
    reusedRows.map((reusedRow) => {
      let childObject = window.treeGrid.GetFirst(reusedRow);
      while (childObject) {
        const nextRowSibling = window.treeGrid.GetNextSibling(childObject);
        if (Number(childObject.Visible) === 0) {
          childObject = window.treeGrid.GetNextSibling(childObject);
          continue;
        }
        if (
          (childObject.stepId && childObject.stepId === selectedRow.stepId) ||
          (childObject.newRowId &&
            childObject.newRowId === selectedRow.newRowId)
        ) {
          const nextRow = window.treeGrid.GetNextSibling(childObject);
          const newStep = window.treeGrid.AddRow(
            reusedRow,
            nextRow,
            1,
            null,
            selectedRow.Def.rowType
          );
          newStep.newRowId = generatedId;
          newStep.stepId = getNewRowId();
          newStep.name = currentRow.name;
          if (currentRow.object) {
            newStep.object = currentRow.object;
            newStep.objectId = currentRow.objectId;
          } else {
            newStep.object = "";
            newStep.objectId = "";
          }
          newStep.description = currentRow.description;
          window.treeGrid.RefreshRow(newStep);
          shouldReplace && window.treeGrid.DeleteRow(childObject, 2);
        }

        childObject = nextRowSibling;
      }
    });
  }

  const nextRow = window.treeGrid.GetNextSiblingVisible(selectedRow);
  const newRow = window.treeGrid.AddRow(
    selectedRow.parentNode,
    nextRow,
    1,
    null,
    selectedRow.Def.rowType
  );
  newRow.newRowId = generatedId;
  newRow.stepId = getNewRowId();
  newRow.name = currentRow.name;
  newRow.description = currentRow.description;
  // newRow.updatedAt = currentRow.updatedAt;
  // newRow.operation = "noOperation";
  // newRow.actionId =
  //     currentRow.action && currentRow.action.actionId
  //         ? currentRow.action.actionId
  //         : "";
  if (currentRow.object) {
    newRow.object = currentRow.object;
    newRow.objectId = currentRow.objectId;
  } else {
    newRow.object = "";
    newRow.objectId = "";
  }
  window.treeGrid.RefreshRow(newRow);
  window.treeGrid.EndUndo();
  return newRow;
};

export const onReplacePasteAction = (currentRow, selectedRow) => {
  const newRow = onInsertPasteAction(currentRow, selectedRow, true);
  window.treeGrid.StartUndo();
  window.treeGrid.DeleteRow(selectedRow, 2);
  window.treeGrid.RefreshRow(newRow);
  window.treeGrid.EndUndo();
  window.treeGrid.MergeUndo();
};

export const performReplacePasteAction = (selectedRow) => {
  const { currentRow } = window.treeGrid;
  if (!currentRow || !selectedRow) {
    return;
  }
  if (selectedRow === currentRow) {
    return;
  }
  if (selectedRow.Def.rowType !== "taskStep") {
    return;
  }
  onReplacePasteAction(currentRow, selectedRow);
};

export const performInsertPasteAction = (selectedRow) => {
  const { currentRow } = window.treeGrid;
  if (!currentRow || !selectedRow) {
    return;
  }
  if (selectedRow.Def.rowType !== "taskStep") {
    return;
  }
  onInsertPasteAction(currentRow, selectedRow);
};

export const onStartDrag = (grid, row, col, more, copy, rows) => {
  startDragAction(grid, row, col, more, copy, rows);
};

export const deleteRow = (grid, row) => {
  if (!validateRowDelete(row)) {
    return;
  }
  performDeleteRow(grid, row);
};

export const performDeleteRow = (grid, row) => {
  let futureSelectedRow = null;
  if (row && row.previousSibling) {
    futureSelectedRow = row.previousSibling;
  } else if (row && row.nextSibling) {
    futureSelectedRow = row.nextSibling;
  }
  window.treeGrid.ClearSelection();
  window.treeGrid.SelectRow(futureSelectedRow);
  window.treeGrid.DeleteRow(row, 2);
};

export const onClick = (grid, row, col, x, y, event) => {
  window.treeGrid.ClearSelection();
  window.treeGrid.SelectRow(row);
};

export const startDragAction = (grid, row, col, more, copy, rows) => {
  // perform action before dragging.
  return constants.asyncStatusCodes.done;
};
export const showGoToLine = (grid) => {
  window.treeGrid.ClearSelection();
  var html =
    '<form onsubmit="return window.goToLine(this)" class="go-to-line row"><div class="col-sm-12 col-md-12 col-lg-12 mb-3 mt-3">';
  html +=
    '<input class="form-control" id="lineNo" type="number" placeholder="Enter Line No." autofocus min="1"/>';
  html +=
    '<button type="submit" class="m-2 action action-task-else-step qds-btn btn btn-primary">Go</button>';
  html +=
    '<button type="button" onclick="return window.hideGoToLine(this);" class="qds-btn btn btn-secondary">Cancel</button>';
  html += "</div></form>";
  grid.ShowMessage(html, null, null, true);
  document.getElementById("lineNo").focus();
};

export const OnCanDrop = (grid, row, togrid, torow, type, copy, rows) => {
  if (
    row.Def.rowType !== constants.stepTypes.task &&
    row.Def.rowType !== constants.stepTypes.taskStep
  ) {
    // Allow only task and taskStep moving
    return 0;
  }

  if (
    row.Def.rowType === constants.stepTypes.taskStep &&
    torow.Def.rowType === constants.stepTypes.taskStep &&
    type === 2
  ) {
    // Don't allow task step as child of other task step
    return 0;
  }

  if (
    (torow.Def.rowType === constants.stepTypes.tcEndIfStep ||
      torow.Def.rowType === constants.stepTypes.taskEndIfStep) &&
    type !== 3
  ) {
    // Don't allow to drop anywhere around EndIF
    return 0;
  }

  if (
    type !== 2 &&
    (torow.Def.rowType === constants.stepTypes.tcElseIfStep ||
      torow.Def.rowType === constants.stepTypes.taskElseIfStep ||
      torow.Def.rowType === constants.stepTypes.tcElseStep ||
      torow.Def.rowType === constants.stepTypes.taskElseStep)
  ) {
    // Don't allow to drop below or above of any else if or else step
    return 0;
  }

  if (
    type === 3 &&
    (torow.Def.rowType === constants.stepTypes.tcIfStep ||
      torow.Def.rowType === constants.stepTypes.taskIfStep)
  ) {
    // Don't allow to drop below of any if step
    return 0;
  }

  if (
    row.Def.rowType === constants.stepTypes.task &&
    torow.Def.rowType !== constants.stepTypes.task
  ) {
    // Don't allow to drop task anywhere under other task
    const toRowParentTask = getTask(torow);
    if (toRowParentTask) {
      return 0;
    }
  }

  if (
    type === 2 &&
    ((row.Def.rowType === constants.stepTypes.task &&
      torow.Def.rowType === constants.stepTypes.task) ||
      torow.Def.rowType === constants.stepTypes.tcStep)
  ) {
    // Don't allow to drop task inside other task and tc step
    return 0;
  }

  if (row.Def.rowType === constants.stepTypes.taskStep) {
    const rowParentTask = getTask(row);
    const toRowParentTask = getTask(torow);
    if (rowParentTask !== toRowParentTask) {
      // Restrict moving task step inside other task
      return 0;
    }

    if (
      torow.Def.rowType === constants.stepTypes.task &&
      torow === rowParentTask &&
      type !== 2
    ) {
      // Don't allow to move taskstep at TC level
      return 0;
    }
  }

  return type;
};

export const performCopy = (selectedRow) => {
  if (!selectedRow) {
    return;
  }
  if (selectedRow.Def.rowType !== "taskStep") {
    return;
  }
  window.treeGrid.currentRow = selectedRow;
};

/**
   * Restrict user to delele row, when only one row is exist in grid,
      It must have at least one step definition in test case
   * @param {*} grid
   * @param {*} row
   * @param {*} type
   * @param {*} rows
   * @param {*} rowType
   */
export const validateRowDelete = (row, operation = `delete`) => {
  const nextChild = window.treeGrid.GetNextSiblingVisible(row);
  const prevChild = window.treeGrid.GetPrevSiblingVisible(row);
  if (!nextChild && !prevChild) {
    const parentNodeLevel = row.parentNode && row.parentNode.Level;
    if (
      row.Def.rowType === constants.stepTypes.task &&
      parentNodeLevel === -1
    ) {
      toast.error(`You cannot detach the last task from the test case.`, {
        autoClose: false,
      });
      return false;
    }
    if (row.Def.rowType === constants.stepTypes.taskStep) {
      toast.error(`You cannot ${operation} the last step from the task.`, {
        autoClose: false,
      });
      return false;
    }
  }
  return true;
};

export const onClickChangeAnyway = () => {
  const selectedRows = window.treeGrid.GetSelRows();
  var selectedRow = "";
  if (selectedRows[0] && selectedRows[0].rowType === constants.stepTypes.task) {
    selectedRow = selectedRows[0];
  } else {
    selectedRow = selectedRows[0];
    while (
      selectedRow.rowType !== constants.stepTypes.task &&
      selectedRow.parentNode
    ) {
      selectedRow = selectedRow.parentNode;
    }
  }
  selectedRow.changeAnyway = true;
  window.treeGrid.HideMessage();
};

export const checkForChangeAnyway = (row) => {
  const taskRow = getTask(row);
  return taskRow.changeAnyway;
};

export const onCopy = (grid, txt) => {
  const id = window.treeGrid.GetRowById(txt);
};

export const onStartEditAction = (grid, row, col) => {
  return false;
};

export const onStartEdit = (grid, row, col) => {
  if (
    col === "object" &&
    row.Def.rowType === stepTypes.taskStep &&
    row.actionId
  ) {
    toast.error(testCaseConstants.errorMessage.OBJECT_ACTION_NOT_ALLOWED, {
      autoClose: false,
    });
    return true;
  }
  onStartEditAction(grid, row, col);
};

export const getReusedRows = (grid, parent) => {
  const reusedRows = Object.keys(grid.Rows).reduce((rows, key) => {
    if (
      grid.Rows[key].stepId &&
      parent.stepId &&
      grid.Rows[key].stepId === parent.stepId &&
      grid.Rows[key].id != parent.id &&
      !grid.Rows[key].Deleted
    ) {
      rows.push(grid.Rows[key]);
    }
    return rows;
  }, []);
  return reusedRows;
};

export const getAllTaskRows = (grid, parent) => {
  const reusedRows = Object.keys(grid.Rows).reduce((rows, key) => {
    if (
      grid.Rows[key].stepId &&
      parent.stepId &&
      grid.Rows[key].stepId === parent.stepId &&
      !grid.Rows[key].Deleted
    ) {
      rows.push(grid.Rows[key]);
    }
    return rows;
  }, []);
  return reusedRows;
};

export const generateUniqueId = () => {
  const crypto = window.crypto || window.msCrypto;
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export const addRow = (type) => {
  const selectedRows = window.treeGrid.GetSelRows();
  if (selectedRows.length > 1) {
    toast.error(
      `Cannot add ${type}. More than one row is selected. To continue please select only one row and then add new ${type}.`
    );
  }
  performAddRowWrapper(type);
};

const performAddRowWrapper = (type) => {
  const newRow = performAddRow(type);
  if (newRow) {
    window.treeGrid.StartUndo();
    window.treeGrid.Focus(newRow, "name", null, null, 1);
    window.treeGrid.EndUndo();
    window.treeGrid.MergeUndo();
  }
};

/**
 * adding a complete block of rows e.g. task and taskStep , if and endif
 * @param {Object} parentRow
 * @param {Object} nextRow
 * @param {String} rowTypeDef
 */
const addCompleteRowBlock = (
  parentRow,
  nextRow,
  rowTypeDef,
  generatedId = ""
) => {
  const rowLevel = parentRow.level;
  const newRow = window.treeGrid.AddRow(
    parentRow,
    nextRow,
    1,
    null,
    rowTypeDef
  );
  newRow.newRowId = generatedId || generateUniqueId();
  window.treeGrid.RefreshRow(newRow);
  rowLevel > -1 && window.treeGrid.Expand(parentRow);
  if (rowTypeDef === constants.stepTypes.task) {
    rowBlockCombinations[rowTypeDef] &&
      window.treeGrid.AddRow(
        newRow,
        null,
        1,
        null,
        rowBlockCombinations[rowTypeDef]
      );
    window.treeGrid.EndUndo();
    return newRow;
  }
  rowBlockCombinations[rowTypeDef] &&
    window.treeGrid.AddRow(
      parentRow,
      nextRow,
      1,
      null,
      rowBlockCombinations[rowTypeDef]
    );
  window.treeGrid.EndUndo();
  return newRow;
};

export const performAddRow = (rowType) => {
  const selectedRows = window.treeGrid.GetSelRows() || [];
  let selectedRow = "";
  let selectedRowType = "";
  let childNodes = null;
  let selectedRowParent = null;

  try {
    // Return false when multiple rows are selected
    if (selectedRows.length > 1) {
      toast.error(
        "More than one row is selected. Please select one row only.",
        {
          autoClose: false,
        }
      );
      return;
    }
    // Check row is selected
    if (selectedRows.length === 1) {
      window.treeGrid.StartUndo();
      if (selectedRows[0]) {
        selectedRow = selectedRows[0];
        childNodes = selectedRow.childNodes;
        selectedRowType = selectedRow.Def.rowType;
        // Check new added row type is allowed as a child for selected row
        if (
          constants.rowTypes[selectedRowType].allowChildren.indexOf(rowType) >
          -1
        ) {
          const generatedId = generateUniqueId();
          const reusedRows = getReusedRows(window.treeGrid, selectedRow);
          if (reusedRows.length > 0) {
            reusedRows.map((reusedRow) => {
              childNodes = reusedRow.childNodes;
              const reusedFirstChild =
                childNodes.length > 0 ? reusedRow.firstChild : null;
              const newStep = window.treeGrid.AddRow(
                reusedRow,
                reusedFirstChild,
                1,
                null,
                rowType
              );
              // This property is added here to keep a unique key inside multiple reused rows.
              // If we just use stepId(temp#ID) for comparing two nodes we won't get a unique stepId as Treegrid generates seperate ID's
              newStep.newRowId = generatedId;
              window.treeGrid.RefreshRow(newStep);
            });
          }
          const firstChild =
            childNodes.length > 0 ? selectedRow.firstChild : null;
          return addCompleteRowBlock(
            selectedRow,
            firstChild,
            rowType,
            generatedId
          );
        } else if (
          constants.rowTypes[selectedRowType].allowSibling.indexOf(rowType) > -1
        ) {
          // Check row type is allowed as sibling for selected row
          const nextRow = window.treeGrid.GetNextSibling(selectedRow);
          const generatedId = generateUniqueId();
          if (selectedRow.parentNode) {
            selectedRowParent = selectedRow.parentNode;
          }
          const grid = window.treeGrid;
          const reusedRows = getReusedRows(grid, selectedRowParent);
          if (reusedRows.length > 0) {
            reusedRows.map((reusedRow) => {
              let childObject = window.treeGrid.GetFirst(reusedRow);
              while (childObject) {
                const nextRowSibling = window.treeGrid.GetNextSibling(
                  childObject
                );
                if (Number(childObject.Visible) === 0) {
                  childObject = window.treeGrid.GetNextSibling(childObject);
                  continue;
                }
                if (
                  (childObject.stepId &&
                    childObject.stepId === selectedRow.stepId) ||
                  (childObject.newRowId &&
                    childObject.newRowId === selectedRow.newRowId)
                ) {
                  const nextRow = window.treeGrid.GetNextSibling(childObject);
                  const newStep = window.treeGrid.AddRow(
                    reusedRow,
                    nextRow,
                    1,
                    null,
                    rowType
                  );
                  newStep.newRowId = generatedId;
                  window.treeGrid.RefreshRow(newStep);
                }
                childObject = nextRowSibling;
              }
            });
          }
          return addCompleteRowBlock(
            selectedRowParent,
            nextRow,
            rowType,
            generatedId
          );
        } else {
          // Return false when given type is not allowed as child and sibling of selected row
          if (rowType === constants.stepTypes.taskStep) {
            toast.info(
              "Operation not Allowed. Please note that we can only add steps under a Task for now."
            );
            return;
          }
          selectedRowParent = getTask(selectedRow);
          const selectedRowParentRowType =
            selectedRowParent.Def.rowType || "root";
          const selectedRowNextSibling = window.treeGrid.GetNextSibling(
            selectedRowParent
          );
          const nextRow =
            selectedRowParent && selectedRowNextSibling
              ? selectedRowNextSibling
              : null;
          if (
            constants.rowTypes[selectedRowParentRowType].allowChildren.indexOf(
              rowType
            ) > -1
          ) {
            return addCompleteRowBlock(selectedRowParent, nextRow, rowType);
          } else if (
            constants.rowTypes[selectedRowParentRowType].allowSibling.indexOf(
              rowType
            ) > -1
          ) {
            return addCompleteRowBlock(
              selectedRowParent.parentNode,
              nextRow,
              rowType
            );
          } else {
            return;
          }
        }
      }
      window.treeGrid.EndUndo();
    } else {
      // When row is not selected check rowtype is allowed in Level 1 add row
      selectedRowType = "root";
      if (
        constants.rowTypes[selectedRowType].allowChildren.indexOf(rowType) > -1
      ) {
        window.treeGrid.StartUndo();
        return addCompleteRowBlock("root", null, rowType);
      } else {
        toast.error("Operation not Allowed.");
      }
    }
  } catch (error) {}
};

export const checkForImpactedTestCases = (
  row,
  projectId,
  actionMethod,
  params,
  showLoader,
  getTestCasesContainingTask
) => {
  const testCasesInput = {
    projectId: projectId,
    stepId: "",
    actionMethod: actionMethod,
    params: params,
  };

  if (!checkForChangeAnyway(row)) {
    const taskRow = getTask(row);
    if (taskRow) {
      testCasesInput.stepId = taskRow.stepId;
    }
  }
  if (testCasesInput.stepId) {
    showLoader();
    getTestCasesContainingTask(testCasesInput); // async call
  } else {
    actionMethod(...params);
  }
};

export const getTask = (row) => {
  let tempRow = row;

  do {
    if (!tempRow || !tempRow.Def) {
      return null;
    }
    if (tempRow.Def.rowType === constants.stepTypes.task) {
      return tempRow;
    }
    tempRow = tempRow.parentNode;
  } while (true);
};

/**
 * Re render grid after grid load.
 * @param {*} grid
 */
export const onRenderFinish = (grid) => {
  window.treeGrid = grid;
};

export const reloadGrid = () => window.treeGrid.ActionReload();
export const undoGridAction = () => window.treeGrid.ActionUndo();
export const redoGridAction = () => window.treeGrid.ActionRedo();
export const expandAllRows = () => window.treeGrid.ExpandAll();
export const collapseAllRows = () => window.treeGrid.CollapseAll();
export const canPerformRedo = () => window.treeGrid.CanRedo();
export const canPerformUndo = () => window.treeGrid.CanUndo();
