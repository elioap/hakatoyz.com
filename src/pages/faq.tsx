import React from 'react';
import Head from 'next/head';

const FAQPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>常见问题 - Haka Toyz</title>
        <meta name="description" content="Haka Toyz的常见问题解答" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">常见问题</h1>
        {/* 这里添加FAQ页面的内容 */}
      </div>
    </>
  );
};

export default FAQPage; 