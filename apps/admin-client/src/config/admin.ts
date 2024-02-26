/**
 * @see https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-title-case-text
 */
export function modelDisplayName(modelName: string): string {
  const text = modelName.replace(/([A-Z])/g, ' $1');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export type SelectOption = { label: string; value: string };

// export function getRecordDisplayName(modelName: string, record: any): string {
//   const model = getModel(modelName);
//   return model.getDisplayName(record) as string;
// }

export function collectionUrl(modelName: string) {
  return `/models/${modelName}`;
}

export function showUrl(modelName: string, record: any) {
  return `/models/${modelName}/${record.id}`;
}

export function createUrl(modelName: string) {
  return `/models/${modelName}/new`;
}

export function editUrl(modelName: string, record: any) {
  return `/models/${modelName}/${record.id}/edit`;
}

export function deleteUrl(modelName: string, record: any) {
  return `/models/${modelName}/${record.id}/delete`;
}

export function deleteRecord(modelName: string, record: any) {
  fetch('/admin/api/delete', {
    method: 'POST',
    body: JSON.stringify({
      modelName,
      id: record.id,
    }),
  });
}
