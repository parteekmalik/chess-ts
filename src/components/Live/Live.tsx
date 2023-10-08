import React from 'react'
import Board from '../board/board'
import { useParams } from 'react-router-dom'

function Live() {
  const{gameid} = useParams();
  return (
    <>
    <div className='bg-gray-600 text-white text-3xl p-4'>User: {gameid}</div>
    <Board />
    </>
  )
}

export default Live