import React from 'react'

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className=' bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] '>
      
      {children}</div>
  )
}

export default Layout