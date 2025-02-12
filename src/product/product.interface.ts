export interface ProductInsert {
  user_id: string;
  product_title: string;
  product_img_key: string;
  product_memo: string;
  product_price: number;
}

export interface productUpdate {
  product_id: number;
  user_id: string;
  product_title?: string;
  product_memo?: string;
  product_price?: number;
}

export interface productDelete {
  product_id: number;
  user_id: string;
}
