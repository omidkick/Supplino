const getUrlExtension = (url) => {
  // ✅ Add validation to ensure url is a string
  if (!url || typeof url !== 'string') {
    console.error('getUrlExtension: Invalid URL provided:', url);
    return '';
  }
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

const getFilename = (url) => {
  // ✅ Add validation to ensure url is a string
  if (!url || typeof url !== 'string') {
    console.error('getFilename: Invalid URL provided:', url);
    return 'unknown-file';
  }
  return url.split("/").pop();
};

export const imageUrlToFile = async (imgUrl) => {
  try {
    // ✅ Validate input
    if (!imgUrl || typeof imgUrl !== 'string') {
      throw new Error('Invalid image URL provided');
    }

    // ✅ Check if the URL is valid
    const url = new URL(imgUrl);
    
    const response = await fetch(imgUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const filename = getFilename(imgUrl);
    
    const file = new File([blob], filename, {
      type: blob.type,
    });
    
    return file;
  } catch (error) {
    console.error('Error converting image URL to file:', error);
    // ✅ Return a placeholder or rethrow based on your needs
    throw error;
  }
};