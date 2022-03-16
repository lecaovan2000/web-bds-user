import React from 'react';
import {UserOutlined} from '@ant-design/icons';
import { NavLink, useHistory } from 'react-router-dom'
import { utilsToken } from '../../utils/token';
import { Popover } from 'antd';
import { logout } from '../auth/userSlice';
import Avatar from 'antd/lib/avatar/avatar';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

function Header(){
   const Token = utilsToken.getAccessToken()
   console.log(Token)
   const dispatch = useDispatch()
   const history = useHistory()
   return(
      <div className='header'>
         <div className='header-left'>
            <NavLink to='/' className='header-left-logo'>LoGo</NavLink>
         </div>
         <div className='header-menu'>
            <ul className='header-menu-item'>
               <NavLink to = 'dashboard' className='header-menu-item-btn'>Trang chủ</NavLink>
               <NavLink to = 'collections' className='header-menu-item-btn'>Rao tin</NavLink>
               <NavLink to = 'news' className='header-menu-item-btn'>Tin tức</NavLink>
               <NavLink to = 'introduce' className='header-menu-item-btn'>Giới thiệu</NavLink>
               <NavLink to = 'contact' className='header-menu-item-btn'>Liên hệ</NavLink>
            </ul>
         </div>
         <div className='header-login'>
            {Token ? 
            (<div>
               <Popover
               content={
                  <div>
                     <button>Tài Khoản</button>
                     <button onClick={ async()=>{
                        const userLogout = await dispatch(logout())
                        unwrapResult(userLogout)
                        history.go(0)
                     }} >Đăng Xuất</button>
                     {/* <button onClick={ async()=>{
                        try {
                           const token = utilsToken.getAccessToken()
                        const payload = {
                           token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…I0M30.SQZfdNUGNtr65tTsvcbqR0uzGlCxZXEsEYqtdPQ5RsI'
                        }
                        const userLogout = await authApi.logout(payload)
                        console.log('token nef',userLogout)
                        } catch (error) {
                           
                        }
                        
                        // history.go(0)
                     }} >Đăng Xuất</button> */}
                  </div>
                  
               }
               >
                  <div>
                     <Avatar
                        size={50}
                        src={'https://joeschmoe.io/api/v1/random'}
                        style={{
                           boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                           cursor: 'pointer'
                        }}
                     />
                  </div>
               </Popover>
               </div>)
            : 
            (<NavLink to='login'>
               <UserOutlined style={{ color:'white'}} className='header-login-icon' />
                <span className='header-login-text'>Đăng nhập</span>
            </NavLink>) }
         </div>
      </div>
   )
}
export default Header;