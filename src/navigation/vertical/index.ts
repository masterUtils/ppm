// ** Icon imports
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import CreditCardOutline from 'mdi-material-ui/AccountSettingsOutline'

// ** Type import
import {VerticalNavItemsType} from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
    return [
        {
            title: '仪表盘',
            icon: HomeOutline,
            path: '/'
        },
        {
            title: '设置',
            icon: CreditCardOutline,
            path: '/settings'
        },
        {
            sectionTitle: '管理'
        },
        {
            title: '题库',
            icon: Table,
            path: '/problems'
        },
        {
            title: '做题记录',
            icon: CubeOutline,
            path: '/problems/records'
        }
    ]
}

export default navigation
