export async function resizeImageTo224(base64Str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2d context"));
        return;
      }
      ctx.drawImage(img, 0, 0, 224, 224);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
}
