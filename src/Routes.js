import HomeIcon from '@material-ui/icons/Home';
import Region from './components/Region';
// import Agents from './components/Agents';

const Routes = [
  {
    path: '/',
    sidebarName: 'Change Region',
    navbarName: 'Change Region',
    icon: HomeIcon,
    component: Region
  },
  {
    path: '/owners',
    sidebarName: 'Agents',
    navbarName: 'Agents',
    icon: AccountCircle,
    component: ProfilePage
  }
];

export default Routes;