import { PiHandWithdrawFill } from "react-icons/pi";

import { MdVerifiedUser } from "react-icons/md";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircuitBoardIcon,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  LayoutDashboardIcon,
  Loader2,
  LogIn,
  LucideIcon,
  LucideProps,
  LucideShoppingBag,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  UserCircle2Icon,
  UserPen,
  UserX2Icon,
  X,
  ChartBarStacked,
  Target,
  Store,
  Truck
} from "lucide-react";

import { MdOutlineAccountTree } from "react-icons/md";

import { FaCartShopping } from "react-icons/fa6";
import { LiaPagerSolid } from "react-icons/lia";
import { MdMiscellaneousServices } from "react-icons/md";
import { IoIosChatbubbles } from "react-icons/io";
import { CgShutterstock } from "react-icons/cg";
import { FaCodeBranch } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { MdDataObject } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
export type Icon = LucideIcon;
import { MdClass } from "react-icons/md";
import { PiStudentDuotone } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { IoWallet } from "react-icons/io5";
import { RiFundsFill } from "react-icons/ri";
import { RiHistoryLine } from "react-icons/ri";
import { RiCustomerService2Fill } from "react-icons/ri";
import { RiColorFilterAiFill } from "react-icons/ri";
import { FaParking } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { MdSavings } from "react-icons/md";
import { SiMamp } from "react-icons/si";
import { BsChatSquareTextFill } from "react-icons/bs";
import { CgDarkMode } from "react-icons/cg";
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { FaUserAlt } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { useTheme } from "next-themes";

export const Icons = {

  dashboard: RiDashboardHorizontalFill,
  b2copy: RiColorFilterAiFill,
  wallet: IoWallet,
  ibRoom:HiMiniUsers,
  pamm: FaParking,
  funds: RiFundsFill,
  transactions: RiHistoryLine,
  logo: Command,
  helpDesk: RiCustomerService2Fill,
  login: LogIn,
  close: X,
  product: LucideShoppingBag,
  spinner: Loader2,
  kanban: CircuitBoardIcon,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  employee: UserX2Icon,
  post: FileText,
  page: File,
  userPen: UserPen,
  withdraw: PiHandWithdrawFill,
  user2: UserCircle2Icon,
  media: Image,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  mt5Accounts: MdOutlineAccountTree,
  category: ChartBarStacked,
  brand: Target,
  order: FaCartShopping,
  section: LiaPagerSolid,
  laptop: Laptop,
  chat: IoIosChatbubbles,
  service: MdMiscellaneousServices,
  stock: CgShutterstock,
  branch: FaCodeBranch,
  store: Store,
  role: FaUserShield,
  supplier: Truck,
  form: FaWpforms,
  object: MdDataObject,
  data: FaDatabase,
  student: PiStudentDuotone,
  book: FaBook,
  class: MdClass,
  savings: MdSavings,
  mam: SiMamp,
  feedback: BsChatSquareTextFill,
  theme:CgDarkMode,
  darkMode: MoonIcon,
  lightMode: SunIcon,
  user: FaUserAlt,
  settings: FaCog,
  mt5: ({...props}: LucideProps) => {
    const {theme}=useTheme()
    const color=theme=="dark"?"white":"black"
    return(
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" color={color} stroke={color} height="1em" viewBox="0 0 48 48" {...props}>
  <circle cx="24" cy="26.158" r="8.28" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round"></circle>
  <circle cx="24" cy="9.597" r="4.658" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round"></circle>
  <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M20.108 18.85c.01-.082.01-.165.01-.248v-2.37h7.764v2.37c0 .083 0 .166.01.249m.766-9.254a5.177 5.177 0 0 1 5.175 5.176v3.83a2.971 2.971 0 0 1-2.94 2.98m-13.786 0a2.98 2.98 0 0 1-2.94-2.98v-3.83a5.177 5.177 0 0 1 5.175-5.176"></path>
  <circle cx="9.658" cy="34.439" r="4.658" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round"></circle>
  <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M19.617 33.183a1.84 1.84 0 0 0-.22.115l-2.053 1.185l-3.881-6.723l2.053-1.185c.071-.042.143-.083.21-.133m-8.397 3.963a5.177 5.177 0 0 1 1.894-7.07l3.317-1.915a2.972 2.972 0 0 1 4.051 1.056m6.894 11.94a2.98 2.98 0 0 1-1.112 4.036l-3.317 1.915a5.177 5.177 0 0 1-7.07-1.894"></path>
  <circle cx="38.342" cy="34.439" r="4.658" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round"></circle>
  <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M32.274 26.442c.067.05.139.091.21.133l2.053 1.185l-3.881 6.723l-2.053-1.185a2.005 2.005 0 0 0-.22-.116m7.63 5.291a5.177 5.177 0 0 1-7.07 1.894l-3.316-1.915a2.971 2.971 0 0 1-1.112-4.036m6.894-11.94a2.98 2.98 0 0 1 4.051-1.055l3.317 1.914a5.177 5.177 0 0 1 1.894 7.07M21.244 29.9c.621.52 1.224.758 2.73.758h.26a2.523 2.523 0 0 0 2.522-2.523h0a2.523 2.523 0 0 0-2.523-2.523h-2.99v-3.954h5.513"></path>
</svg>
  )},
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  twitter: Twitter,
  check: Check,
};
