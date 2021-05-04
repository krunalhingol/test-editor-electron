export const testCaseConstants = {
  TEST_CASE_NAME_CHAR_LIMIT: 300,
  TEST_CASE_DESCRIPTION_CHAR_LIMIT: 300,
  ADD_TEST_CASE_MESSAGE: "Select a test case from the left pane or click '+' icon to create new test case.",
  ADD_TASK_MESSAGE: "Click '+' icon to create new Task",
  SHARE_FOR_AUTOMATION: 'Share for Automation',
  SHARED_FOR_AUTOMATION: 'Shared for Automation',
  NO_PRIVILEGE_TO_EDIT_TEST_CASE: 'Test Case cannot be edited as you do not have edit test case privilege.',
  NO_OWNERSHIP_TO_EDIT_TEST_CASE: "Test Case cannot be edited as it's ownership resides with Qualitia Automation Studio.",
  TEST_CASE_UPDATED_BY_OTHER_USER: 'Reloading latest data of this test case. It has been updated by someone else.',
  TASK_UPDATED_BY_OTHER_USER: 'Reloading latest data of this task. It has been updated by someone else.',
  NO_TEST_CASES_UNDER_SELECTED_STORY: 'No test case(s) are available in this story.',
  WANT_TO_CONTINUE: 'Are you sure you want to continue?',
  successMessage: {
    SAVE_TEST_CASE_SUCCESS: 'Test case saved successfully.',
    SAVE_TEST_CASE_WITHOUT_FILTER: 'Test case is successfully saved. To view this test case select appropriate filters.',
    SAVE_TASK_SUCCESS: 'Task saved successfully.',
    UPDATE_TEST_CASE_SUCCESS: 'Test case updated successfully.',
    DELETE_TEST_CASE_SUCCESS: 'Test case deleted successfully.',
    CLONE_TEST_CASE_WITHOUT_FILTER: 'Test case cloned and saved successfully. To view this test case select appropriate filters.',
    CLONE_TEST_CASE: 'Test case is cloned and saved successfully.',
    TASK_LOCK: 'Task locked successfully.',
    TEST_CASE_LOCK: 'Test case locked successfully.',
    TEST_CASE_AND_TASK_LOCK: 'Test case and task locked successfully.',
    RELEASE_LOCK: 'Lock released successfully.',
    SHARE_TEST_CASE_FOR_AUTOMATION: 'Test Case is successfully shared for Automation.',
    PUBLISH_TASK_SUCCESS: 'Task is successfully shared for Automation.',
    CLONE_TASK_SUCCESS: 'Task cloned and saved successfully.',
    DELETE_TASK_SUCCESS: 'Task deleted Successfully.',
  },
  errorMessage: {
    TEST_CASE_NAaaME_REQUIRED: 'Enter Test Case name.',
    TEST_CASE_NAME_DUPLICATE: 'Test Case with same name already exists.',
    TEST_CASE_NAME_INVALID: 'Name can contain up to 300 characters.',
    TEST_CASE_DESCRIPTION_INVALID: 'Description can contain up to 300 characters.',
    SAVE_TEST_CASE_ERROR: 'Error encountered while saving Test Case. Try again.',
    SAVE_TASK_CASE_ERROR: 'Error encountered while saving Task. Try again',
    CLONE_TASK_ERROR_MESSAGE: 'Task with same name already exist in the project.',
    UPDATE_TEST_CASE_ERROR: 'Error encountered while updating Test Case. Try again.',
    TEST_CASE_NAME_ALREADY_EXISTS: 'Test Case with same name already exists. ',
    TASK_NAME_ALREADY_EXISTS: 'Task with same name already exists. ',
    DELETE_TEST_CASE_ERROR: 'Error encountered while deleting Test Case. Try again.',
    GET_ENTITY_TYPES_MSG: 'Error occurred while fetching JIRA issue types.',
    INCOMPLETE_PROJECT_SETUP: 'Project setup is not complete. Please contact the project manager to complete the project setup.',
    INCOMPLETE_PROJECT_SETUP_MANAGER: 'Project Setup is incomplete, to complete the Project Setup please ',
    GET_ISSUES_MSG: 'ErrMANAGE_REVIEWor occurred while fetching JIRA issues.',
    NO_TEST_CASES: 'No Test Cases Found for this story.',
    GET_TEST_CASE_MSG: 'Error occurred while getting Test Case.',
    GET_TASK_MSG: 'Error occurred while getting Task.',
    GET_ORPHAN_STORIES_MSG: 'Error occurred while getting Orphan issues.',
    DELETE_TEST_CASE: 'Error occurred while deleting the Test Case.',
    CLONE_TEST_CASE: 'Error occurred while cloning the Test Case.',
    TASK_LOCK: 'Error occurred while locking the task.',
    TEST_CASE_LOCK: 'Error occurred while locking the test case.',
    RELEASE_LOCK: 'Error occurred while releasing test case lock. No other user can modify the test case unless you release the lock. ',
    SHARE_TEST_CASE_FOR_AUTOMATION: 'Error occurred while sharing the Test Case for Automation.',
    OBJECT_ACTION_NOT_ALLOWED: 'You cannot change the object of this step. It has been assigned with an action in Automation Studio.',
    PUBLISH_TASK_CASE_ERROR: 'Error occurred while sharing Task For Automation.',
    CLONE_TASK_ERROR: 'Error occurred while cloning Task.',
    DELETE_TASK_ERROR: 'Error occurred while deleting Task.',
    gotoLineNotAvailable: (rowNumber) => `Row Number ${rowNumber} does not exist.`,
  },
  sharedForAutomationTooltip: {
    DISABLE_MESSAGE: "Test Case can not be shared for Automation as user story isn't approved by reviewers",
    ENABLE_MESSAGE: 'Share test case with automation studio',
  },
};
