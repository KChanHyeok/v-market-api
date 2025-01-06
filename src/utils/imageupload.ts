import { HttpException } from '@nestjs/common';

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function imageUpload(file: any) {
  const { success, result } = await getUploadUrl();

  if (success) {
    const { id, uploadURL } = result;
    if (!file) {
      throw new HttpException('파일이 존재 하지 않습니다', 401);
    }
    const cloudflareForm = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });

    cloudflareForm.append('file', blob, file.originalname);
    const response = await fetch(uploadURL, {
      method: 'POST',
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      throw new HttpException('업로드 실패', response.status);
    }
    return {
      success: true,
      profile_image: `https://imagedelivery.net/afl0oSwYy5bcInHa7uXGQg/${id}/public`,
    };
  }
}
