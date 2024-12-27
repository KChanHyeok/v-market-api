export type Login = {
  email: string;
  user_pwd: string;
};

export type CreateUser = {
  email: string;
  user_pwd: string;
  user_name: string;
  refresh_token: string;
  phone: string;
  goo_token: string;
  kakao_token?: string;
  account_number?: string;
};
