/*
 * Define row types, row block combinations
 * allowed child's and siblings for each row type
 */
export const stepTypes = {
  tcStep: 'tcStep',
  step: 'step',
  task: 'task',
  tcIfStep: 'tcIfStep',
  tcElseStep: 'tcElseStep',
  tcElseIfStep: 'tcElseIfStep',
  tcEndIfStep: 'tcEndIfStep',
  taskReference: 'taskReference',
  taskStep: 'taskStep',
  taskIfStep: 'taskIfStep',
  taskElseStep: 'taskElseStep',
  taskElseIfStep: 'taskElseIfStep',
  taskEndIfStep: 'taskEndIfStep',
  conditionBlock: 'conditionBlock',
  conditionIf: 'conditionIf',
  conditionElseIf: 'conditionElseIf',
  conditionElse: 'conditionElse',
  conditionEnd: 'conditionEnd',
};

export const tooltips = {
  ADD_NEW_TASK: 'Add new task (Alt+T)',
  ADD_NEW_STEP: 'Add new step (Alt+I / Insert)',
  ADD_NEW_TASK_STEP: 'Add new task/step',
  DELETE_TASK: 'Delete task (Alt+Delete)',
  DELETE_STEP: 'Delete step (Alt+Delete)',
};

export const tcLevelRows = [stepTypes.tcStep, stepTypes.tcIfStep, stepTypes.tcElseIfStep, stepTypes.tcElseStep, stepTypes.tcEndIfStep];

export const rowBlockCombinations = {
  task: stepTypes.taskStep,
  tcIfStep: stepTypes.tcEndIfStep,
  taskIfStep: stepTypes.taskEndIfStep,
  conditionIf: stepTypes.conditionEnd,
};

export const asyncStatusCodes = {
  done: 'done',
  pending: 'pending',
};

export const stepTypeLabels = {
  tcStep: 'Step',
  step: 'Task Step',
  task: 'Task',
  tcIfStep: 'condition IF',
  tcElseStep: 'condition Else',
  tcElseIfStep: 'condition Else IF',
  tcEndIfStep: 'condition End',
  taskStep: 'Task Step',
  taskIfStep: 'condition IF',
  taskElseStep: 'condition Else',
  taskElseIfStep: 'condition Else IF',
  taskEndIfStep: 'condition End',
  conditionIf: 'condition If',
  conditionElseIf: 'condition ElseIf',
  conditionElse: 'condition Else',
  conditionEnd: 'condition End',
};

export const operations = {
  create: 'create',
  update: 'update',
  delete: 'delete',
  noOperation: 'noOperation',
  move: 'move',
};

export const rowTypes = {
  root: {
    name: 'TC',
    allowChildren: [stepTypes.tcStep, stepTypes.task, stepTypes.tcIfStep],
    allowSibling: [],
  },
  tcStep: {
    name: 'TC Step',
    allowChildren: [],
    allowSibling: [stepTypes.tcStep, stepTypes.task, stepTypes.tcIfStep],
  },
  tcIfStep: {
    name: 'TC if',
    allowChildren: [stepTypes.tcStep, stepTypes.task],
    allowSibling: [stepTypes.tcIfStep, stepTypes.tcElseStep, stepTypes.tcElseIfStep, stepTypes.task],
  },
  tcElseStep: {
    name: 'TC else',
    allowChildren: [stepTypes.tcStep, stepTypes.task],
    allowSibling: [stepTypes.task],
  },
  tcElseIfStep: {
    name: 'TC else',
    allowChildren: [stepTypes.tcStep, stepTypes.task],
    allowSibling: [stepTypes.tcElseStep, stepTypes.task],
  },
  tcEndIfStep: {
    name: 'TC if',
    allowChildren: [],
    allowSibling: [stepTypes.tcStep, stepTypes.task, stepTypes.tcIfStep],
  },
  task: {
    name: 'Task',
    allowChildren: [stepTypes.taskStep, stepTypes.taskIfStep, stepTypes.taskElseStep, stepTypes.taskElseIfStep],
    allowSibling: [stepTypes.taskStep, stepTypes.tcStep, stepTypes.tcIfStep, stepTypes.task],
  },
  taskIfStep: {
    name: 'Task if',
    allowChildren: [stepTypes.taskStep],
    allowSibling: [stepTypes.taskElseStep, stepTypes.taskStep, stepTypes.taskElseIfStep],
  },
  taskElseStep: {
    name: 'Task else',
    allowChildren: [stepTypes.taskStep],
    allowSibling: [stepTypes.taskElseIfStep, stepTypes.taskIfStep],
  },
  taskElseIfStep: {
    name: 'Task else',
    allowChildren: [stepTypes.taskStep],
    allowSibling: [stepTypes.taskElseStep, stepTypes.taskIfStep],
  },
  taskEndIfStep: {
    name: 'TC if',
    allowChildren: [],
    allowSibling: [stepTypes.taskStep, stepTypes.taskIfStep, stepTypes.taskElseStep, stepTypes.taskElseIfStep],
  },
  taskStep: {
    name: 'Task Step',
    allowChildren: [],
    allowSibling: [stepTypes.taskStep, stepTypes.taskIfStep],
  },
};

export const GRID_TYPES = {
  TEST_CASE: 'TestCase',
  TASK: 'Task',
};
