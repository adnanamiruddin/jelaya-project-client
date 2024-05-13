import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const MotionDiv = ({ children, x, y, delay, optionalStyling }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <>
      {x !== undefined && y === undefined ? (
        <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, x },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate={mainControls}
          transition={{ duration: 0.5, delay: delay || 0.25 }}
          className={`w-full z-[5] ${optionalStyling}`}
        >
          {children}
        </motion.div>
      ) : (
        ""
      )}

      {y !== undefined && x === undefined ? (
        <motion.div
          ref={ref}
          variants={{
            hidden: { opacity: 0, y },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={mainControls}
          transition={{ duration: 0.5, delay: delay || 0.25 }}
          className={`w-full z-[5] ${optionalStyling}`}
        >
          {children}
        </motion.div>
      ) : (
        ""
      )}
    </>
  );
};

export default MotionDiv;
