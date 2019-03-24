// import { API_LOGIN } from 'constant/API';
// import rest from 'utils/restUtil';

export const login = async (params) => {
  // return await rest.post(API_LOGIN, { params });
  return { state: params.password === '123456' ? 200 : 500, data: params };
};
