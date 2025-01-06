export interface userDelete {
  id: string;
}
export interface userUpdate {
  id?: string;
  user_name?: string;
  phone?: string;
  profile_image?: string;
  account_number?: string;
  change_date: Date;
  // 추가사항
}
