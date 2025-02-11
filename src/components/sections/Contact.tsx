'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [formData, setFormData] = useState({
    clinicName: '',
    specialty: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    consultationType: [],
    currentChallenges: '',
    acceptPrivacy: false
  })

  const specialties = ['一般牙科', '植牙專科', '齒顎矯正', '牙周專科', '兒童牙科', '美學牙科']

  const consultationTypes = [
    '品牌診斷諮詢',
    '數位轉型規劃',
    '行銷策略制定',
    '內容傳播優化',
    '病患體驗提升',
    '其他諮詢'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.acceptPrivacy) {
      alert('請同意隱私權政策')
      return
    }
    // TODO: 實作表單提交邏輯
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      if (name === 'acceptPrivacy') {
        setFormData(prev => ({ ...prev, [name]: checkbox.checked }))
      } else if (name === 'consultationType') {
        const updatedTypes = checkbox.checked
          ? [...formData.consultationType, value]
          : formData.consultationType.filter(type => type !== value)
        setFormData(prev => ({ ...prev, consultationType: updatedTypes }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-red to-brand-red/80 bg-clip-text text-transparent">
            專業諮詢
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            讓我們為您的診所打造專屬成長方案
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {/* 診所資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="clinicName" className="block text-gray-700 mb-2">
                  診所名稱
                </label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-gray-700 mb-2">
                  主要科別
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                >
                  <option value="">請選擇科別</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 聯絡人資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="contactPerson" className="block text-gray-700 mb-2">
                  聯絡人姓名
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-gray-700 mb-2">
                  職稱
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 聯絡方式 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  聯絡電話
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 諮詢項目 */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                諮詢項目 (可複選)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {consultationTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="consultationType"
                      value={type}
                      checked={formData.consultationType.includes(type)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 目前遇到的挑戰 */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                目前遇到的挑戰
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                placeholder="請描述您的診所目前遇到的挑戰或想要達成的目標..."
                value={formData.currentChallenges}
                onChange={(e) => setFormData({ ...formData, currentChallenges: e.target.value })}
              />
            </div>

            {/* 隱私權政策 */}
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                  required
                />
                <span className="text-gray-700">
                  我同意
                  <a href="#" className="text-brand-red hover:underline ml-1">
                    隱私權政策
                  </a>
                  ，並同意接收最新醫療行銷資訊
                </span>
              </label>
            </div>

            <button
              className="bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300"
              type="submit"
            >
              開始專業諮詢
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
} 