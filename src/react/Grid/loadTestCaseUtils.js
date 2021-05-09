import { bodyTemplate } from './RowTemplates';
import { GRID_TYPES } from './RowDef';
const constants = require('./RowDef');
const addIcon = '<i class="fa fa-plus blackPlus"></i>';
const removeIcon = '<i class="fa redMinus"></i>';

/**
 * Format json data return in API response in TreeGrid json format to render data in grid.
 * @param {*} gridData
 */
export const renderTCGridData = (gridData, divId, isReadOnly, testCaseDetails) => {
  const templateInput = { type: GRID_TYPES.TEST_CASE, isReadOnly };
  const treeGridTemplate = getTreeGridTemplate(templateInput);
  const template = [];
  const allSteps = gridData;
  for (let i = 0; i < allSteps.length; i++) {
    let row = [];
    const step = allSteps[i];
    if (step.type == constants.stepTypes.conditionBlock) {
      row = loadTcConditionBlock(testCaseDetails, template, step);
    } else if (step.type == constants.stepTypes.taskReference) {
      row = getTaskRefBlock(testCaseDetails, step);
      template.push(row);
    } else if (step.type == constants.stepTypes.step) {
      row = getDefaultAttr(testCaseDetails, step, 1);
      template.push(row);
    }
  }
  treeGridTemplate.Body = [template];
  window.treeGrid = window.TreeGrid({ Data: { Data: treeGridTemplate }, Debug: '' }, divId);
  window.treeGrid.Source.Upload.Format = 'JSON';
};

export const renderTaskGridData = (gridData, isReadOnly) => {
  const templateInput = { type: GRID_TYPES.TASK, isReadOnly };
  const treeGridTemplate = getTreeGridTemplate(templateInput);
  const template = [];
  const task = getDefaultAttr(null, gridData);
  const childs = getTaskChilds(gridData);
  task.Items = childs;
  template.push(task);

  treeGridTemplate.Body = [template];
  window.treeGrid = window.TreeGrid({ Data: { Data: treeGridTemplate }, Debug: '' }, 'taskTreeGridWrapper');
  window.treeGrid.Source.Upload.Format = 'JSON';
};

export const reloadGridData = ({ divId, type, isReadOnly }) => {
  const templateInput = { type, isReadOnly };
  const treeGridTemplate = getTreeGridTemplate(templateInput);
  treeGridTemplate.Body = [bodyTemplate];
  window.treeGrid = window.TreeGrid({ Data: { Data: treeGridTemplate }, Debug: '' }, divId);
  window.treeGrid.Source.Upload.Format = 'JSON';
};

const getTreeGridConfig = (options) => {
  const { type, isReadOnly } = options;
  const isGridTypeTask = type === GRID_TYPES.TASK;
  const gridType = isGridTypeTask ? GRID_TYPES.TASK : GRID_TYPES.TEST_CASE;
  return {
    gridType,
    Code: 'STRENMTXTJRTIC',
    MainCol: 'name',
    Sorting: '0',
    Undo: '1',
    ShowDeleted: '0',
    Style: 'White',
    RowIndex: 'Line',
    RowIndexType: '8',
    RowIndexText: '',
    RowIndexWidth: '40',
    IdPrefix: 'temp#',
    NumberId: '1',
    IdChars: '0123456789',
    MaxWidth: '1',
    ColMoving: '0',
    Validate: 'All,Focus,Edit',
    MaxHeight: '300',
    MaxEditHeight: '300',
    InEditMode: 'OnDblClick',
    TabStop: '3',
    CDef: constants.stepTypes.tcStep,
    Selecting: '1',
    NoStyle: '1',
    CanCopyPaste: '0',
    CopyPasteInternal: '0',
    UpdateHeightsTimeout: '3',
    CopyPasteRows: '4',
    SelectClass: '1',
    CopyPasteTree: '0',
    PasteTree: '2',
    AcceptEnters: '2',
    ColAdding: '7',
    DynamicFormat: '1',
    MinRowHeight: '36',
    Editing: isReadOnly ? '0' : '1',
    Dragging: isReadOnly ? '0' : '1',
    SelectingSingle: '1',
    TestIds: '1',
  };
};

const getTreeGridCols = (isReadOnly) => {
  return [
    { Name: 'name', Size: '300', Type: 'Lines', RelWidth: '1' },
    { Name: 'description', Type: 'Lines', Size: '300', RelWidth: '1' },
    { Name: 'object', Type: 'Lines', Size: '300', RelWidth: '1' },
    { Name: 'action', Type: 'Lines', Size: '300', RelWidth: '1' },
    // { Name: "action", Type: "Lines", Size: "300", RelWidth:"1" },
    // { Name: "param1", Type: "Lines", RelWidth:"1" },
    // { Name: "param2", Type: "Lines", RelWidth:"1" },
    // { Name: "param3", Type: "Lines", RelWidth:"1" },
    {
      Name: 'addmenu',
      Type: 'Text',
      Disabled: isReadOnly ? 'true' : false,
    },
    {
      Name: 'deletemenu',
      Type: 'Text',
      Disabled: isReadOnly ? 'true' : false,
    },
    {
      Name: 'Panel',
      Visible: '0',
      Select: '0',
      Copy: '0',
      Delete: '1',
      Move: '0',
      PanelDeleteButtonIcon: addIcon,
    },
  ];
};

const getTreeGridAddMenu = () => {
  return {
    EnterSwitches: '0',
    CanFocus: '1',
    OnSave: ({ Value }) => window.addRow(Value),
    Items: [
      {
        Name: 'addTask',
        Value: constants.stepTypes.task,
        Icon: addIcon,
        Height: 18,
        Text: '&nbsp;Add Task',
      },
      {
        Name: 'addTaskStep',
        Value: constants.stepTypes.taskStep,
        Icon: addIcon,
        Height: 18,
        Text: '&nbsp;Add Task Step',
      },
    ],
  };
};

const getEmptyCellElement = (str) => `<span class="empty-cell-text">${str}</span>`;

const getTreeGridTemplate = (options) => {
  const { type, isReadOnly } = options;
  const isGridTypeTask = type === GRID_TYPES.TASK;
  const addMenu = getTreeGridAddMenu();
  return {
    Cfg: getTreeGridConfig(options),
    Cols: getTreeGridCols(isReadOnly),
    Def: [
      {
        Name: constants.stepTypes.tcStep,
        nameEmptyValue: getEmptyCellElement('TC Normal Step'),
        LineTip: 'Test case normal step',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        objectSuggestDelay: '100',
        actionEmptyValue: 'Action',
        rowType: constants.stepTypes.tcStep,
        PanelEmptyValue: '',
        Class: 'tc-step',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        // PanelVisible: "0",
        CanCopyPaste: '0',
        CanDrag: '0',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_TASK,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.task + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.tcIfStep,
        nameEmptyValue: getEmptyCellElement('TC IF Step - Container'),
        LineTip: 'If step',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.tcIfStep,
        Class: 'tc-if-step',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        // PanelVisible: "0",
        CanCopyPaste: '0',
        CanDrag: '0',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_TASK,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.task + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.tcEndIfStep,
        nameEmptyValue: getEmptyCellElement('TC End IF Step'),
        LineTip: 'End if step',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.tcEndIfStep,
        Class: 'tc-end-if-step',
        CanEdit: '0',
        Spanned: '1',
        CanCopyPaste: '0',
        objectCanEdit: '0',
        actionCanEdit: '0',
        CanDrag: '0',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_TASK,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.task + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.tcElseStep,
        nameEmptyValue: getEmptyCellElement('TC Else Step - Container'),
        LineTip: 'Else step',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.tcElseStep,
        Class: 'tc-else-step',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        PanelVisible: '0',
        CanCopyPaste: '0',
        CanDrag: '0',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_TASK,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.task + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.tcElseIfStep,
        nameEmptyValue: getEmptyCellElement('TC Else If Step - Container'),
        LineTip: 'Else if step',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.tcElseIfStep,
        Class: 'tc-else-if-step',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        PanelVisible: '0',
        CanCopyPaste: '0',
        CanDrag: '0',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_TASK,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.task + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.task,
        nameEmptyValue: getEmptyCellElement('Enter Task name'),
        LineTip: 'Task',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.task,
        Class: 'task',
        Spanned: '1',
        nameSpan: '3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && (!isGridTypeTask ? constants.tooltips.ADD_NEW_TASK_STEP : constants.tooltips.ADD_NEW_STEP),
        addmenuList: !isGridTypeTask && addMenu,
        addmenuAlign: 'Right',
        addmenuOnClickButton: isGridTypeTask && "window.addRow('" + constants.stepTypes.taskStep + "')",
        addmenuClass: 'add-menu',
        deletemenuType: 'Button',
        deletemenuButton: 'Button',
        deletemenuIcon: !isGridTypeTask && removeIcon,
        deletemenuClass: 'delete-menu',
        deletemenuTip: !isReadOnly && constants.tooltips.DELETE_TASK,
        deletemenuOnClickButton: !isGridTypeTask && 'window.Grids.deleteRow(Grid,Row)',
        nameType: 'Text',
        nameButton: 'Defaults',
        nameSuggestDelay: '100',
        CanCopyPaste: '0',
      },
      {
        Name: constants.stepTypes.taskIfStep,
        nameEmptyValue: getEmptyCellElement('Task If Container'),
        LineTip: 'Task if',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.taskIfStep,
        Class: 'task-if-step',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        CanCopyPaste: '0',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_STEP,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.taskStep + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
        CanDrag: '0',
      },
      {
        Name: constants.stepTypes.taskEndIfStep,
        nameEmptyValue: getEmptyCellElement('Task End If'),
        LineTip: 'Task end if',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.taskEndIfStep,
        Class: 'task-end-if-step',
        CanEdit: '0',
        CanCopyPaste: '0',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanDrag: '0',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_STEP,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.taskStep + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.taskElseStep,
        nameEmptyValue: getEmptyCellElement('Task Else Container'),
        LineTip: 'Task else',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.taskElseStep,
        Class: 'task-else-step',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        CanCopyPaste: '0',
        CanDrag: '0',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_STEP,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.taskStep + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.taskElseIfStep,
        nameEmptyValue: getEmptyCellElement('Task Else If Container'),
        LineTip: 'Task else if',
        descriptionEmptyValue: '',
        objectEmptyValue: '',
        actionEmptyValue: '',
        rowType: constants.stepTypes.taskElseIfStep,
        Class: 'task-else-if-step',
        actionCanEdit: '0',
        objectCanEdit: '0',
        CanEdit: '0',
        CanCopyPaste: '0',
        CanDrag: '0',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_STEP,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.taskStep + "')",
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
      },
      {
        Name: constants.stepTypes.taskStep,
        nameEmptyValue: getEmptyCellElement('Enter Task Step name'),
        LineTip: 'Task step',
        descriptionEmptyValue: getEmptyCellElement('Enter Task Step description'),
        objectEmptyValue: getEmptyCellElement('Select Object'),
        objectSuggestDelay: '100',
        rowType: constants.stepTypes.taskStep,
        Class: 'task-step',
        actionType: 'Text',
        actionLabel: 'Search Combo',
        actionButton: 'Defaults',
        actionSuggestType: 'existing, startall, empty',
        actionSuggest: '||Open Url|Sleep|Compare',
        actionSuggestValues: '||1|2|3',
        addmenuType: 'Button',
        addmenuButton: 'Button',
        addmenuIcon: addIcon,
        addmenuAlign: 'Right',
        addmenuClass: 'add-menu',
        addmenuTip: !isReadOnly && constants.tooltips.ADD_NEW_STEP,
        addmenuOnClickButton: "window.addRow('" + constants.stepTypes.taskStep + "')",
        deletemenuType: 'Button',
        deletemenuButton: 'Button',
        deletemenuIcon: removeIcon,
        deletemenuTip: !isReadOnly && constants.tooltips.DELETE_STEP,
        deletemenuClass: 'delete-menu',
        deletemenuOnClickButton: 'window.Grids.deleteRow(Grid,Row)',
        CanCopyPaste: '0',
      },
    ],
    Header: {
      Line: '',
      RowIndex: '',
      addmenuSpan: '2',
      Spanned: '1',
      name: 'Task / Step',
      description: 'Description / Expected Result',
      object: 'Object',
      action: 'Actions',
      addmenuType: 'Html',
      addmenu: '',
    },
    Toolbar: {
      Visible: '0',
    },
  };
};

/**
 * Create rows for test case conditional block child's
 * @param {*} parent
 * @param {*} allSteps
 */
function loadTcConditionBlock(rootParent, parent, allSteps) {
  const steps = allSteps.steps;
  const rows = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let row = [];
    if (step.type == constants.stepTypes.conditionIf) {
      row = getDefaultAttr(rootParent, step, 1);
      row.refId = allSteps.stepId;
      row.refUpdatedAt = allSteps.updatedAt;
      row.refName = allSteps.name;
      row.cbDescription = allSteps.description;
      const childs = getTcConditionChilds(allSteps, step);
      row.Items = childs;
    } else if (step.type == constants.stepTypes.conditionElseIf) {
      row = getDefaultAttr(rootParent, step, 1);
      const childs = getTcConditionChilds(allSteps, step);
      row.Items = childs;
    } else if (step.type == constants.stepTypes.conditionElse) {
      row = getDefaultAttr(rootParent, step, 1);
      const childs = getTcConditionChilds(allSteps, step);
      row.Items = childs;
    } else if (step.type == constants.stepTypes.conditionEnd) {
      row = getDefaultAttr(rootParent, step, 1);
    }
    parent.push(row);
  }
  return parent;
}
/**
 * Create rows for test case condition
 * @param {*} allSteps
 */
function getTcConditionChilds(parent, allSteps) {
  const steps = allSteps.steps;
  const rows = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let row = [];
    if (step.type == constants.stepTypes.step) {
      row = getDefaultAttr(allSteps, step, 1);
    } else if (step.type == constants.stepTypes.taskReference) {
      row = getTaskRefBlock(allSteps, step);
    }
    rows.push(row);
  }
  return rows;
}
/**
 * Create rows for taskreference childs
 * @param {*} allSteps
 */
function getTaskRefBlock(parent, allSteps) {
  const steps = allSteps.steps;
  let step = [];
  for (let i = 0; i < steps.length; i++) {
    step = getDefaultAttr(parent, steps[i]);
    step.refId = allSteps.stepId;
    step.refName = allSteps.name;
    step.refUpdatedAt = allSteps.updatedAt;
    const childs = getTaskChilds(steps[i]);
    step.Items = childs;
  }
  return step;
}
/**
 * Create rows for task childs
 * @param {*} allSteps
 */
function getTaskChilds(allSteps) {
  const steps = allSteps.steps;
  const rows = [];
  for (let i = 0; steps && i < steps.length; i++) {
    const step = steps[i];
    let row = [];
    if (step.type == constants.stepTypes.conditionBlock) {
      row = getTaskConditionBlock(allSteps, rows, step);
    } else if (step.type == constants.stepTypes.step) {
      row = getDefaultAttr(allSteps, step, 2);
      rows.push(row);
    }
  }
  return rows;
}
/**
 * Create rows for conditional task block
 * @param {*} parent
 * @param {*} allSteps
 */
function getTaskConditionBlock(rootParent, parent, allSteps) {
  const steps = allSteps.steps;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let row = [];
    if (step.type == constants.stepTypes.conditionIf) {
      row = getDefaultAttr(rootParent, step, 2);
      row.refId = allSteps.stepId;
      row.refUpdatedAt = allSteps.updatedAt;
      row.refName = allSteps.name;
      row.cbDescription = allSteps.description;
      const childs = getTaskConditionChilds(step);
      row.Items = childs;
    } else if (step.type == constants.stepTypes.conditionElseIf) {
      row = getDefaultAttr(rootParent, step, 2);
      const childs = getTaskConditionChilds(step);
      row.Items = childs;
    } else if (step.type == constants.stepTypes.conditionElse) {
      row = getDefaultAttr(rootParent, step, 2);
      const childs = getTaskConditionChilds(step);
      row.Items = childs;
    } else if (step.type == constants.stepTypes.conditionEnd) {
      row = getDefaultAttr(rootParent, step, 2);
    }
    parent.push(row);
  }
  return parent;
}
/**
 * Create rows for task  Conditional childs
 * @param {*} allSteps
 */
function getTaskConditionChilds(allSteps) {
  const steps = allSteps.steps;
  const rows = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let row = [];
    if (step.type == constants.stepTypes.step) {
      row = getDefaultAttr(allSteps, step, 2);
      // should be deleted if testing for conditional steps is successfull
      // row = getDefaultAttr(step, 3);
    }
    rows.push(row);
  }
  return rows;
}
/**
 * Return row definitions by row data
 * @param {*} rowData
 * @param {*} level
 */
function getDefaultAttr(parent, rowData, level) {
  const info = {};
  info.stepId = rowData.stepId;
  info.name = rowData.name;
  info.description = rowData.description;
  info.operation = 'noOperation';
  info.object = rowData.object && rowData.object.name;
  info.objectId = rowData.object && rowData.object.objectId;
  info.actionId = rowData.action && rowData.action.actionId ? rowData.action.actionId : '';
  info.updatedAt = rowData.updatedAt;
  info.nameEmptyValue = getEmptyCellElement(`Enter ${constants.stepTypeLabels[rowData.type]} name`);
  info.descriptionEmptyValue = rowData.type === constants.stepTypes.step ? getEmptyCellElement('Enter Task Step description') : '';
  info.Def = getRowDef(rowData, level);
  if (parent) {
    info.initialParent = parent.tcId ? { id: parent.tcId, type: 'testCase' } : { id: parent.stepId, type: parent.type };
  }
  // info.rowType = getRowDef(rowData, level);
  info.rowType = constants.stepTypes[rowData.type];
  return info;
}

/**
 * Get row definition type by row type
 * @param {*} row
 * @param {*} level
 */

function getRowDef(row, level) {
  if (row.type == constants.stepTypes.step && level == 1) {
    return constants.stepTypes.tcStep;
  } else if (row.type == constants.stepTypes.task) {
    return constants.stepTypes.task;
  } else if (row.type == constants.stepTypes.step && level == 2) {
    return constants.stepTypes.taskStep;
  } else if (row.type == constants.stepTypes.step && level == 3) {
    return constants.stepTypes.taskIfStep;
  } else if (row.type == constants.stepTypes.conditionIf && level == 1) {
    return constants.stepTypes.tcIfStep;
  } else if (row.type == constants.stepTypes.conditionEnd && level == 1) {
    return constants.stepTypes.tcEndIfStep;
  } else if (row.type == constants.stepTypes.conditionElseIf && level == 1) {
    return constants.stepTypes.tcElseIfStep;
  } else if (row.type == constants.stepTypes.conditionElse && level == 1) {
    return constants.stepTypes.tcElseStep;
  } else if (row.type == constants.stepTypes.conditionIf && level == 2) {
    return constants.stepTypes.taskIfStep;
  } else if (row.type == constants.stepTypes.conditionEnd && level == 2) {
    return constants.stepTypes.taskEndIfStep;
  } else if (row.type == constants.stepTypes.conditionElseIf && level == 2) {
    return constants.stepTypes.taskElseIfStep;
  } else if (row.type == constants.stepTypes.conditionElse && level == 2) {
    return constants.stepTypes.taskElseStep;
  }
}
