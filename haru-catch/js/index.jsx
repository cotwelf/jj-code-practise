import React, { Fragment, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import classNames from 'classnames'
import { sample } from 'lodash'
import '../style/main.scss'

const testMode = false
const UPDATE_TIME = 3000
// 触发条件1：浏览器
const ua = navigator.userAgent.toLowerCase()
const browser = ua.match(/firefox\/([\d.]+)/)
  ? 'firefox'
  : ua.match(/chrome\/([\d.]+)/)
  ? 'chrome'
  : ua.match(/version\/([\d.]+).*safari/)
  ? 'safari'
  : ''
// 收集物设定
const COLLECTION_DETAIL = [
  {
    key: 'rain',
    // browser: 'chrome',
    // tips: 'Chrome 世界',
    collected: false,
    running: false,
    random: { // 随机事件：随机开启 1 个
      weekly: [3, 4, 6],
      hour: [19, 20, 21, 22, 23, 0, 1, 2, 3, 4]
    },
    const: {},
  },
  {
    key: 'light',
    collected: false,
    running: false,
    random: {},
    const: { // 常驻事件：必定开启
      hour: [19, 20, 21, 22, 23, 0, 1, 2, 3]
    }
  }
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
  if (testMode) {
    return 1
  }
  const opacityObj = {
    // 天黑的时间
    dark: {
      '1': [20, 21, 22, 23, 0, 1, 2, 3],
      '0.5': [4, 18],
      '0.7': [5, 19]
    },
    // 路灯亮起的时间
    light : {
      '1': [19, 20, 21, 22, 23, 0, 1, 2, 3],
    }
  }
  for (const [key, value] of Object.entries(opacityObj[maskKey])) {
    if (value.includes(now().hour)) {
      return key
    }
  }
  return 0
}
const collectionKeys = JSON.parse(localStorage.getItem('haru-collections') || '[]')

const Haru = () => {
  // 以下是常驻事件
  const [darkMaskOpacity, setDarkMaskOpacity] = React.useState(0)
  const [lightMaskOpacity, setLightMaskOpacity] = React.useState(0) // 这个算是半随机事件 orz，为了说明收集机制
  // 以下是随机事件，当前进行中的事件不超过 1 个
  const [collections, setCollections] = React.useState(COLLECTION_DETAIL) // 已收集列表
  const [modal, setModal] = useState('')
  const randomTimer = useRef(null)
  const updateCollectionDetail = (key, newObj) => {
    const tempCollections = JSON.parse(JSON.stringify(collections))
    tempCollections.forEach((item) => {
      if (item.key === key) {
        console.log({...item, ...newObj},'{...item, ...newObj}')
        item = {...item, ...newObj}
      }
    })
    setCollections(tempCollections)
  }
  // 进行一个随机事件，可以随机，也可以通过已收集列表强制出现
  const runCollection = (detail) => {

    if (!detail.collected) {
      detail.collected = true
      detail.running = true
      if (!collectionKeys.includes(detail.key)) {
        collectionKeys.push(detail.key)
        localStorage.setItem('haru-collections', JSON.stringify(collectionKeys))
        setModal(detail.key)
        // 更新数据
        updateCollectionDetail(detail.key, detail)
      }
    }

  }
  useEffect(() => {
    const tempCollections = JSON.parse(JSON.stringify(collections))
    setDarkMaskOpacity(getMaskOpacity('dark'))
    setLightMaskOpacity(getMaskOpacity('light'))

    // 更新收集列表信息
    tempCollections.forEach((item) => {
      console.log(collectionKeys.includes(item.key),'collectionKeys.includes(item.key)')
      if (collectionKeys.includes(item.key)) {
        item.collected = true
        updateCollectionDetail(item.key, item)
      }
    })

    randomTimer.current = setInterval(() => {
      // 首先判断时间，是否切换白天黑夜
      setDarkMaskOpacity(getMaskOpacity('dark'))
      setLightMaskOpacity(getMaskOpacity('light'))
      const tempNow = now()
      // 先开启常驻事件
      tempCollections.forEach((item) => {
        const { hour, weekly } = item.const
        if (hour && hour.includes(tempNow.hour) && weekly && weekly.includes(tempNow.weekly)) {
          runCollection(item)
          return
        }
        if (hour && hour.includes(tempNow.hour) && !weekly) {
          runCollection(item)
          return
        }
        if (weekly && weekly.includes(tempNow.hour) && !hour) {
          runCollection(item)
          return
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
      console.log(aimSurprise, sample(aimSurprise),'sss')
    }, UPDATE_TIME)
    return () => {
      clearInterval(randomTimer.current)
      randomTimer.current = null
    }
  }, [])

  const toggleModal = (e) => {
    console.log(collections,'collections')

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
  const showDetail = (e, key, collected) => {
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
            {collections.map((col) => <div
              key={col.key}
              className={classNames('detail', col.key, {collected: col.collected})}
              onClick={(e) => showDetail(e, col.key, col.collected)}
            />)}
          </div>
        )}
      </div>
      <div className='game-view'>
        { lightMaskOpacity && <div className='light-mask'></div> }
        { darkMaskOpacity && <div className='dark-mask' style={{ opacity: darkMaskOpacity }}></div> }
        { collections.map((item) => <div key={item.key} className={item.key}></div>) }
        <div className='background'></div>
      </div>
    </Fragment>
  )
}
ReactDOM.createRoot(document.getElementById('container')).render(<Haru />)
