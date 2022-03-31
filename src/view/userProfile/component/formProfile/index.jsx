import {React, useEffect, useState} from 'react'
import InputFiled from '../../../../component/form-controls/InputField'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row } from 'antd'
import RadioFiled from '../../../../component/form-controls/radioFiled'

function FormProfile(props){
   const {data}=props
   console.log('data ddaay nef',data)
   const [radio, setRadio]= useState(data.gender)
   const schema = yup.object().shape({
      username: yup.string()
   
   })
   const form = useForm({
      username:'',
      phone:'',
      gender:'',
      resolver: yupResolver(schema)
   })
   const {
      reset,
      formState: { isSubmitting }
   } = form

   useEffect(()=>{
      reset({
         username: data.username || '',
         phone:data.phone ||'',
         value:data.gender||''
      })
   },[data])
   const options = [
      { label: 'Nam', value: 'male' },
      { label: 'Nữ', value: 'female' },
      { label: 'Khác', value: 'other' },
    ];
   const onChange = e => {
      console.log('radio checked', e.target.value);
      setRadio(e.target.value);
    };
   return(
      <div>
         <div className='formProfileUser'>
            <div className='formProfileUser-left'>
               <img className='formProfileUser-left-img' src={data.avatar} />
            </div>
            <div className='formProfileUser-right'>
            <form>
                  <Row>
                     <Col span={12}>
                        <InputFiled
                           size="large"
                           name="username"
                           form={form}
                           placeholder="Họ và tên"
                           label="Họ và tên:"
                           labelCol={{ span: 24 }}
                        />
                     </Col>
                  </Row>
                  <Row>
                     <Col span={12}>
                        <RadioFiled 
                           name="gender"
                           form={form}
                           label="Gới tính:"
                           onChange={onChange}
                           options={options}
                           value={radio}
                        />
                     </Col>
                  </Row>
                  <Row>
                     <Col span={12}>
                       <InputFiled
                            size="large"
                            name="phone"
                            form={form}
                            placeholder="Số điện thoại"
                            label="Số điện thoại:"
                            labelCol={{ span: 24 }}
                       />
                     </Col>
                  </Row>
                  <Row>
                  </Row>
               </form>
            </div>

         </div>
      </div>
   )
}
export default FormProfile;