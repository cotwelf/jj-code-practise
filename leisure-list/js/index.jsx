import React, { createContext, useEffect, useState, useReducer, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import * as dayjs from 'dayjs'
import '../style/main.scss'
import classNames from 'classnames'

const daySpace = {
  midnight: [0, 5],
  morning: [6, 12],
  afternoon: [13, 18],
  evening: [19, 23]
}
const moodSpace = {
  '非常开心': [80, 100],
  '一般般': [60, 79],
  '不太好': [40, 59],
  '难过': [0, 39]
}
let doneListData = ''
try {
  doneListData = JSON.parse(window.localStorage.getItem('doneList'))
} catch {
  throw Error('localStorage 里没有 doneList 啦 > <')
}

const infoContext = createContext(null)

const todo = {
  '5': [{
    id: 0,
    name: '冥想',
    doneSentence: '冥想，虽然时间不多，但感觉大脑被按下暂停键，让思绪可以去往任何地方，身体和大脑都得到了短暂放松~ '
  },{
    id: 1,
    name: '听一首歌',
    doneSentence: '听歌，下次去 KTV 要不要试试唱这首歌呢？ '
  },
  {
    id: 2,
    name: '整理书桌',
    doneSentence: '整理书桌，保持桌面整洁也可以让心情愉悦。'
  },
  {
    id: 3,
    name: '看看窗外',
    doneSentence: '眺望窗外，一直看着电脑眼睛也会难受。'
  },{
    id: 4,
    name: '发呆',
    doneSentence: '发呆。'
  }],
  '10': [{
    id: 0,
    name: '运动',
    doneSentence: '运动，最近好多人开始复阳了，有点害怕。。。还是多动动叭~ '
  }, {
    id: 1,
    name: '看看窗外',
    doneSentence: '眺望窗外，一直看着电脑眼睛也会难受。'
  }, {
    id: 2,
    name: '整理书桌',
    doneSentence: '整理书桌，保持桌面整洁也可以让心情愉悦。'
  },{
    id: 3,
    name: '找一道想吃的菜谱',
    doneSentence: '找到一个想吃的菜谱，周末尝试学着做一下~ 开始期待！！'
  },{
    id: 4,
    name: '给自己点杯奶茶',
    doneSentence: '给自己点了杯奶茶~ '
  }],
  '30': [{
    id: 0,
    name: '练字',
    doneSentence: '冥想，虽然时间不多，但感觉大脑被按下暂停键，让思绪可以去往任何地方，身体和大脑都得到了短暂放松~ '
  },{
    id: 1,
    name: '爬楼梯运动',
    doneSentence: '爬楼梯运动，毕竟身体是革命的本钱~ '
  },{
    id: 2,
    name: '找一本想读的书',
    doneSentence: '找了一本想读的书，今晚开始睡前一小时内不看电子设备，开始读书~ '
  },
  {
    id: 3,
    name: '随便画会儿画',
    doneSentence: '画了会儿画，虽然看不出画的是什么，但感觉很解压。'
  }]
}

const joinSentence = ['我“浪费”了 duration 分钟doneSentence', '另外，我还花了 duration 分钟doneSentence', '还有 duration 分钟的doneSentence']

const endP = '有时我不禁在想，这些时间真的是被“浪费”了吗？这些时间让我更好地感受到这个世界，让我在忙碌中停下来一会儿，就一会儿，可以听听自己内心的声音，比如我今天遇到了哪些人，发生了什么事，当下的心情如何之类的。可能偶尔休息一下是为了之后可以更加精力充沛地踏上旅程，生活也一样~'

const today = new Date()
const dayString = dayjs().format('YYYY.MM.DD')
const weekString = () => {
  switch(dayjs().day()) {
    case 0:
      return '星期天'
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
  }
}

const screenWidth = document.body.clientWidth

const WelcomeDom = () => {
  const { dispatch } = useContext(infoContext)
  const [transform, setTransform] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setTransform(true)
    }, 1000)
    setTimeout(() => {
      dispatch({ type: 'page', payload: 'waste-time' })
    }, 6000)
  }, [])
  return <div id='welcome'>
    <div className={classNames('word-1', {transform})}>
      <div className='todo'>Todo</div>
      <div className='waste'>"浪费时间"</div>
    </div>
    <div>List</div>
  </div>
}

const WasteTime = () => {
  const { dispatch } = useContext(infoContext)
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)
  const [endText, setEndText] = useState('')
  const [doneItem, setDoneItem] = useState({})

  const fadingOut = (todoFn, fadingTime = 1000) => {
    setFading(true)
    setTimeout(() => {
      todoFn()
      setFading(false)
    }, fadingTime)
  }
  return (
    <div id='waste-time' className={classNames(`step-${step}`, {'column': screenWidth < 780, fading })}>
      {step === 0 && (
        <>
          <div className={classNames('choice', {hide: doneItem.duration})}>
            <div>你打算浪费</div>
            <div className='btn-group'>{Object.keys(todo).map(d => (
              <button key={d} className='duration' onClick={() => {
                setDoneItem({  ...doneItem, duration: d })
                fadingOut(() => setStep(1), 3000)
              }}>{d}</button>
            ))}</div>
            <div>分钟</div>
          </div>
          {doneItem.duration && (
            <div className='tips'><span>好的，现在你有&nbsp;</span>{doneItem.duration}<span>&nbsp;分钟可以浪费</span></div>
          )}
        </>
      )}
      {step === 1 && (
        <>
          <div className='header'>在接下来的 {doneItem.duration} 分钟，你可以选择</div>
          <div className='btn-group'>
            {todo[doneItem.duration].map(i => <button key={i.id} onClick={() => {
              setDoneItem({...doneItem, name: i.name, doneSentence: i.doneSentence, time: Date.now()})
              fadingOut(() => setStep(2))
            }}>{i.name}</button>)}
          </div>
        </>
      )}
      {step === 2 && (<>
        <div className={classNames('continue', {'hide': endText})}>
          <div>去吧，我在这里等你回来</div>
          <div className='btn-group'>
            <button onClick={() => {
              dispatch({type: 'done', payload: doneItem})
              setEndText('很棒 ✿✿ヽ(°▽°)ノ✿')
              setDoneItem({})
              fadingOut(() => {
                dispatch({ type: 'page', payload: 'dairy' })
                setEndText('')
              }, 3000)
            }}>我完成了</button>
            <button onClick={() => {
              setEndText('好的，没关系')
              setDoneItem({})
              fadingOut(() => {
                setStep(0)
                setEndText('')
              }, 3000)
            }}>不想做了</button>
          </div>
        </div>
        {endText && <div className='endText'>{endText}</div>}
      </>)}
    </div>
  )
}

const DairyDom = () => {
  const { mood, doneList } = useContext(infoContext).state
  return <div id='dairy'>
    <div className='header'>
      <div className='date'>{dayString}</div>
      <div className='week'>{weekString()}</div>
      {mood && <div className='mood'>心情：{Object.keys(moodSpace).filter(i => mood > moodSpace[i][0] && mood <= moodSpace[i][1])[0]}</div>}
    </div>
    <div className='content'>
      {doneList?.midnight && (
        <p>凌晨，{
          doneList?.midnight.map((i, index) => <span key={i.time}>{joinSentence[index > 2 ? 2 : index].replace('duration', i.duration).replace('doneSentence', i.doneSentence)}</span>)
        }</p>
      )}
      {doneList?.morning && (
        <p>上午，{
          doneList?.morning.map((i, index) => <span key={i.time}>{joinSentence[index > 2 ? 2 : index].replace('duration', i.duration).replace('doneSentence', i.doneSentence)}</span>)
        }</p>
      )}
      {doneList?.afternoon && (
        <p>下午，{
          doneList.afternoon.map((i, index) => <span key={i.time}>{joinSentence[index > 2 ? 2 : index].replace('duration', i.duration).replace('doneSentence', i.doneSentence)}</span>)
        }</p>
      )}
      {doneList?.evening && (
        <p>晚上，{
          doneList.evening.map((i, index) => <span key={i.time}>{joinSentence[index > 2 ? 2 : index].replace('duration', i.duration).replace('doneSentence', i.doneSentence)}</span>)
        }</p>
      )}
      {doneList ? <p>{endP}</p> : (
        <p>
          今天我还没有开始浪费时间，接下来做点什么好呢？点击左下方的“浪费时间”按钮，选择想要浪费的时间和事件，开始愉快地“浪费”时间吧（bushi）~
        </p>
      )}
    </div>
  </div>
}

const Container = () => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch(action.type) {
      case 'page':
        if (prevState.page !== action.type) {
          return {...prevState, page: action.payload}
        }
        return prevState
      case 'done':
        let { doneList } = {...prevState}
        const doneItem = action.payload
        const time = new Date(doneItem.time)
        Object.entries(daySpace).forEach(i => {
          const key = i[0]
          const hour = time.getHours()
          console.log(hour, 'doneItem')

          if (hour > daySpace[key][0] && hour <= daySpace[key][1]) {
            if (doneList && doneList[key]) {
              let added = false
              doneList[key] = doneList[key].map(i => {
                if (i.name === doneItem.name) {
                  console.log(i.name, doneItem.name, i, doneItem)
                  i.duration = Number(i.duration) + Number(doneItem.duration)
                  added = true
                }
                return i
              })
              console.log(doneList[key], 'listlist')
              if (!added) {
                doneList[key].push(doneItem)
              }
            } else {
              doneList = {...doneList, [key]: [doneItem]}
            }
          }
        })
        window.localStorage.setItem('doneList', JSON.stringify(doneList))
        console.log(doneList, 'doneList')
        return {...prevState, doneList}
    }
  }, {
    page: 'welcome',
    doneList: doneListData,
  })
  return (
  <infoContext.Provider value={{state, dispatch}}>
      { state.page === 'welcome' && <WelcomeDom /> }
      { state.page === 'waste-time' && <WasteTime /> }
      { state.page === 'dairy' && <DairyDom /> }
      { state.page !== 'welcome' && <button className='change-page' onClick={() => {
        dispatch({type: 'page', payload: state.page === 'dairy' ? 'waste-time' : 'dairy'})
      }}>{state.page === 'dairy' ? '浪费时间': '今日记'}</button>}
  </infoContext.Provider>)
}

ReactDOM.createRoot(document.getElementById('container')).render(<Container />)
