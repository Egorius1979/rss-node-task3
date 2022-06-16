export const getUserId = (url: string) => {
  return url?.split('/').filter((it) => it)[2];
};
