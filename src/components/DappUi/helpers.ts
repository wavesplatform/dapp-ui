export const isList = (type: string) => type.startsWith('List');
export const isUnion = (type: string) => type.includes('|') && !isList(type);
