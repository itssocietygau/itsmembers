interface ProgressBarProps {
    value: number
    max: number
    color?: string
    className?: string
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({ 
    value, 
    max, 
    color = 'bg-blue-500',
    className = ''
  }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0
  
    return (
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className}`}>
        <div 
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    )
  }
  
  export default ProgressBar