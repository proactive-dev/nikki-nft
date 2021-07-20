import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import CustomScrollbars from '../../components/CustomScrollbars'
import SidebarLogo from './SidebarLogo'
import { THEME_TYPE_LITE } from '../../constants/ThemeSetting'
import { MENUS } from '../../constants/AppConfigs'

const SidebarContent = () => {
  const settings = useSelector(state => state.settings)
  const {themeType, pathname} = settings

  const selectedKeys = pathname.substr(1)
  const defaultOpenKeys = selectedKeys.split('/')[1]

  return (
    <Fragment>
      <SidebarLogo/>
      <div className="gx-sidebar-content">
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline">
            {
              MENUS.map(({path, title}) =>
                <Menu.Item key={path}>
                  <Link to={`/${path}`}>
                    <FormattedMessage id={title}/>
                  </Link>
                </Menu.Item>
              )
            }
          </Menu>
        </CustomScrollbars>
      </div>
    </Fragment>
  )
}

export default SidebarContent
