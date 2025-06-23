import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }

  try {
    // 簡化的上傳處理 - 返回建議的文件名
    const { filename, folder } = req.body;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    // 生成建議的文件名
    const timestamp = Date.now();
    const suggestedName = `product_${timestamp}_${filename}`;
    const url = `/images/${suggestedName}`;

    // 在實際應用中，這裡會處理實際的文件上傳
    // 現在我們只返回建議的URL，用戶需要手動放置文件
    
    res.status(200).json({
      success: true,
      message: 'Filename generated successfully. Please manually place the file in /public/images/',
      url: url,
      filename: suggestedName,
      instructions: `請將您的圖片重命名為 "${suggestedName}" 並放置到 /public/images/ 目錄下`
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 