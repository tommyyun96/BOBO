import Cookies from 'universal-cookie';

var cookies = new Cookies();

export const getLoginId = () => {
  return cookies.get("LOGIN_ID");
}

export const getLoginName = () => {
  return cookies.get("LOGIN_NAME");
}

export const setLoginId = (id) => {
  cookies.set("LOGIN_ID", id);
}

export const setLoginName = (name) => {
  cookies.set("LOGIN_NAME", name);
}

export const checkLogin = () => {
  // console.log('aaa');
  // console.log(cookies.get("LOGIN_ID"));
  if(!cookies.get("LOGIN_ID"))
    window.location.replace("/BOBO/#/");
}

export function logout() {
  cookies.remove("LOGIN_ID");
  // console.log(cookies.get("LOGIN_ID"));
}