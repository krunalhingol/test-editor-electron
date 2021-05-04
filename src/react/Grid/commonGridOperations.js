import { stepTypes, operations } from "./RowDef";
import { checkIfRowValueIsEmpty, getNewRowId } from "./utils";
import update from "immutability-helper";
import { toast } from "react-toastify";
import { testCaseConstants } from "../../appConstants";
const store = {};
const tcGridActions = {};
const appAction = {};
const taskGridActions = {};
const getProjectId = () => 'test';

export const goToLine = (value) => {
  const lineNoEleValue =
    document.getElementById("lineNo") &&
    document.getElementById("lineNo").value;
  const val = Number.isInteger(value) ? value : lineNoEleValue;
  const row = val ? window.treeGrid.GetRowByIndex(val, 1) : null;
  if (row) {
    window.treeGrid.ShowRow(row);
    window.treeGrid.ExpandParents(row);
    window.treeGrid.ClearSelection();
    window.treeGrid.SelectRow(row);
    window.treeGrid.Focus(row, "name", null, null, 1);
    const top = window.treeGrid.GetRowTop(row);
    if (top) {
      window.treeGrid.SetScrollTop(top);
    } else {
      window.treeGrid.ScrollIntoView(row);
    }
    window.treeGrid.HideMessage();
  } else {
    toast.info(testCaseConstants.errorMessage.gotoLineNotAvailable(val));
  }
  return false;
};

export const checkForEmptyValues = () => {
  const rows = window.treeGrid.Rows;
  let isEmpty = false;
  const listOfRows = [];
  Object.keys(rows).forEach((key) => {
    if (
      rows[key].Visible === 1 &&
      !rows[key].Deleted &&
      rows[key].Kind === "Data" &&
      checkIfRowValueIsEmpty(rows[key])
    ) {
      listOfRows.unshift(`${rows[key].Line}`);
      isEmpty = true;
    }
  });
  if (listOfRows.length !== 0) {
    const manyMoreText = listOfRows.length > 3 ? " and so forth" : "";
    toast.error(
      `Row numbers ${listOfRows
        .slice(0, 3)
        .toString()}${manyMoreText} cannot be empty. Enter the relevant information and save again.`,
      {
        autoClose: false,
      }
    );
    goToLine(parseInt(listOfRows[0], 10));
  }
  return isEmpty;
};

export const hideGoToLine = () => {
  window.treeGrid.HideMessage();
  return true;
};

export const getTestCaseConditionEndObject = (row) => {
  const conditionEndObject = {};
  conditionEndObject.stepId = row.stepId || row.id;
  conditionEndObject.type = stepTypes.conditionEnd;
  conditionEndObject.updatedAt = row.updatedAt ? row.updatedAt : "";
  conditionEndObject.name = row.name || "";
  conditionEndObject.description = row.description || "";
  conditionEndObject.order = [];
  conditionEndObject.steps = [];
  return conditionEndObject;
};

export const getTaskConditionEndObject = (row) => {
  const conditionEndObject = {};
  conditionEndObject.stepId = row.stepId || row.id;
  conditionEndObject.updatedAt = row.updatedAt ? row.updatedAt : "";
  conditionEndObject.name = row.name || "";
  conditionEndObject.description = row.description || "";
  conditionEndObject.type = stepTypes.conditionEnd;
  conditionEndObject.order = [];
  conditionEndObject.steps = [];
  return conditionEndObject;
};

/**
 * getting condition block's properties in an object.
 * @param {Object} row
 * @param {Object} testCaseParsedData - already parsed data to be reused with reusable tasks.
 */
export const getConditionBody = (row, testCaseParsedData = null) => {
  const conditionBody = {
    stepId: row.stepId ? row.stepId : getNewRowId(),
    name: row.name || "",
    description: row.description || "",
    type: row.rowType,
    order: [],
    steps: [],
  };
  let conditionChildObject = window.treeGrid.GetFirst(row);

  while (conditionChildObject) {
    if (conditionChildObject.Visible === 0) {
      conditionChildObject = window.treeGrid.GetNextSibling(
        conditionChildObject
      );
      continue;
    }
    const objectType = conditionChildObject.Def.rowType;
    switch (objectType) {
      case stepTypes.task:
        const reusedTaskData = getMatchedTaskReference(testCaseParsedData, row);
        const taskRef = getTaskReference(conditionChildObject, reusedTaskData);
        taskRef.operation = setOperation(taskRef);
        conditionBody.order.push({ stepId: taskRef.stepId });
        taskRef.initialParent && delete taskRef.initialParent;
        taskRef.currentParent && delete taskRef.currentParent;
        conditionBody.steps.push(taskRef);
        break;
      case stepTypes.taskStep:
        const stepObject = getStepObject(conditionChildObject);
        stepObject.operation = setOperation(stepObject);
        conditionBody.order.push({ stepId: stepObject.stepId });
        stepObject.initialParent && delete stepObject.initialParent;
        stepObject.currentParent && delete stepObject.currentParent;
        conditionBody.steps.push(stepObject);
        break;
      case stepTypes.tcStep:
        const tcStepObject = getStepObject(conditionChildObject);
        tcStepObject.operation = setOperation(tcStepObject);
        conditionBody.order.push({ stepId: tcStepObject.stepId });
        tcStepObject.initialParent && delete tcStepObject.initialParent;
        tcStepObject.currentParent && delete tcStepObject.currentParent;
        conditionBody.steps.push(tcStepObject);
        break;
      case stepTypes.taskIfStep:
        const ifStepObject = getStepObject(conditionChildObject);
        ifStepObject.operation = setOperation(ifStepObject);
        conditionBody.order.push({ stepId: ifStepObject.stepId });
        ifStepObject.initialParent && delete ifStepObject.initialParent;
        ifStepObject.currentParent && delete ifStepObject.currentParent;
        conditionBody.steps.push(ifStepObject);
        break;
    }
    conditionChildObject = window.treeGrid.GetNextSibling(conditionChildObject);
  }
  return conditionBody;
};

const getStepObject = (row) => {
  const stepObject = {};
  stepObject.stepId = row.stepId || row.id;
  stepObject.name = row.name.toString();
  stepObject.description = row.description ? row.description.toString() : "";
  stepObject.objectId = row.objectId ? row.objectId : "";
  stepObject.actionId =
    row.action && row.action.actionId ? row.action.actionId : "";
  stepObject.updatedAt = row.updatedAt ? row.updatedAt : "";
  stepObject.type = stepTypes.step;
  stepObject.initialParent = row.initialParent ? row.initialParent : undefined;
  // Check grid type is tc
  if (row.parentNode.Level === -1 && window.treeGrid.gridType) {
    stepObject.currentParent = {
      id: "test_id",
      type: "testCase",
    };
  } else {
    stepObject.currentParent = {
      id: row.parentNode.stepId,
      type: row.parentNode.rowType,
    };
  }
  return stepObject;
};

/**
 * getting testcase condition block.
 * @param {*} row
 * @param {Object} testCaseParsedData - already parsed data to be reused with reusable tasks.
 */
export const getTestCaseConditionBlock = (row, testCaseParsedData = null) => {
  const conditionBlock = {
    stepId: row.refId ? row.refId : getNewRowId(),
    name: row.refName ? row.refName : "",
    description: row.cbDescription ? row.cbDescription : "",
    type: stepTypes.conditionBlock,
    updatedAt: row.refUpdatedAt || "",
    order: [],
    steps: [],
  };

  let conditionObject = row;

  if (conditionObject.Def.rowType === stepTypes.tcIfStep) {
    const conditionIfObject = getConditionBody(
      conditionObject,
      testCaseParsedData
    );
    conditionIfObject.operation = setOperation(conditionIfObject);
    conditionBlock.order.push({ stepId: conditionIfObject.stepId });
    conditionIfObject.initialParent && delete conditionIfObject.initialParent;
    conditionIfObject.currentParent && delete conditionIfObject.currentParent;
    conditionBlock.steps.push(conditionIfObject);

    conditionObject = window.treeGrid.GetNextSibling(conditionObject);
    while (
      conditionObject &&
      conditionObject.Def.rowType !== stepTypes.tcEndIfStep
    ) {
      if (conditionObject.Visible === 0) {
        conditionObject = window.treeGrid.GetNextSibling(conditionObject);
        continue;
      }

      const conditionObjectType = conditionObject.Def.rowType;
      switch (conditionObjectType) {
        case stepTypes.tcElseStep:
        case stepTypes.tcElseIfStep:
          const conditionBody = getConditionBody(
            conditionObject,
            testCaseParsedData
          );
          conditionBody.operation = setOperation(conditionBody);
          conditionBlock.order.push({ stepId: conditionBody.stepId });
          conditionBody.initialParent && delete conditionBody.initialParent;
          conditionBody.currentParent && delete conditionBody.currentParent;
          conditionBlock.steps.push(conditionBody);
          break;

        default:
          break;
      }

      conditionObject = window.treeGrid.GetNextSibling(conditionObject);
    }
    if (conditionObject) {
      const conditionEndObject = getTestCaseConditionEndObject(conditionObject);
      conditionEndObject.operation = setOperation(conditionEndObject);
      conditionBlock.order.push({ stepId: conditionEndObject.stepId });
      conditionEndObject.initialParent &&
        delete conditionEndObject.initialParent;
      conditionEndObject.currentParent &&
        delete conditionEndObject.currentParent;
      conditionBlock.steps.push(conditionEndObject);
    }
  }
  return conditionBlock;
};

export const getTaskConditionBlock = (row) => {
  const conditionBlock = {
    stepId: row.refId ? row.refId : getNewRowId(),
    name: row.refName ? row.refName : "",
    description: row.cbDescription ? row.cbDescription : "",
    type: stepTypes.conditionBlock,
    updatedAt: row.refUpdatedAt || "",
    order: [],
    steps: [],
  };

  let conditionObject = row;
  if (conditionObject.Def.rowType === stepTypes.taskIfStep) {
    const conditionIfObject = getConditionBody(conditionObject);
    conditionIfObject.operation = setOperation(conditionIfObject);
    conditionBlock.order.push({ stepId: conditionIfObject.stepId });
    conditionIfObject.initialParent && delete conditionIfObject.initialParent;
    conditionIfObject.currentParent && delete conditionIfObject.currentParent;
    conditionBlock.steps.push(conditionIfObject);

    conditionObject = window.treeGrid.GetNextSibling(conditionObject);
    while (
      conditionObject &&
      conditionObject.Def.rowType !== stepTypes.taskEndIfStep
    ) {
      const conditionObjectType = conditionObject.Def.rowType;
      switch (conditionObjectType) {
        case stepTypes.taskElseStep:
        case stepTypes.taskElseIfStep:
          const conditionBody = getConditionBody(conditionObject);
          conditionBody.operation = setOperation(conditionBody);
          conditionBlock.order.push({ stepId: conditionBody.stepId });
          conditionBody.initialParent && delete conditionBody.initialParent;
          conditionBody.currentParent && delete conditionBody.currentParent;
          conditionBlock.steps.push(conditionBody);
          break;
        default:
          break;
      }
      conditionObject = window.treeGrid.GetNextSibling(conditionObject);
    }
    if (conditionObject) {
      const conditionEndObject = getTaskConditionEndObject(conditionObject);
      conditionEndObject.operation = setOperation(conditionEndObject);
      conditionBlock.order.push({ stepId: conditionEndObject.stepId });
      conditionEndObject.initialParent &&
        delete conditionEndObject.initialParent;
      conditionEndObject.currentParent &&
        delete conditionEndObject.currentParent;
      conditionBlock.steps.push(conditionEndObject);
    }
  }
  return conditionBlock;
};

export const traverseTree = (node, dict = {}) => {
  if (node.steps) {
    // it will first go to the last level
    node.steps.forEach((step) => {
      traverseTree(step, dict);
    });
  }

  // This check is for duplicate nodes present in both stepDict and reusedTask object
  // If the node is present in reused task object we ignore in stepDict.
  const { reusedTasks } = store.getState().testCaseGrid;
  let flagVar = false;
  for (const i in reusedTasks) {
    if (i === node.stepId) {
      flagVar = true;
      break;
    }
  }
  if (!flagVar) {
    dict[node.stepId] = node;
  }
  return dict;
};

export const getStepDictFromTree = (tree) => {
  return traverseTree(tree, {});
};

/**
 * Return testcase definition's
 */
const getTcProperties = () => {
  const testCaseInfo = store.getState().testCasesLeftPanel.testCaseDetails;
  testCaseInfo.tcId = testCaseInfo.tcId ? testCaseInfo.tcId : getNewRowId();
  testCaseInfo.updatedAt = testCaseInfo.updatedAt ? testCaseInfo.updatedAt : "";
  testCaseInfo.order = [];
  testCaseInfo.steps = [];
  delete testCaseInfo.ownership;
  delete testCaseInfo.key;
  return testCaseInfo;
};

/**
 * getMatchedTaskReference
 * @param {Object} testCaseParsedData - already parsed data to be reused with reusable tasks.
 * @param {Object} row
 * @returns {Object}
 */
const getMatchedTaskReference = (testCaseParsedData, row) => {
  const { reusedTasks } = store.getState().testCaseGrid;
  const reusedCheck = !!(row.stepId && reusedTasks[row.stepId]);
  if (reusedCheck) {
    const matchedTaskRef = testCaseParsedData.steps.find(
      (taskRefItem) =>
        taskRefItem.steps && taskRefItem.steps[0].name === row.name
    );
    return matchedTaskRef;
  }
};

export const getTCDataFromTreeGrid = () => {
  const testCase = getTcProperties() || [];
  let row = window.treeGrid.GetFirst();
  while (row) {
    let isDeleted = false;
    if (parseInt(row.Visible, 10) === 0) {
      if (row.id.startsWith("temp#")) {
        row = window.treeGrid.GetNextSibling(row);
        continue;
      } else {
        isDeleted = true;
      }
    }
    const rowType = row.Def.rowType;
    switch (rowType) {
      case stepTypes.task:
        const reusedTaskData = getMatchedTaskReference(testCase, row);
        const taskReference = getTaskReference(row, reusedTaskData);
        if (!taskReference) {
          return;
        }
        taskReference.operation = setOperation(taskReference, isDeleted);
        !isDeleted && testCase.order.push({ stepId: taskReference.stepId });
        taskReference.initialParent && delete taskReference.initialParent;
        taskReference.currentParent && delete taskReference.currentParent;
        testCase.steps.push(taskReference);
        break;
      case stepTypes.tcIfStep:
        const conditionBlock = getTestCaseConditionBlock(row, testCase);
        conditionBlock.operation = setOperation(conditionBlock);
        testCase.order.push({ stepId: conditionBlock.stepId });
        conditionBlock.initialParent && delete conditionBlock.initialParent;
        conditionBlock.currentParent && delete conditionBlock.currentParent;
        testCase.steps.push(conditionBlock);
        break;
      case stepTypes.tcStep:
        const child = getStepObject(row);
        child.operation = setOperation(child, isDeleted);
        !isDeleted && testCase.order.push({ stepId: child.stepId });
        child.initialParent && delete child.initialParent;
        child.currentParent && delete child.currentParent;
        testCase.steps.push(child);
        break;
      default:
        break;
    }
    row = window.treeGrid.GetNextSibling(row);
  }
  testCase.operation = setTestCaseOperation(testCase);
  return testCase;
};

const setTestCaseOperation = (node) => {
  const { stepDict } = store.getState().testCaseGrid;
  const gridData = stepDict[undefined];

  if (node.tcId.startsWith("temp#")) {
    return { op: operations.create };
  } else if (node.name && node.name !== gridData.name) {
    return { op: operations.update };
  } else if (
    (gridData.description || node.description) &&
    node.description !== gridData.description
  ) {
    return { op: operations.update };
  } else if (gridData.severityId !== node.severityId) {
    return { op: operations.update };
  } else if (gridData.priorityId !== node.priorityId) {
    return { op: operations.update };
  } else if (JSON.stringify(gridData.order) !== JSON.stringify(node.order)) {
    return { op: operations.update };
  }
  return { op: operations.noOperation };
};

export const getTaskDataFromTreeGrid = () => {
  const row = window.treeGrid.GetFirst();
  return getTask(row);
};

/**
 *
 * @param {Object} row
 * @param {Object} reusedTaskData - reusable data which was already parsed.
 */
const getTaskReference = (row, reusedTaskData = null) => {
  const taskReference = {
    stepId: row.refId ? row.refId : getNewRowId(),
    type: stepTypes.taskReference,
    updatedAt: row.refUpdatedAt ? row.refUpdatedAt : "",
    order: [],
    steps: [],
  };

  taskReference.initialParent = row.initialParent;
  if (row.parentNode.Level === -1) {
    taskReference.currentParent = {
      id: store.getState().testCasesLeftPanel.testCaseDetails.tcId,
      type: "testCase",
    };
  } else {
    taskReference.currentParent = {
      id: row.parentNode.stepId,
      type: row.parentNode.rowType,
    };
  }
  if (reusedTaskData) {
    taskReference.order = reusedTaskData.order;
    taskReference.steps = reusedTaskData.steps;
    taskReference.name = reusedTaskData.name;
  } else {
    const task = getTask(row);
    taskReference.name = row.refName
      ? row.refName
      : `taskReference-${task.name}`;
    taskReference.order.push({ stepId: task.stepId });
    taskReference.steps.push(task);
  }
  return taskReference;
};

export const getTask = (row) => {
  const task = getTaskObject(row);
  let childObject = window.treeGrid.GetFirst(row);
  while (childObject) {
    // This code is getting repeated so we can make a common function and call it everywhere
    let isDeleted = false;
    if (parseInt(childObject.Visible, 10) === 0) {
      if (childObject.id.startsWith("temp#")) {
        childObject = window.treeGrid.GetNextSibling(childObject);
        continue;
      } else {
        isDeleted = true;
      }
    }
    const objectType = childObject.Def.rowType;
    const getTaskHandler = {
      [stepTypes.taskStep]: () => {
        const child = getStepObject(childObject);
        child.operation = setOperation(child, isDeleted);
        !isDeleted && task.order.push({ stepId: child.stepId });
        child.initialParent && delete child.initialParent;
        child.currentParent && delete child.currentParent;
        task.steps.push(child);
      },
      [stepTypes.taskIfStep]: () => {
        const child = getTaskConditionBlock(childObject);
        child.operation = setOperation(child);
        task.order.push({ stepId: child.stepId });
        child.initialParent && delete child.initialParent;
        child.currentParent && delete child.currentParent;
        task.steps.push(child);
      },
    };
    getTaskHandler[objectType] && getTaskHandler[objectType]();
    childObject = window.treeGrid.GetNextSibling(childObject);
  }
  task.operation = setOperation(task);
  task.initialParent && delete task.initialParent;
  task.currentParent && delete task.currentParent;
  return task;
};

const getTaskObject = (row) => {
  const taskObject = {};
  taskObject.stepId = row.stepId || row.id;
  taskObject.name = row.name.toString();
  taskObject.description =
    (row.description && row.description.toString()) || "";
  taskObject.updatedAt = row.updatedAt || "";
  taskObject.type = stepTypes.task;
  taskObject.order = [];
  taskObject.steps = [];

  return taskObject;
};

const setOperation = (node, isDeleted) => {
  if (isDeleted) {
    return { op: operations.delete };
  }
  const { stepDict, reusedTasks } = store.getState().testCaseGrid;
  const oldNode =
    stepDict[node.stepId] || (reusedTasks && reusedTasks[node.stepId]);
  if (oldNode && oldNode.isVisited) {
    return { op: operations.noOperation };
  } else if (
    node.initialParent &&
    node.currentParent &&
    node.currentParent.id !== node.initialParent.id
  ) {
    return {
      op: operations.move,
      opData: {
        from: {
          id: node.initialParent.id,
          type: node.initialParent.type,
        },
        to: {
          id: node.currentParent.id,
          type: node.currentParent.type,
        },
      },
    };
  } else {
    if (stepDict[node.stepId] != undefined) {
      update(stepDict, {
        [node.stepId]: {
          $set: {
            isVisited: true,
          },
        },
      });
      store.dispatch(tcGridActions.setStepDictionary(stepDict));
    }
    if (reusedTasks && reusedTasks[node.stepId] != undefined) {
      update(reusedTasks, {
        [node.stepId]: {
          $set: {
            isVisited: true,
          },
        },
      });
      store.dispatch(tcGridActions.setReusedTasks(reusedTasks));
    }
    if (oldNode === undefined) {
      return { op: operations.create };
    } else if (node.name !== oldNode.name) {
      return { op: operations.update };
    } else if (
      (node.description || oldNode.description) &&
      node.description !== oldNode.description
    ) {
      return { op: operations.update };
    } else if (node.objectId || oldNode.object) {
      if (node.objectId) {
        if (oldNode.object && oldNode.object.objectId) {
          if (node.objectId !== oldNode.object.objectId) {
            return { op: operations.update };
          }
        } else {
          return { op: operations.update };
        }
      } else {
        if (oldNode.object && oldNode.object.objectId) {
          return { op: operations.update };
        }
      }
    } else if (
      oldNode.order &&
      (oldNode.order || node.order) &&
      JSON.stringify(oldNode.order) !== JSON.stringify(node.order)
    ) {
      return { op: operations.update };
    } else if (
      node.type === stepTypes.task
      // && node.steps.some(step => step.operation.op === operations.update)
    ) {
      // function to set update operation if any of its child steps are updated.
      if (getChildOperations(node)) {
        return { op: operations.update };
      }
    }
    return { op: operations.noOperation };
  }
};

export const getChildOperations = (node) => {
  let callBackValue = false;
  const updationOps = [
    operations.update,
    operations.delete,
    operations.create,
    operations.move,
  ];
  if (node.steps) {
    for (const step in node.steps) {
      if (callBackValue) {
        break;
      }
      callBackValue =
        node.steps[step].steps && !callBackValue
          ? getChildOperations(node.steps[step])
          : false;
      if (
        node.steps[step].operation &&
        updationOps.indexOf(node.steps[step].operation.op) > -1 &&
        !callBackValue
      ) {
        callBackValue = true;
        break;
      }
    }
  } else {
    callBackValue = updationOps.indexOf(node.operation.op) > -1;
  }
  return callBackValue;
};

export const setValue = (row, col, val, refresh) => {
  window.treeGrid.SetValue(row, col, val, refresh);
};

export const setAttribute = (row, col, attribute, val, refresh, undo) => {
  window.treeGrid.SetAttribute(row, col, attribute, val, refresh, undo);
};

export const setSelectedObjectValue = (selectedObj) => {
  window.treeGrid.StartUndo();
  const { testCaseGrid } = store.getState();
  const { objectId = "", name = "" } = selectedObj || {};
  const { selectObjectGridData } = testCaseGrid;
  const { row, grid, col } = selectObjectGridData;
  setValue(row, col, name, true);
  setAttribute(
    selectObjectGridData.row,
    selectObjectGridData.col,
    "Id",
    objectId || "",
    1,
    1
  );
  const gridDataValue = {
    grid: "",
    col: "",
    row: "",
  };
  store.dispatch(tcGridActions.setShowModalSelectObject(false));
  store.dispatch(tcGridActions.setSelectObjectGridData(gridDataValue));
  window.Grids.OnAfterValueChanged &&
    window.Grids.OnAfterValueChanged(grid, row, col, name);
  window.treeGrid.EndUndo();
};

const getTestCaseParsedData = (parsedData = false) => {
  if (parsedData) {
    return parsedData;
  } else {
    return getTCDataFromTreeGrid();
  }
};

const getParsedStepDictionary = (parsed = false, gridData = null) => {
  if (!parsed) {
    const stepDict = getStepDictFromTree(gridData);
    store.dispatch(tcGridActions.setStepDictionary(stepDict));
  }
};

const getSanitizedTestCaseObject = (testCase) => {
  testCase.hierarchy && delete testCase.hierarchy;
  testCase.reviewStatus && delete testCase.reviewStatus;
  testCase.lastExecution && delete testCase.lastExecution;
  testCase.rows && delete testCase.rows;
  testCase.updatedBy && delete testCase.updatedBy;
  testCase.createdBy && delete testCase.createdBy;
  testCase.createdAt && delete testCase.createdAt;
  return testCase;
};

/**
 * Save testcase data
 */
export const saveTCGridData = () => {
  if (checkForEmptyValues()) {
    return;
  }

  const { testCaseGrid, testCasesLeftPanel } = store.getState();
  const { gridData, treeGridParsed = false } = testCaseGrid;
  const { testCaseDetails } = testCasesLeftPanel;
  const isTestCaseCanBeSaved =
    testCaseGrid.isTCLocked ||
    !testCaseDetails.tcId ||
    testCaseDetails.tcId.startsWith("temp#");
  if (!isTestCaseCanBeSaved) {
    store.dispatch(appAction.disableLoader());
    toast.info(
      "You cannot save this TestCase. You first need to acquire the Test Case lock or Edit Test Case."
    );
    return;
  }
  const gridDataCopy = JSON.parse(JSON.stringify(gridData));
  getParsedStepDictionary(treeGridParsed, gridDataCopy);
  let testCase = {};
  setTimeout(() => {
    testCase = getTestCaseParsedData(treeGridParsed);
    if (testCase) {
      store.dispatch(appAction.startLoader());
      testCase = getSanitizedTestCaseObject(testCase);
      store.dispatch(tcGridActions.setIsTreeGridParsed(testCase));
      const testCaseInputObject = {
        gridData: testCase,
        projectId: getProjectId(),
        selectedStoryId: testCasesLeftPanel.selectedStoryId,
      };
      if (isTestCaseCanBeSaved) {
        store.dispatch(tcGridActions.sendGridDataToApi(testCaseInputObject));
      }
    }
  }, 200);
};

export const saveTaskGridData = () => {
  if (checkForEmptyValues()) {
    return;
  }
  const { testCaseGrid, taskLeftPanelReducer } = store.getState();

  const { taskDetails } = taskLeftPanelReducer;
  const gridDataCopy = JSON.parse(JSON.stringify(taskDetails));
  const stepDict = getStepDictFromTree(gridDataCopy);
  store.dispatch(tcGridActions.setStepDictionary(stepDict));
  let taskData = {};
  setTimeout(() => {
    taskData = getTaskDataFromTreeGrid();
    if (taskData) {
      store.dispatch(appAction.startLoader());
      const taskInputObject = {
        gridData: taskData,
        projectId: getProjectId(),
      };
      if (testCaseGrid.isTaskLocked || taskData.stepId.startsWith("temp#")) {
        store.dispatch(taskGridActions.sendGridDataToApi(taskInputObject));
      } else {
        store.dispatch(appAction.disableLoader());
        toast.info(
          "You cannot save this Task. You first need to acquire the Task lock or Edit Task."
        );
      }
    }
  }, 200);
};
