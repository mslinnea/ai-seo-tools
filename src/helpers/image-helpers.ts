const mimeTypes = new Map<string, string>([
  ['png', 'image/png'],
  ['gif', 'image/gif'],
  ['avif', 'image/avif'],
  ['webp', 'image/webp'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
]);

export function getMimeType(url: string) : string {
  const extension = url.split('.').pop()?.toLowerCase() ?? '';
  return mimeTypes.get(extension) ?? 'image/jpeg';
}

export async function getBase64Image(url:string) : Promise<string> {
  if (url.startsWith('http:')) {
      url = url.replace('http:', 'https:');
  }
  const data : Response = await fetch(url);
  const blob: Blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data : string | ArrayBuffer | null = reader.result;
      if (typeof base64data === 'string') {
        resolve(base64data);
      } else {
        reject(new Error('Failed to convert blob to base64 string.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('FileReader failed to read the blob.'));
    };
  });
}
