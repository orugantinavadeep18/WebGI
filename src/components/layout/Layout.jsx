import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Layout = ({ children }) => {
  return (
    <>
      {/* Fixed Header - stays on top */}
      <Header />
      
      {/* Main content area starts below fixed navbar and city bar */}
      <motion.div
        className="min-h-screen flex flex-col bg-background pt-16 sm:pt-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.main 
          className="flex-1 w-full px-2 sm:px-4"
          variants={itemVariants}
        >
          {children}
        </motion.main>
        <motion.div variants={itemVariants}>
          <Footer />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Layout;