export interface ABCDMetrics {
  asymmetry: number;
  border: number;
  color: number;
  diameter: number;
}

export function analyzeABCD(canvas: HTMLCanvasElement): ABCDMetrics {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { asymmetry: 15, border: 15, color: 15, diameter: 5 };
  }
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const width = canvas.width;
  const height = canvas.height;

  // 1. Asymmetry (A)
  let diffCount = 0;
  let totalDiff = 0;
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width / 2; x += 4) {
      const idx1 = (y * width + x) * 4;
      const idx2 = (y * width + (width - 1 - x)) * 4;
      
      const rDiff = Math.abs(data[idx1] - data[idx2]);
      const gDiff = Math.abs(data[idx1 + 1] - data[idx2 + 1]);
      const bDiff = Math.abs(data[idx1 + 2] - data[idx2 + 2]);
      
      totalDiff += (rDiff + gDiff + bDiff) / 3;
      diffCount++;
    }
  }
  const asymmetry = Math.min(Math.round((totalDiff / diffCount / 255) * 100 * 2.5), 100);

  // 2. Color Variegation (C)
  let rSum = 0, gSum = 0, bSum = 0;
  let colorCount = 0;
  const cStart = Math.floor(width * 0.25);
  const cEnd = Math.floor(width * 0.75);
  
  for (let y = cStart; y < cEnd; y += 2) {
    for (let x = cStart; x < cEnd; x += 2) {
      const idx = (y * width + x) * 4;
      rSum += data[idx];
      gSum += data[idx + 1];
      bSum += data[idx + 2];
      colorCount++;
    }
  }
  const rMean = rSum / colorCount;
  const gMean = gSum / colorCount;
  const bMean = bSum / colorCount;
  
  let rVar = 0, gVar = 0, bVar = 0;
  for (let y = cStart; y < cEnd; y += 2) {
    for (let x = cStart; x < cEnd; x += 2) {
      const idx = (y * width + x) * 4;
      rVar += Math.pow(data[idx] - rMean, 2);
      gVar += Math.pow(data[idx + 1] - gMean, 2);
      bVar += Math.pow(data[idx + 2] - bMean, 2);
    }
  }
  const stdDev = Math.sqrt((rVar + gVar + bVar) / (3 * colorCount));
  const color = Math.min(Math.round((stdDev / 128) * 100), 100);

  // 3. Border Irregularity (B)
  let gradientSum = 0;
  let gradCount = 0;
  for (let y = cStart; y < cEnd - 1; y += 2) {
    for (let x = cStart; x < cEnd - 1; x += 2) {
      const idx = (y * width + x) * 4;
      const idxRight = (y * width + (x + 1)) * 4;
      const idxDown = ((y + 1) * width + x) * 4;
      
      const val = (data[idx] + data[idx+1] + data[idx+2]) / 3;
      const valRight = (data[idxRight] + data[idxRight+1] + data[idxRight+2]) / 3;
      const valDown = (data[idxDown] + data[idxDown+1] + data[idxDown+2]) / 3;
      
      gradientSum += Math.abs(val - valRight) + Math.abs(val - valDown);
      gradCount += 2;
    }
  }
  const avgGrad = gradientSum / gradCount;
  const border = Math.min(Math.round((avgGrad / 128) * 100 * 5), 100);

  // 4. Diameter Estimation (D)
  let darkPixelCount = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
      if (brightness < 120) {
        darkPixelCount++;
      }
    }
  }
  const totalPixels = (width * height) / 4;
  const diameter = Math.min(Math.round((darkPixelCount / totalPixels) * 100 * 2), 100);

  return {
    asymmetry: Math.max(5, asymmetry),
    border: Math.max(5, border),
    color: Math.max(5, color),
    diameter: Math.max(2, diameter),
  };
}
