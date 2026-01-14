import { useState, useEffect } from 'react'

const TEAM_MEMBERS = [
  { id: 1, name: '김서영', role: '팀장', targetDays: 5 },
  { id: 2, name: '김재훈', role: 'SM', targetDays: 5 },
  { id: 3, name: '오준헌', role: '매니저', targetDays: 5 },
  { id: 4, name: '이예림', role: '매니저', targetDays: 4 },
  { id: 5, name: '오유미', role: '매니저', targetDays: 4 },
  { id: 6, name: '유수정', role: '매니저', targetDays: 3 },
  { id: 7, name: '변자영', role: '매니저', targetDays: 5 },
]

const STATUSES = [
  { label: '출근', emoji: '🏢', color: 'bg-[#3B82F6] text-white', subtitle: '' },
  { label: '재택', emoji: '🏠', color: 'bg-[#10B981] text-white', subtitle: '' },
  { label: '연차', emoji: '🌴', color: 'bg-[#EF4444] text-white', subtitle: '' },
  { label: '오전반차', emoji: '🌅', color: 'bg-[#F97316] text-white', subtitle: '' },
  { label: '오후반차', emoji: '🌆', color: 'bg-[#FB923C] text-white', subtitle: '' },
  { label: '미팅', emoji: '💼', color: 'bg-[#8B5CF6] text-white', subtitle: '' },
  { label: '오전재택-오후출근', emoji: '🔄', color: 'bg-[#FBBF24] text-white', subtitle: '전일 야근' },
  { label: '점심식사중', emoji: '🍽️', color: 'bg-[#14B8A6] text-white', subtitle: '' },
  { label: '저녁식사중', emoji: '🍴', color: 'bg-[#06B6D4] text-white', subtitle: '' },
  { label: '사무실이동중', emoji: '🚶', color: 'bg-[#6B7280] text-white', subtitle: '' },
]

function App() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2026, 0, 13)) // 2026년 1월 13일 (월요일)
  const [attendance, setAttendance] = useState({})
  const [selectedCell, setSelectedCell] = useState(null)
  const [weather, setWeather] = useState({})
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState(null)
  const [weekModal, setWeekModal] = useState(null) // { memberName, memberRole }
  const [dayModal, setDayModal] = useState(null) // { date, dateKey, status }
  const [toast, setToast] = useState(null) // { message }
  const [isSliding, setIsSliding] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState(null) // 선택된 팀원 ID

  // localStorage에서 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('madup-attendance')
    if (saved) {
      setAttendance(JSON.parse(saved))
    }
    
    // 선택된 팀원 로드
    const savedMemberId = localStorage.getItem('attendance_member')
    if (savedMemberId) {
      setSelectedMemberId(parseInt(savedMemberId))
    }
  }, [])

  // localStorage에 데이터 저장
  useEffect(() => {
    localStorage.setItem('madup-attendance', JSON.stringify(attendance))
  }, [attendance])

  // 선택된 팀원 저장
  useEffect(() => {
    if (selectedMemberId !== null) {
      localStorage.setItem('attendance_member', selectedMemberId.toString())
    }
  }, [selectedMemberId])

  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true)
      setWeatherError(null)
      
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/forecast?q=Seoul,KR&appid=778545f1258007382a9868c2600d8b4b&units=metric&lang=kr'
        )
        
        if (!response.ok) {
          throw new Error('날씨 정보를 가져올 수 없습니다')
        }
        
        const data = await response.json()
        
        console.log('=== 날씨 API 응답 ===')
        console.log('전체 데이터:', data)
        console.log('예보 리스트 개수:', data.list?.length)
        
        // 날짜별로 날씨 데이터 그룹화
        const weatherByDate = {}
        
        data.list.forEach((item, index) => {
          const date = new Date(item.dt * 1000)
          const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
          
          if (index < 3) {
            console.log(`예보 #${index + 1}:`, {
              timestamp: item.dt,
              date: date.toLocaleString('ko-KR'),
              dateKey: dateKey,
              temp: item.main.temp,
              weather: item.weather[0].main,
              description: item.weather[0].description
            })
          }
          
          if (!weatherByDate[dateKey]) {
            weatherByDate[dateKey] = {
              temps: [],
              weather: item.weather[0],
              icon: item.weather[0].main
            }
          }
          
          weatherByDate[dateKey].temps.push(item.main.temp)
        })
        
        // 최고/최저 기온 계산
        Object.keys(weatherByDate).forEach(dateKey => {
          const temps = weatherByDate[dateKey].temps
          weatherByDate[dateKey].tempMax = Math.round(Math.max(...temps))
          weatherByDate[dateKey].tempMin = Math.round(Math.min(...temps))
        })
        
        console.log('=== 날짜별 날씨 데이터 ===')
        Object.keys(weatherByDate).forEach(dateKey => {
          console.log(`${dateKey}:`, {
            icon: weatherByDate[dateKey].icon,
            tempMax: weatherByDate[dateKey].tempMax,
            tempMin: weatherByDate[dateKey].tempMin,
            tempCount: weatherByDate[dateKey].temps.length
          })
        })
        
        setWeather(weatherByDate)
      } catch (error) {
        setWeatherError(error.message)
        console.error('날씨 데이터 로드 실패:', error)
      } finally {
        setWeatherLoading(false)
      }
    }
    
    fetchWeather()
  }, [currentWeekStart])

  // 날씨 아이콘 가져오기
  const getWeatherIcon = (weatherMain) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '💨',
      'Tornado': '🌪️'
    }
    return icons[weatherMain] || '☁️'
  }

  // 주간 날짜 생성 (월~금)
  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  // 날짜를 키로 변환
  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  // 상태 변경
  const handleStatusChange = (dateKey, memberName, status) => {
    setAttendance(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [memberName]: status
      }
    }))
    setSelectedCell(null)
  }

  // 이번주 전체 설정
  const handleWeekSet = (memberName, memberRole, status) => {
    const newAttendance = { ...attendance }
    weekDates.forEach(date => {
      const dateKey = getDateKey(date)
      if (!newAttendance[dateKey]) {
        newAttendance[dateKey] = {}
      }
      newAttendance[dateKey][memberName] = status
    })
    setAttendance(newAttendance)
    setWeekModal(null)
    showToast(`${memberName} ${memberRole} 이번주 ${status}로 설정되었습니다`)
  }

  // 날짜별 전체 설정
  const handleDaySetAll = (dateKey, status) => {
    const newAttendance = { ...attendance }
    if (!newAttendance[dateKey]) {
      newAttendance[dateKey] = {}
    }
    TEAM_MEMBERS.forEach(member => {
      newAttendance[dateKey][member.name] = status
    })
    setAttendance(newAttendance)
    setDayModal(null)
    const date = new Date(dateKey)
    showToast(`${date.getMonth() + 1}월 ${date.getDate()}일 전체 ${status}로 설정되었습니다`)
  }

  // 토스트 표시
  const showToast = (message) => {
    setToast({ message })
    setTimeout(() => setToast(null), 3000)
  }

  // 특정 날짜의 출근 인원 계산
  const getWorkingCount = (dateKey) => {
    const dayData = attendance[dateKey] || {}
    return Object.values(dayData).filter(status => 
      status === '출근' || status === '재택' || status === '미팅'
    ).length
  }

  // 날짜별 상태 통계
  const getStatusStats = (dateKey) => {
    const dayData = attendance[dateKey] || {}
    const stats = {}
    STATUSES.forEach(status => {
      stats[status.label] = 0
    })
    Object.values(dayData).forEach(status => {
      if (stats[status] !== undefined) {
        stats[status]++
      }
    })
    return stats
  }

  // 이번주 출근율 계산
  const getWeeklyAttendanceRate = () => {
    let totalWorking = 0
    let totalPossible = weekDates.length * TEAM_MEMBERS.length
    
    weekDates.forEach(date => {
      const dateKey = getDateKey(date)
      totalWorking += getWorkingCount(dateKey)
    })
    
    return Math.round((totalWorking / totalPossible) * 100)
  }

  // 선택된 팀원의 이번주 현황
  const getSelectedMemberWeekStatus = () => {
    if (!selectedMemberId) return null
    
    const selectedMember = TEAM_MEMBERS.find(m => m.id === selectedMemberId)
    if (!selectedMember) return null
    
    const stats = {}
    STATUSES.forEach(status => {
      stats[status.label] = 0
    })
    
    weekDates.forEach(date => {
      const dateKey = getDateKey(date)
      const status = attendance[dateKey]?.[selectedMember.name] || '출근'
      if (stats[status] !== undefined) {
        stats[status]++
      }
    })
    
    return { stats, member: selectedMember }
  }

  // 오늘 날짜인지 확인
  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  // 이전/다음 주
  const navigateWeek = (direction) => {
    setIsSliding(true)
    setTimeout(() => {
      const newDate = new Date(currentWeekStart)
      newDate.setDate(newDate.getDate() + (direction * 7))
      setCurrentWeekStart(newDate)
      setIsSliding(false)
    }, 150)
  }

  // 현재 주로 돌아가기
  const goToInitialWeek = () => {
    setCurrentWeekStart(new Date(2026, 0, 13))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-center mb-3">마케팅 10팀 출퇴근 현황</h1>
          
          {/* 팀원 선택 */}
          <div className="mb-3">
            <select
              value={selectedMemberId || ''}
              onChange={(e) => setSelectedMemberId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 rounded-lg text-gray-800 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">개인 기준 선택 (선택안함)</option>
              {TEAM_MEMBERS.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.role} (주 {member.targetDays}일 기준)
                </option>
              ))}
            </select>
          </div>
          
          {/* 주간 네비게이션 */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-blue-800 rounded-full transition-colors"
            >
              <span className="text-2xl">←</span>
            </button>
            
            <div className="text-center">
              <div className="text-sm opacity-90">
                {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 ~ {weekDates[4].getMonth() + 1}월 {weekDates[4].getDate()}일
              </div>
              <button
                onClick={goToInitialWeek}
                className="text-xs mt-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
              >
                1/13 주로 이동
              </button>
            </div>
            
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-blue-800 rounded-full transition-colors"
            >
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 선택된 팀원의 이번주 현황 */}
      {(() => {
        const memberStatus = getSelectedMemberWeekStatus()
        if (!memberStatus) return null
        
        const { stats, member } = memberStatus
        return (
          <div className="px-4 pt-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">👤 이번주 출근 {member.targetDays}일 - {member.name} 기준</h2>
                <span className="text-sm opacity-90">{member.role}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats).map(([status, count]) => {
                  if (count === 0) return null
                  const statusInfo = STATUSES.find(s => s.label === status)
                  return (
                    <div key={status} className="bg-white bg-opacity-20 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <span>{statusInfo.emoji}</span>
                      <span className="font-semibold">{status} {count}일</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* 날짜별 카드 */}
      <div className={`px-4 pt-4 space-y-4 transition-opacity duration-150 ${isSliding ? 'opacity-50' : 'opacity-100'}`}>
        {weekDates.map((date, dayIndex) => {
          const dateKey = getDateKey(date)
          const workingCount = getWorkingCount(dateKey)
          const dayNames = ['월', '화', '수', '목', '금']
          const dayWeather = weather[dateKey]
          const stats = getStatusStats(dateKey)
          const today = isToday(date)
          
          return (
            <div 
              key={dateKey} 
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                today ? 'ring-4 ring-yellow-400 shadow-xl bg-yellow-50' : ''
              }`}
            >
              {/* 날짜 헤더 */}
              <div className={`px-4 py-3 border-b-2 ${
                today 
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-gray-800">
                        {date.getMonth() + 1}월 {date.getDate()}일 ({dayNames[dayIndex]})
                      </div>
                      {today && (
                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded-full animate-pulse">
                          TODAY
                        </span>
                      )}
                    </div>
                    {/* 날씨 정보 */}
                    {weatherLoading && (
                      <div className="text-xs text-gray-500 mt-1">
                        날씨 로딩 중...
                      </div>
                    )}
                    {weatherError && (
                      <div className="text-xs text-red-500 mt-1">
                        날씨 정보 없음
                      </div>
                    )}
                    {dayWeather && !weatherLoading && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{getWeatherIcon(dayWeather.icon)}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {dayWeather.tempMax}° / {dayWeather.tempMin}°
                        </span>
                      </div>
                    )}
                    
                    {/* 상태 통계 */}
                    <div className="flex flex-wrap gap-1 mt-1.5 text-xs">
                      {Object.entries(stats).map(([status, count]) => {
                        if (count === 0) return null
                        const statusInfo = STATUSES.find(s => s.label === status)
                        return (
                          <span key={status} className="text-gray-600">
                            {statusInfo.emoji}{status} {count}명
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <span className="font-semibold text-blue-600">
                      출근 {workingCount}/7
                    </span>
                  </div>
                </div>
                
                {/* 퀵 설정 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setDayModal({ date, dateKey, status: '출근' })}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    전체 출근
                  </button>
                  <button
                    onClick={() => setDayModal({ date, dateKey, status: '재택' })}
                    className="flex-1 px-3 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    전체 재택
                  </button>
                </div>
              </div>

              {/* 팀원 리스트 */}
              <div className="divide-y divide-gray-100">
                {TEAM_MEMBERS.map((member) => {
                  const status = attendance[dateKey]?.[member.name] || '출근'
                  const statusInfo = STATUSES.find(s => s.label === status)
                  const cellKey = `${dateKey}-${member.name}`
                  const isSelected = selectedCell === cellKey

                  return (
                    <div key={member.name} className="relative">
                      {/* 팀원 행 */}
                      <div
                        className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-all duration-200 ${
                          member.id === selectedMemberId ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setWeekModal({ memberName: member.name, memberRole: member.role })
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="이번주 전체 설정"
                          >
                            <span className="text-lg">⚡</span>
                          </button>
                          <div className="font-semibold text-gray-800 text-base">
                            {member.name}
                            {member.role && (
                              <span className="ml-2 text-xs text-gray-500 font-normal">
                                {member.role}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedCell(isSelected ? null : cellKey)}
                          className={`min-w-[120px] px-5 py-3 rounded-xl ${statusInfo.color} font-semibold text-base shadow-md hover:shadow-lg active:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}
                        >
                          <span className="text-xl">{statusInfo.emoji}</span>
                          <span>{statusInfo.label}</span>
                        </button>
                      </div>

                      {/* 상태 선택 Bottom Sheet */}
                      {isSelected && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 bg-black bg-opacity-50 animate-fade-in"
                            onClick={() => setSelectedCell(null)}
                          />
                          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
                            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-3xl">
                              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>
                              <h3 className="text-lg font-bold text-gray-800">
                                {member.name} {member.role} - 상태 선택
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {date.getMonth() + 1}월 {date.getDate()}일 ({dayNames[dayIndex]})
                              </p>
                            </div>
                            <div className="p-4 space-y-2">
                              {STATUSES.map((statusOption) => (
                                <button
                                  key={statusOption.label}
                                  onClick={() => handleStatusChange(dateKey, member.name, statusOption.label)}
                                  className={`w-full px-5 py-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                                    status === statusOption.label 
                                      ? `${statusOption.color} shadow-lg scale-105` 
                                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <span className="text-2xl">{statusOption.emoji}</span>
                                  <div className="flex-1 text-left">
                                    <span className={`text-base font-semibold block ${
                                      status === statusOption.label ? 'text-white' : 'text-gray-800'
                                    }`}>{statusOption.label}</span>
                                    {statusOption.subtitle && (
                                      <span className={`text-xs ${
                                        status === statusOption.label ? 'text-white opacity-90' : 'text-gray-500'
                                      }`}>{statusOption.subtitle}</span>
                                    )}
                                  </div>
                                  {status === statusOption.label && (
                                    <span className="text-white text-xl">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="p-4 pb-6">
                              <button
                                onClick={() => setSelectedCell(null)}
                                className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                              >
                                닫기
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 이번주 출근율 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl shadow-md p-5 text-center">
          <h3 className="text-sm text-gray-600 mb-2">이번주 전체 출근율</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {getWeeklyAttendanceRate()}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${getWeeklyAttendanceRate()}%` }}
            />
          </div>
        </div>
      </div>

      {/* 이번주 전체 설정 모달 */}
      {weekModal && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 animate-fade-in"
            onClick={() => setWeekModal(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-3xl">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <h3 className="text-xl font-bold text-gray-800">
                이번주 전체 설정
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">{weekModal.memberName} {weekModal.memberRole}</span>의<br />
                이번주 월~금요일 상태를 선택하세요
              </p>
            </div>
            <div className="p-4 space-y-2">
              {STATUSES.map((statusOption) => (
                <button
                  key={statusOption.label}
                  onClick={() => handleWeekSet(weekModal.memberName, weekModal.memberRole, statusOption.label)}
                  className={`w-full px-5 py-4 rounded-xl ${statusOption.color} font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-3`}
                >
                  <span className="text-2xl">{statusOption.emoji}</span>
                  <div className="flex-1 text-left">
                    <span className="block">{statusOption.label}</span>
                    {statusOption.subtitle && (
                      <span className="text-xs opacity-90">{statusOption.subtitle}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 pb-6">
              <button
                onClick={() => setWeekModal(null)}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </>
      )}

      {/* 날짜별 전체 설정 확인 모달 */}
      {dayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              전체 설정 확인
            </h3>
            <p className="text-base text-gray-700 mb-6">
              <span className="font-semibold">
                {dayModal.date.getMonth() + 1}월 {dayModal.date.getDate()}일
              </span> 전체를<br />
              <span className="font-bold text-lg">{dayModal.status}</span>로 설정하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDayModal(null)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDaySetAll(dayModal.dateKey, dayModal.status)}
                className="flex-1 px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm">
            <p className="text-sm font-medium text-center">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

