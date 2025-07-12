import React from 'react'

const InputField = ({label,type,value, onChange, placeholder}) => {
  return (
    <div className='mb-4'>
        <label className='block text-white mb-1 font-medium'>{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-[#1c2427] border border-[#3b4d54] text-white placeholder:text-[#9db2b9] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    </div>
  )
}

export default InputField