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

export async function multipleImageUpload(files: any[]) {
  if (files.length === 0) {
    throw new HttpException('파일이 존재하지 않습니다', 400);
  }

  // 병렬 요청을 최적화하기 위해 배치 처리
  const chunkSize = 10; // 한 번에 업로드할 파일의 개수
  const chunkedFiles = [];

  for (let i = 0; i < files.length; i += chunkSize) {
    chunkedFiles.push(files.slice(i, i + chunkSize));
  }

  const uploadResults = [];

  for (const fileChunk of chunkedFiles) {
    const chunkResults = await Promise.all(
      fileChunk.map(async (file: File) => {
        try {
          return await imageUpload(file);
        } catch (error) {
          return { success: false, error: error.message };
        }
      }),
    );

    uploadResults.push(...chunkResults);
  }

  // 실패한 파일들을 처리
  const failedUploads = uploadResults.filter((result) => !result.success);

  if (failedUploads.length > 0) {
    throw new HttpException('일부 파일 업로드에 실패했습니다', 500);
  }

  return {
    success: true,
    images_url: uploadResults.map((result) => result.profile_image),
  };
}
