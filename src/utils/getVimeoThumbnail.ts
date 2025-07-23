export const getVimeoThumbnail = async (vimeoId: string): Promise<string> => {
  const response = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`);
  const data = await response.json();
  return data[0].thumbnail_large;
};
