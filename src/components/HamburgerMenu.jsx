import { motion } from 'framer-motion'
import './HamburgerMenu.css'

const HamburgerMenu = ({ isOpen, onClick }) => {
  const lineVariants = {
    closed: {
      rotate: 0,
      y: 0
    },
    open: {
      rotate: 45,
      y: 6
    }
  }

  const lineVariants2 = {
    closed: {
      rotate: 0,
      y: 0,
      opacity: 1
    },
    open: {
      rotate: -45,
      y: -6,
      opacity: 0
    }
  }

  const lineVariants3 = {
    closed: {
      rotate: 0,
      y: 0
    },
    open: {
      rotate: -45,
      y: -6
    }
  }

  return (
    <motion.button
      className="hamburger-menu"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="hamburger-lines">
        <motion.span
          className="hamburger-line"
          variants={lineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <motion.span
          className="hamburger-line"
          variants={lineVariants2}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <motion.span
          className="hamburger-line"
          variants={lineVariants3}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </motion.button>
  )
}

export default HamburgerMenu

