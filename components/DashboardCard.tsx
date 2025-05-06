import React from 'react'

interface DashboardCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export default DashboardCard