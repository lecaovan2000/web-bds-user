import { Pagination, Table } from 'antd';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { constants } from '../../constants/global';

class SuperTable extends PureComponent {
   tableRef = React.createRef(null);
   reprocessData = (dataobj) => {
      let result = dataobj;
      if (dataobj.children) {
         if (dataobj.children.length === 0) {
            let { children, ...newObj } = dataobj;
            result = newObj;
         } else if (result.children.map) {
            result.children = result.children.map(this.reprocessData);
         } else {
            result.children = [this.reprocessData(result.children)];
         }
      }
      return result;
   };

   onChange = (pagination, filters, sorter, extra) => {
      if (this.props.onChange) {
         this.props.onChange(pagination, filters, sorter, extra)
      }
   }

   handleChangePagination = (pageNo, pageSize) => {
      if (this.props.onPaginate) {
         // window.scrollTo({
         //    top: this.tableRef.current.offsetTop - 128,
         //    left: 0,
         //    behavior: 'smooth',
         // });
         this.props.onPaginate(pageNo, pageSize);
      }
   };

   render() {
      const {
         rowKey,
         indentSize,
         dataSource,
         columns,
         className,
         pagination,
         hasPagination,
         submitting,
         scroll,
         bordered,
         components,
         onRow,
         rowClassName,
         onPaginate
      } = this.props;
      return (
         <div className={`ems-table ${className || ''}`} ref={this.tableRef}>
            <Table
               onChange={this.onChange}
               rowKey={rowKey || 'uid'}
               dataSource={
                  dataSource &&
                  dataSource.map &&
                  dataSource.map(this.reprocessData)
               }
               columns={columns}
               pagination={false}
               indentSize={indentSize || 28}
               loading={submitting}
               scroll={scroll}
               bordered={bordered}
               components={components}
               onRow={onRow}
               rowClassName={rowClassName}
            // loading={{indicator: <IcLoading />, spinning: submitting}}
            />
            {hasPagination && (
               <Pagination
                  showSizeChanger={false}
                  total={pagination.pageSize}
                  defaultCurrent={'1'}
                  defaultPageSize={constants.DEFAULT_PAGINATION_TABLE.pageSize}
                  onChange={this.handleChangePagination}
                  className="ems-pagination"
                  onPaginate={onPaginate}
               />
            )}
         </div>
      );
   }
}

export default withRouter(SuperTable);
