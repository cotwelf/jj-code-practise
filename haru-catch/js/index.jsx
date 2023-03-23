import React, { Fragment, useEffect, useRef, useState, useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import classNames from 'classnames'
import { sample } from 'lodash'
import '../style/main.scss'

const UPDATE_TIME = 120000
// 收集物设定
const COLLECTION_DETAIL = [
  {
    key: 'rain',
    collected: false,
    running: false,
    random: { // 随机事件：随机开启 1 个
      weekly: [3, 4, 0],
      hour: [19, 20, 21, 22, 23, 0, 1, 2, 3, 4]
    },
    constant: {},
  },
  {
    key: 'light',
    collected: false,
    running: false,
    random: {},
    constant: { // 常驻事件：必定开启
      hour: [19, 20, 21, 22, 23, 0, 1, 2, 3]
    }
  },
  {
    key: 'mushi', // 和灯一同出现（概率
    collected: false,
    running: false,
    random: {
      hour: [19, 20, 21, 22, 23, 0, 1, 2, 3]
    },
    constant: {} // 常驻事件：必定开启

  },
  {
    key: 'bird',
    collected: false,
    running: false,
    random: { // 随机事件：随机开启 1 个
      weekly: [1, 2, 4],
      hour: [5, 6, 7, 8, 9, 10, 11, 12]
    },
    constant: {}, // 常驻事件：必定开启
  },
  {
    key: 'sakura',
    collected: false,
    running: false,
    random: { // 随机事件：随机开启 1 个
      hour: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    },
    constant: {}, // 常驻事件：必定开启
  },
  {
    key: 'danngo',
    collected: false,
    running: false,
    random: { // 随机事件：随机开启 1 个
      hour: [12, 13, 14, 15, 16, 17, 18]
    },
    constant: {}, // 常驻事件：必定开启
  },
  {
    key: 'kite',
    collected: false,
    running: false,
    random: { // 随机事件：随机开启 1 个
      hour: [12, 13, 14, 15, 16, 17, 18]
    },
    constant: {}, // 常驻事件：必定开启
  },
]
// 一些关系到随机事件产生的变量们
const now = () => {
  const date = new Date()
  return {
    weekly: date.getDay(),
    hour: date.getHours()
  }
}

const getMaskOpacity = (maskKey) => {
  const opacityObj = {
    // 天黑的时间
    dark: {
      '1': [20, 21, 22, 23, 0, 1, 2, 3],
      '0.5': [4, 18],
      '0.7': [5, 19]
    },
  }
  for (const [key, value] of Object.entries(opacityObj[maskKey])) {
    if (value.includes(now().hour)) {
      return key
    }
  }
  return 0
}
const collectionKeys = () => JSON.parse(localStorage.getItem('haru-collections') || '[]')

const collectionReducer = (state, action) => {
  const tempCollections = JSON.parse(JSON.stringify(state))
    switch (action.type) {
      case 'init':
        // 每次重置数据
        return COLLECTION_DETAIL
      case 'run':
        tempCollections.forEach((item) => {
          // 常驻事件不变，随机事件全部置为 false 并开启新的随机事件
          if (JSON.stringify(item.constant) === '{}' && item.running === true) {
            item.running = false
          }
          if (item.key === action.payload) {
            if (item.collected === false) {
              item.collected = true
            }
            item.running = true
          }
        })
        return tempCollections
      case 'collected':
        tempCollections.forEach((item) => {
          if (item.key === action.payload) {
            item.collected = true
          }
        })
        return tempCollections
      default:
        throw new Error('something wrong about collectionReducer type')
    }
}

const Haru = () => {
  // 以下是常驻事件
  const [darkMaskOpacity, setDarkMaskOpacity] = React.useState(0)
  // 以下是随机事件，当前进行中的事件不超过 2 个
  const [modal, setModal] = useState('')
  const [collections, setCollections] = useReducer(collectionReducer, COLLECTION_DETAIL)
  const randomTimer = useRef(null)

  // 进行一个随机事件，可以随机，也可以通过已收集列表强制出现
  const runCollection = (detail) => {
    if (!detail) {
      return
    }
    if (!detail.collected) {
      detail.collected = true
      detail.running = true
      const keys = collectionKeys()
      if (!keys.includes(detail.key)) {
        keys.push(detail.key)
        localStorage.setItem('haru-collections', JSON.stringify(keys))
        setModal(detail.key)
        // 更新数据
      }
    }
    setCollections({type: 'run', payload: detail.key})
  }
  const updateState = () => {
    setCollections({ type: 'init' })
    const tempCollections = JSON.parse(JSON.stringify(collections))
    setDarkMaskOpacity(getMaskOpacity('dark'))

    // 更新收集列表信息
    tempCollections.forEach((item) => {
      if (collectionKeys().includes(item.key)) {
        setCollections({ type: 'collected', payload: item.key })
      }
    })
    // 首先判断时间，是否切换白天黑夜
    setDarkMaskOpacity(getMaskOpacity('dark'))
    const tempNow = now()
    // 先开启常驻事件
    tempCollections.forEach((item) => {
      const { hour, weekly } = item.constant
      if (hour && hour.includes(tempNow.hour) && weekly && weekly.includes(tempNow.weekly)) {
        runCollection(item)
      }
      if (hour && hour.includes(tempNow.hour) && !weekly) {
        runCollection(item)
      }
      if (weekly && weekly.includes(tempNow.hour) && !hour) {
        runCollection(item)
      }
    })
    // 随机出现收集物
    let aimSurprise = tempCollections.filter((item) => {
      const { hour, weekly } = item.random
      if (hour && hour.includes(tempNow.hour) && weekly && weekly.includes(tempNow.weekly)) {
        return item
      }
      if (hour && hour.includes(tempNow.hour) && !weekly) {
        return item
      }
      if (weekly && weekly.includes(tempNow.hour) && !hour) {
        return item
      }
    })
    runCollection(sample(aimSurprise))
  }
  useEffect(() => {
    updateState()
    randomTimer.current = setInterval(() => {
      updateState()
    }, UPDATE_TIME)
    return () => {
      clearInterval(randomTimer.current)
      randomTimer.current = null
    }
  }, [])

  const toggleModal = (e) => {
    if (modal !== 'list') {
      setModal('list')
      return
    }
    if (modal) {
      setModal('')
    }
  }
  const showListModal = () => {
    setModal('list')
  }
  const showDetail = (e, key) => {
    e.stopPropagation()
    setModal(key)
  }
  return (
    <Fragment>
      <>
        <div className='show-list-btn btn-text' onClick={showListModal}></div>
        <div className='show-list-btn btn-bg' />
      </>
      <div
        className={classNames('tip-modal',modal, { 'show': modal })}
        style={{zIndex: modal ? 9 : 0}}
        onClick={toggleModal}
      >
        {modal === 'list' && (
          <div className='collection-list'>
            { collections.map((col) => <div
              key={col.key}
              className={classNames('detail', col.key, {collected: col.collected})}
              onClick={(e) => showDetail(e, col.key, col.collected)}
            />) }
          </div>
        )}
      </div>
      <div className='game-view'>
        { collections.map((item) => item.running ? <div key={item.key} className={item.key}></div> : null) }
        { darkMaskOpacity ? <div className='dark-mask' style={{ opacity: darkMaskOpacity }}></div> : null }
        <div className='background'></div>
      </div>
    </Fragment>
  )
}
ReactDOM.createRoot(document.getElementById('container')).render(<Haru />)
