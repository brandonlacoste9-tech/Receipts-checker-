import html2canvas from 'html2canvas';

export const generateShareableCard = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0D0F1A',
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating shareable card:', error);
    throw error;
  }
};

export const downloadImage = (dataUrl: string, filename: string = 'receipt-report.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

export const shareToTwitter = (text: string, url: string = window.location.href) => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
};
