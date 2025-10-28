import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import './AnimatedSideDrawer.css'
// Reference to satisfy linter usage tracking in JSX
const __ensureMotionUsed = !!motion && !!AnimatePresence

const AnimatedSideDrawer = ({ isOpen, onClose, theme, setTheme }) => {
  const location = useLocation()

  const menuSections = [
    {
      title: '🚀 Project',
      icon: '🚀',
      items: [
        { to: '/editor', label: 'Editor', icon: '✏️' },
        { to: '/preview', label: 'Preview', icon: '👁️' },
        { to: '/resumes', label: 'Resumes', icon: '📄' }
      ]
    },
    {
      title: '🔐 Auth',
      icon: '🔐',
      items: [
        { to: '/auth', label: 'Login', icon: '🔑' },
        { to: '/auth', label: 'Register', icon: '📝' }
      ]
    },
    {
      title: '💬 Chatbot',
      icon: '💬',
      items: [
        { to: '/chatbot', label: 'AI Assistant', icon: '🤖' }
      ]
    }
  ]

  const homeItem = { to: '/', label: 'Home', icon: '🏠' }

  const drawerVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  }

  const itemVariants = {
    closed: {
      x: -20,
      opacity: 0
    },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    })
  }

  const sectionVariants = {
    closed: {
      y: 20,
      opacity: 0
    },
    open: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          {/* Side Drawer */}
          <motion.div
            className="animated-side-drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="drawer-header">
              <motion.div 
                className="drawer-brand"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <span className="brand-text">Resumify</span>
              </motion.div>
              
              <motion.button
                className="drawer-close-btn"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Navigation Content */}
            <div className="drawer-content">
              {/* Home Item */}
              <motion.div
                className="drawer-section"
                variants={sectionVariants}
                initial="closed"
                animate="open"
                custom={0}
              >
                <NavLink
                  to={homeItem.to}
                  className={`drawer-item home-item ${location.pathname === homeItem.to ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="item-label">{homeItem.label}</span>
                </NavLink>
              </motion.div>

              {/* Menu Sections */}
              {menuSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  className="drawer-section"
                  variants={sectionVariants}
                  initial="closed"
                  animate="open"
                  custom={sectionIndex + 1}
                >
                  <div className="section-header">
                    <span className="section-title">{section.title.replace(/^[^A-Za-z0-9\s]+\s*/, '')}</span>
                  </div>
                  
                  <div className="section-items">
                    {section.items.map((item, itemIndex) => {
                      const isActive = section.title === '🔐 Auth' 
                        ? location.pathname === item.to
                        : location.pathname.startsWith(item.to)
                      
                      return (
                        <motion.div
                          key={item.label}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          custom={itemIndex}
                        >
                          <NavLink
                            to={item.to}
                            className={`drawer-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                          >
                            <span className="item-label">{item.label}</span>
                            {isActive && (
                              <motion.div
                                className="active-indicator"
                                layoutId="activeIndicator"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              />
                            )}
                          </NavLink>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Theme Toggle */}
              <motion.div
                className="drawer-section theme-section"
                variants={sectionVariants}
                initial="closed"
                animate="open"
                custom={menuSections.length + 1}
              >
                <div className="section-header">
                  <span className="section-title">Theme</span>
                </div>
                
                <motion.button
                  className="theme-toggle-btn"
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  custom={0}
                >
                  <span className="item-label">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </motion.button>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div 
              className="drawer-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="footer-text">
                Built with ❤️ and Framer Motion
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AnimatedSideDrawer
