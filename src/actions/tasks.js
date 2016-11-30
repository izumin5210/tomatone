import { Task } from "../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export const ACTION_TASKS_GET       = "task:getall";
export const ACTION_TASK_CREATE     = "task:create";
export const ACTION_TASK_UPDATE     = "task:udpate";
export const ACTION_TASK_COMPLETE   = "task:complete";
export const ACTION_TASK_INCOMPLETE = "task:incomplete";
export const ACTION_TASK_SELECT     = "task:select";
/* eslint-enable */

export type CreateTaskAction = {
  title: string;
};

export type UpdateTaskAction = {
  task: Task;
};

export type CompleteTaskAction = {
  task: Task;
}

export type IncompleteTaskAction = {
  task: Task;
}

export type SelectTaskAction = {
  task: ?Task;
};
