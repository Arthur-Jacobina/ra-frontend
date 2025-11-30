// https://stackoverflow.com/a/13924997/3670829
export const textMaxLines = (maxLines: number, lineHeight: number, adjustment = 0) => `
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${maxLines};
  line-height: ${lineHeight}px;
  max-height: ${lineHeight * maxLines + adjustment}px;
  margin: 0;
`;

export const focusStyles = '';
// 'focus-within:ring-offset-1 focus-within:ring-inset focus-within:ring-primary/50 focus-within:ring-2';
