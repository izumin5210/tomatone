/* @flow */

export function parseCategory (name: string) {
  return name.split('/').filter(n => n.length > 0)
}

export function parseTaskCategory (
  title: string,
): {
  categoryNames: Array<string>,
  taskTitle: string,
} {
  const categoryNames = parseCategory(title)
  const taskTitle = categoryNames.pop()
  return {
    categoryNames,
    taskTitle,
  }
}
