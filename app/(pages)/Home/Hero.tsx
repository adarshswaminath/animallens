"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
       <div className="relative">
       <Image
          src="/cat.jpeg"
          alt="Cat banner image"
          className="  object-contain rounded-xl mt-24  border-amber-500 border-4"
          width={250}
          height={400}
        />
        <Image
          src="/dog.jpg"
          alt="a smilling dog"
          className="relative bottom-16 left-20 lg:left-48 h-48 object-cover rounded-xl border-4 border-amber-500"
          width={250}
          height={200}
        />
       </div>
        <div>
          <HeroTextBanner/>
        </div>
      </div>
    </div>
  );
}

const HeroTextBanner = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      <motion.div
        className="lg:max-w-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.span
          className="font-bold font-whisper text-2xl text-amber-600 inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          Let's Go
        </motion.span>
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          AnimalLens
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          Instantly discover detailed information about any animal by simply
          uploading an image. Our AI-powered tool identifies the species and
          provides fascinating insights, helping you learn more about the
          wildlife around you. Snap, upload, and explore the animal kingdom with
          AnimalLens!
        </motion.p>
        <motion.button
          className="bg-[#fdbe7f] shadow text-white font-semibold py-3 px-6 rounded-lg transition duration-300 hover:bg-[#fca54d]"
          whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: "easeOut",
            scale: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};
