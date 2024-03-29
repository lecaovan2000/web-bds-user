import {React, useEffect, useState} from 'react'
import Header from '../../../component/HeaderprofieUder';
import ProjectTable from '../component/projectTableUser';
import newsApi from '../../../api/newsApi';
import { utilsToken } from '../../../utils/token';
import IconAdd from '../../../assets/icons/IconAdd';
import HeaderRight from '../../../component/HeaderprofieUder/HeaderRightAction'
import AddProjectModal from '../component/addProjectModal';
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import IconBack from '../../../assets/icons/IconBack';
import FormEditProject from '../component/formEditProject';
import { useParams } from 'react-router'
import { constants } from '../../../constants/global';
import { common } from '../../../utils/common';
import { paths } from '../../../constants/paths';


function Project(){
   const { enqueueSnackbar } = useSnackbar()
   const [dataSource,setDataSource]=useState({})
   const [loading, setLoading]=useState(false)
   const [loadingModal, setLoadingModal]=useState(false)
   const [isOpenModal,setIsOpenModal] = useState(false)
   const tokenUser = utilsToken.getAccessToken()
   const history = useHistory()
   const [isOpenModalEdit,setIsOpenModalEdit]=useState(false)
   const [dataNewsModalEdit,setDataNewsModalEdit]=useState({})
   const [pagination, setPagination] = useState(constants.DEFAULT_PAGINATION_TABLE)
   const [filters, setFilters] = useState({})
   const [sorter, setSorter]=useState({})
  
      const getNewProject = async(pagination=constants.DEFAULT_PAGINATION_TABLE)=>{
         setLoading(true)
         try {
            
            const payload={
               page: pagination.pageNo,
               page_size: pagination.pageSize,
               token:tokenUser,
               ...filters
               // title:common.convertSorter(sorter)
            }
            const res = await newsApi.getNewsByUser(payload)
            console.log('đay',res)
            setDataSource(res.data)
            setPagination({
               pageNo: res.total_page,
               pageSize:res.total
            })
         } catch (error) {
            utilsToken.checkExpiredToken(error)
            common.removeBearerToken()
            history.push(paths.root)
         }
         setLoading(false)
      }
      const handleChangePagination = (pageNo, pageSize) => {
         getNewProject({ pageNo, pageSize })
      }
      const handleSearchUser = (selectedKeys, confirm, dataIndex) =>confirm()
      
      const handleReset = (clearFilters, dataIndex) => {
         clearFilters()
   
         const newFilters = { ...filters }
         delete newFilters[dataIndex]
         setFilters(newFilters)
      }

     
      const handleChangeFilters = newFilters => {
         
         setPagination({
            ...pagination,
            pageNo: 1
         })
         // const filters = Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v != null))
         const filters = Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v != null))
         
         const editedFilters = Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, v[0]]))
         setFilters({
            filters,
            editedFilters
         })
         console.log('click filter',editedFilters)
      }
      const handleChangeSorter = newSorter => {
         // console.log('click rott', newSorter)
         if (!Array.isArray(newSorter)) {
            newSorter.order
               ? setSorter({
                    [newSorter.field]: newSorter.order === 'ascend' ? 'ASC' : 'DESC'
                 })
               : setSorter({})
         } else {
            const sorter = {}
            newSorter.forEach(item => {
               if (item.order) {
                  sorter[item.field] = item.order === 'ascend' ? 'ASC' : 'DESC'
               }
            })
            setSorter(sorter)
         }
      }
      
      
      const openModalEdit = async(record)=>{
         setLoadingModal(true)
         setIsOpenModalEdit(true)
            try {
               const response = await newsApi.getNewsDetail(record)
                  setDataNewsModalEdit(response.data)
               // console.log('dât của dự án', response)
            } catch (error) {
               enqueueSnackbar(error.message, {
                  variant: 'error'
               })
              
            }
         
            setLoadingModal(false)
      }
      const handleAddProject = async (data)=>{
         // console.log('dataa',data)
         const payload={
            title:data.title,
            type:data.type,
            city:data.city,
            district:data.district,
            street:data.street,
            price:data.price,
            acreage:data.acreage,
            bedroom_no:data.bedroom_no,
            bathroom_no:data.bathroom_no,
            token:tokenUser,
            note:data.note,
            imgs:data.imgs[0].originFileObj
            // imgs:(()=>{
            //    const files = [];
            //    for(let i = 0; i < data.imgs; i++) {
            //      files.push(data.imgs[i])
            //    }
            //    return files
            //  })()
         }
         
         try {
            const response = await newsApi.addProject(payload)
            setIsOpenModal(false)
            history.go(0)
            enqueueSnackbar(response.message, {
               variant: 'success'
            })
         } catch (error) {
            enqueueSnackbar(error.message, {
               variant: 'error'
            })
         }
      }
      const handleSubmitEdit = async(data)=>{
         console.log('data formEdit:',data)
         try {
            const payload={
               title:data.title,
                  type:data.type,
                  city:data.city,
                  district:data.district,
                  street:data.street,
                  price:data.price,
                  acreage:data.acreage,
                  bedroom_no:data.bedroom_no,
                  bathroom_no:data.bathroom_no,
                  token:tokenUser,
                  uid:data.uid,
                  imgs: (() => {
                     if (data.imgs === undefined) {
                        return data.img_info
                     }
                     return data.imgs[0].originFileObj
                  })(),
                  
               //    imgs:(()=>{
               //       const newImg =[]
               //       data.imgs.forEach((item)=>{
               //          console.log('item',item.originFileObj)
               //          newImg.push(  item.originFileObj)
               //       })
               //       return newImg;
               // })()
            }
            console.log('payload form',payload)
            const response = await newsApi.updateNews(payload)
            console.log("new edit",response)
            enqueueSnackbar(response.message,{
               variant:'success'
            })
            history.go(0)
         } catch (error) {
            enqueueSnackbar(error.message,{
               variant:"error"
            })
         }
      }
      const handleTableChange = (pagination, filters, sorter, extra) => {
         if (extra.action === 'filter') {
            handleChangeFilters(filters)
         } else if (extra.action === 'sort') {
            handleChangeSorter(sorter)
         }
      }
  useEffect(()=>{
   getNewProject(pagination)
  },[filters, sorter])
   return(
      <div>
         <Header title="Project" 
         leftComponent={
            <button className='bnt_back' onClick={()=>{history.push('/')}}>
                <IconBack/> Back
            </button>
         }
         rightComponent={
            
            <HeaderRight icon={<IconAdd/>} onClick={()=>{setIsOpenModal(true)}}/>
         }/>
         <ProjectTable
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            onPaginate={handleChangePagination}
            handleReset={handleReset}
            handleSearch={handleSearchUser}
            onTableChange={handleTableChange}
            openModal={openModalEdit}

         />
         <AddProjectModal
            isOpen={isOpenModal}
            toggle={()=>{setIsOpenModal(!isOpenModal)}}
            onSubmit={handleAddProject}
         />
         {
            !loadingModal&&(
               <FormEditProject
                  isOpen={isOpenModalEdit}
                  toggle={()=>{setIsOpenModalEdit(!isOpenModalEdit)}}
                  dataNews={dataNewsModalEdit}
                  onSave={handleSubmitEdit}
                  loading={loadingModal}
         />
            )
         } 
      </div>
   )
}
export default Project;