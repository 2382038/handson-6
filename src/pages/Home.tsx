import React from 'react';

const Home = () => {
  return (
    <div 
      className="flex items-center justify-center h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://source.unsplash.com/1920x1080/?mountain')" }}
    >
      <div className="bg-[#403D94] bg-opacity-50 p-6 rounded-xl text-center">
        <h1 className="text-5xl font-bold mb-4">Hello, Welcome to My Web!</h1>
        <h2 className="text-4xl font-bold">Aimee Kayla Miracle Simbolon</h2>
        <p className="text-lg mt-2">2382038</p>
        <p className="text-lg">Pemrograman WEB II</p>
      </div>
    </div>
  );
};

export default Home;
