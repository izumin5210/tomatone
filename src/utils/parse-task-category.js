/* @flow */

export default function parseTaskCategory(
  title: string,
): {
  categoryNames: Array<string>,
  taskTitle: string,
} {
  const categoryNames = title.split("/");
  const taskTitle = categoryNames.pop();
  return {
    categoryNames,
    taskTitle,
  };
}
