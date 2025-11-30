import { decodeJwt } from 'jose';

export const isTokenExpired = (token?: string): boolean => {
  const tokenData = token && decodeJwt(token);
  return !tokenData || (!!tokenData.exp && tokenData.exp < Date.now() / 1000);
};

export const isTokenAboutToExpire = (token?: string): boolean => {
  const tokenData = token && decodeJwt(token);
  return !!tokenData && !!tokenData.exp && tokenData.exp < Date.now() / 1000 + 300;
};
