'use client';

import axios from 'axios';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Nvidia = () => {
  const [text, setText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState(null);

  const invokeUrl = 'http://localhost:1121/generate-our-image-brotha';

  const generateImage = async () => {
    const payload = {
      text_prompts: [
        { text, weight: 1 },
        { text: '', weight: -1 },
      ],
      cfg_scale: 5,
      sampler: 'K_EULER_ANCESTRAL',
      seed: 0,
      steps: 25,
    };

    try {
      setGenerating(true);
      setImage(null);
      const res = await axios.post(invokeUrl, payload);
      const imageData = res.data.artifacts[0].base64;
      setImage(`data:image/jpeg;base64,${imageData}`);
    } catch (error) {
      console.error('Error generating image: ', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative ${inter.className}`}>
      
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 text-white p-4">
        <div className="container mx-auto text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold">Prompt To Image Generator</h1>
        </div>
      </header>

      {/* Dashboard Button in the top right corner */}
      <div className="absolute top-4 right-4">
        <Link href="https://visual-ai-flax.vercel.app/dashboard/" passHref legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold shadow-md transition-all text-sm border border-purple-300"
          >
            Dashboard
          </motion.a>
        </Link>
      </div>

      <div className="flex items-center justify-center min-h-screen pt-0 p-2">
        <motion.div
          className="w-full max-w-7xl bg-white/10 backdrop-blur-lg border border-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Input Section */}
          <motion.div
            className="flex-1 flex flex-col items-center justify-center space-y-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-full text-center">
              <h2 className="text-xl font-bold mb-4">
                Hello There, <br /> start generating now!
              </h2>
            </div>

            <div className="w-full max-w-md flex flex-col items-center space-y-4">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. a robot riding a skateboard"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateImage}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold shadow-md transition-all w-full border border-purple-400"
              >
                {generating ? 'Generating...' : 'Generate'}
              </motion.button>
            </div>
          </motion.div>

          {/* Image Display Section */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center space-y-4"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="rounded-xl overflow-hidden shadow-xl max-w-md w-full border border-purple-600 bg-black/20"
              animate={{ scale: generating ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {generating ? (
                <Image src="/drawing.gif" alt="Generating..." width={500} height={500} />
              ) : image ? (
                <img
                  className="w-full h-auto transition-opacity duration-700 rounded-xl"
                  src={image}
                  alt="Generated"
                />
              ) : (
                <Image
                  src="/robot.jpeg"
                  alt="Placeholder"
                  width={500}
                  height={500}
                />
              )}
            </motion.div>

            {/* Download Button below the image */}
            <a
              href={image || '#'}
              download={image ? 'generated-image.jpg' : undefined}
              onClick={(e) => {
                if (!image) e.preventDefault();
              }}
              className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all w-full text-center border max-w-md ${
                image
                  ? 'bg-green-600 hover:bg-green-700 border-green-400 text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed'
              }`}
            >
              Download Image
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Nvidia;
