/* eslint-disable no-control-regex */
export function toUnicode(str: string) {
  return str.replace(/[^\u0000-\u007F]/g, function (c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  });
}
