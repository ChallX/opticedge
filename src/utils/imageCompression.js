export const compressImage = (file, maxWidth = 600) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const ratio = maxWidth / img.width;
        // Don't upscale if the image is already small
        const scaleSize = ratio < 1 ? ratio : 1; 
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // compress with quality 0.7 for optimal storage
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
