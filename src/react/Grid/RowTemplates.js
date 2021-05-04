const constants = require('./RowDef');
export const bodyTemplate = [
  {
    name: '',
    id: 'temp#1',
    description: '',
    op: 'CREATE',
    sdOp: 'CREATE',
    Def: constants.stepTypes.task,
    operation: constants.operations.create,
    Added: '1',
    Items: [
      {
        name: '',
        id: 'temp#2',
        description: '',
        op: 'CREATE',
        sdOp: 'CREATE',
        Def: constants.stepTypes.taskStep,
        operation: constants.operations.create,
        Added: '1',
      },
    ],
  },
];

export const rowTemplate1 = [
  {
    name: 'Dummy TC IF Step',
    description: 'Dummy TC IF Step',
    rowType: 'tcIfStep',
    items: [
      {
        name: 'Dummy Task',
        rowType: 'task',
        items: [
          {
            name: 'Dummy Task IF',
            description: 'Dummy Task IF',
            rowType: 'taskIfStep',
            items: [
              {
                name: 'Dummy Task Step 1',
                description: 'Dummy Task Step 1',
                object: 'Item2',
                rowType: 'taskStep',
                action: 'Sleep',
              },
              {
                name: 'Dummy Task Step 2',
                description: 'Dummy Task Step 2',
                object: 'Item3',
                rowType: 'taskStep',
                action: 'Open Url',
              },
            ],
          },
          {
            name: 'Dummy task end IF',
            rowType: 'taskEndIfStep',
          },
        ],
      },
    ],
  },
  {
    name: 'Dummy TC END IF Step',
    rowType: 'tcEndIfStep',
  },
];
export const rowTemplate2 = [
  {
    name: 'Dummy Task',
    description: 'Dummy Task',
    rowType: 'task',
    items: [
      {
        name: 'Dummy Task IF',
        description: 'Dummy Task IF',
        rowType: 'taskIfStep',
        items: [
          {
            name: 'Dummy Task STEP 1',
            description: 'Dummy Task STEP 1',
            object: 'Item3',
            action: '3',
            rowType: 'taskStep',
          },
          {
            name: 'Dummy Task STEP 2',
            description: 'Dummy Task STEP 2',
            object: 'Item1',
            action: '1',
            rowType: 'taskStep',
          },
        ],
      },
      {
        name: 'Dummy Task ELSE IF',
        description: 'Dummy Task ELSE IF',
        rowType: 'taskElseIfStep',
        items: [
          {
            name: 'Dummy Task STEP 1',
            description: 'Dummy Task STEP 1',
            object: 'Item3',
            action: '3',
            rowType: 'taskStep',
          },
        ],
      },
      {
        name: 'Dummy Task ELSE',
        description: 'Dummy Task ELSE',
        rowType: 'taskElseStep',
        items: [
          {
            name: 'Dummy Task STEP 1',
            description: 'Dummy Task STEP 1',
            object: 'Item3',
            action: '3',
            rowType: 'taskStep',
          },
        ],
      },
      {
        name: 'Dummy Task END IF',
        rowType: 'taskEndIfStep',
      },
    ],
  },
];

export const convertIntoTreeGridBody = (brSdMapping) => {
  const Body = [];

  for (let i = 0; i < brSdMapping.length; i++) {
    const stepDefCollection = {};
    Body.push(stepDefCollection);

    stepDefCollection.id = brSdMapping[i]['id'];
    stepDefCollection.key = brSdMapping[i]['key'];
    stepDefCollection.brId = brSdMapping[i]['brId'];
    stepDefCollection.previousId = brSdMapping[i]['previousId'];
    stepDefCollection.deleted = brSdMapping[i]['deleted'];
    stepDefCollection.createdBy = brSdMapping[i]['createdBy'];
    stepDefCollection.updatedBy = brSdMapping[i]['updatedBy'];
    stepDefCollection.createdOn = brSdMapping[i]['createdOn'];
    stepDefCollection.updatedOn = brSdMapping[i]['updatedOn'];

    const outerSD = brSdMapping[i].sd;
    stepDefCollection.sdId = outerSD['id'];
    stepDefCollection.name = outerSD['name'];
    stepDefCollection.description = outerSD['description'];
    stepDefCollection.expectedBehavior = outerSD['expectedBehavior'];
    stepDefCollection.outerSDDeleted = outerSD['deleted'];
    stepDefCollection.reusedStatus = outerSD['reusedStatus'];
    stepDefCollection.type = outerSD['type'];
    stepDefCollection.outerSDCreatedBy = outerSD['createdBy'];
    stepDefCollection.outerSDUpdatedBy = outerSD['updatedBy'];
    stepDefCollection.outerSDCreatedOn = outerSD['createdOn'];
    stepDefCollection.outerSDUpdatedOn = outerSD['updatedOn'];

    stepDefCollection.Items = [];
    for (let j = 0; j < outerSD.sdMapping.length; j++) {
      const stepDef = {};
      stepDefCollection.Items.push(stepDef);

      const sdMapping = outerSD.sdMapping[j];
      stepDef.id = sdMapping['id'];
      stepDef.parentSdId = sdMapping['parentSdId'];
      stepDef.previousId = sdMapping['previousId'];
      stepDef.deleted = sdMapping['deleted'];
      stepDef.createdBy = sdMapping['createdBy'];
      stepDef.updatedBy = sdMapping['updatedBy'];
      stepDef.createdOn = sdMapping['createdOn'];
      stepDef.updatedOn = sdMapping['updatedOn'];

      const innerSD = outerSD.sdMapping[j].sd;
      stepDef.sdId = innerSD['id'];
      stepDef.name = innerSD['name'];
      stepDef.description = innerSD['description'];
      stepDef.expectedBehavior = innerSD['expectedBehavior'];
      stepDef.innerSDDeleted = innerSD['deleted'];
      stepDef.reusedStatus = innerSD['reusedStatus'];
      stepDef.type = innerSD['type'];
      stepDef.innerSDCreatedBy = innerSD['createdBy'];
      stepDef.innerSDUpdatedBy = innerSD['updatedBy'];
      stepDef.innerSDCreatedOn = innerSD['createdOn'];
      stepDef.innerSDUpdatedOn = innerSD['updatedOn'];

      // This is to restrict adding any child node under this node
      stepDef.CDef = '';
      stepDef.AcceptDef = '';
    }
  }

  return Body;
};
